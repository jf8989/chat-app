// components/Chat.js
import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    Image,
    Modal,
    StatusBar,
    ActivityIndicator,
    ImageBackground
} from 'react-native';
import styles from './ChatStyles';
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomActions from './CustomActions';
import MapView, { Marker } from 'react-native-maps';

/**
 * Get formatted date for messages
 * @param {Date} date - Date to format
 * @returns {String} - Formatted date string
 */
const getFormattedDate = (date) => {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    // Check if date is today
    if (date.toDateString() === now.toDateString()) {
        return 'Today';
    }

    // Check if date is yesterday
    if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
    }

    // Otherwise return full date
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

/**
 * Chat component - Provides a chat interface for sending and receiving messages
 * @param {Object} route - Contains route parameters from navigation
 * @param {Object} navigation - Navigation object for screen actions
 * @param {Object} db - Firestore database instance
 * @param {Object} storage - Firebase storage instance
 * @param {Boolean} isConnected - Network connectivity status
 * @returns {JSX.Element} - Rendered Chat component
 */
const Chat = ({ route, navigation, db, storage, isConnected }) => {
    // Extract name, user ID and background image from route parameters
    const { name, userID, backgroundImage } = route.params;

    // Get the correct background image based on the selected key
    const getBackgroundSource = () => {
        switch (backgroundImage) {
            case 'background1': return require('../assets/background1.png');
            case 'background2': return require('../assets/background2.png');
            case 'background3': return require('../assets/background3.png');
            case 'background4': return require('../assets/background4.png');
            case 'background5': return require('../assets/background5.png');
            case 'background7': return require('../assets/background7.png');
            default: return require('../assets/background1.png');
        }
    };

    // State for messages and input text
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [sending, setSending] = useState(false);

    // Create a ref for the FlatList and input
    const flatListRef = useRef(null);
    const inputRef = useRef(null);

    // Setup keyboard listeners
    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setKeyboardVisible(true);
            }
        );

        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardVisible(false);
            }
        );

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    /**
     * Cache messages to AsyncStorage for offline access
     * @param {Array} messagesToCache - Messages array to store
     */
    const cacheMessages = async (messagesToCache) => {
        try {
            await AsyncStorage.setItem('messages', JSON.stringify(messagesToCache));
        } catch (error) {
            console.error('Error caching messages: ', error);
        }
    };

    /**
     * Load cached messages from AsyncStorage
     */
    const loadCachedMessages = async () => {
        try {
            const cachedMessages = await AsyncStorage.getItem('messages');
            if (cachedMessages) {
                // Parse the cached messages
                const parsedMessages = JSON.parse(cachedMessages);

                // Convert createdAt strings back to Date objects
                const messagesWithDateObjects = parsedMessages.map(message => ({
                    ...message,
                    createdAt: new Date(message.createdAt)
                }));

                setMessages(messagesWithDateObjects);
            }
        } catch (error) {
            console.error('Error loading cached messages: ', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Set up Firestore listener for messages when component mounts
    useEffect(() => {
        // Set screen title with username
        navigation.setOptions({
            title: name,
            headerStyle: {
                backgroundColor: '#3478F6',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: '600',
            }
        });

        let unsubscribe = null;

        if (isConnected) {
            // Create query for messages sorted by creation time (newest first)
            const q = query(
                collection(db, "messages"),
                orderBy("createdAt", "desc")
            );

            // Set up real-time listener for messages when online
            unsubscribe = onSnapshot(q, (querySnapshot) => {
                let newMessages = [];
                querySnapshot.forEach(doc => {
                    // Get data from each message document
                    const messageData = doc.data();
                    // Convert Firestore timestamp to Date object
                    const createdAt = messageData.createdAt ? new Date(messageData.createdAt.toMillis()) : new Date();

                    newMessages.push({
                        _id: doc.id,
                        text: messageData.text || "",  // Handle messages without text
                        createdAt: createdAt,
                        user: messageData.user,
                        image: messageData.image || null,  // Add image field
                        location: messageData.location || null,  // Add location field
                        system: messageData.system || false
                    });
                });

                // Update state with new messages
                setMessages(newMessages);
                // Cache messages for offline access
                cacheMessages(newMessages);
                setIsLoading(false);
            });
        } else {
            // Load messages from cache when offline
            loadCachedMessages();
        }

        // Clean up listener on component unmount
        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [isConnected]);

    /**
     * Handle sending a new text message
     * Creates a new message object and adds it to Firestore
     */
    const handleSend = async () => {
        if (inputText.trim() === '') return;

        setSending(true);

        const newMessage = {
            text: inputText,
            createdAt: new Date(),
            user: {
                _id: userID,
                name: name,
            },
            system: false,
        };

        // Clear input immediately for better UX
        setInputText('');

        try {
            // Add message to Firestore
            await addDoc(collection(db, "messages"), newMessage);
            console.log("Message sent successfully");

            // Focus back on input field
            if (inputRef.current) {
                inputRef.current.focus();
            }
        } catch (error) {
            console.error("Error sending message: ", error);
            Alert.alert("Error", "Failed to send message. Please try again.");
        } finally {
            setSending(false);
        }
    };

    /**
     * Handles opening an image in full-screen mode
     * @param {String} imageUri - URI of the image to display
     */
    const handleImagePress = (imageUri) => {
        setSelectedImage(imageUri);
    };

    /**
     * Group messages by date for better visual organization
     * @param {Array} msgList - List of messages
     * @returns {Array} - Messages with date separators
     */
    const groupMessagesByDate = (msgList) => {
        if (!msgList || msgList.length === 0) return [];

        const groupedMessages = [];
        let currentDate = null;

        // Sort messages by date (newest to oldest)
        const sortedMessages = [...msgList].sort((a, b) =>
            new Date(b.createdAt) - new Date(a.createdAt)
        );

        sortedMessages.forEach(message => {
            const messageDate = new Date(message.createdAt);
            const dateString = messageDate.toDateString();

            // If we've moved to a new date, add a date separator
            if (dateString !== currentDate) {
                currentDate = dateString;
                groupedMessages.push({
                    _id: `date-${dateString}`,
                    createdAt: messageDate,
                    system: true,
                    text: getFormattedDate(messageDate),
                    dateSeparator: true,
                });
            }

            groupedMessages.push(message);
        });

        return groupedMessages;
    };

    /**
     * Renders a date separator between messages from different days
     * @param {Object} item - Date separator item
     * @returns {JSX.Element} - Rendered date separator
     */
    const renderDateSeparator = (item) => (
        <View style={styles.daySeparator}>
            <View style={styles.daySeparatorLine} />
            <Text style={styles.daySeparatorText}>{item.text}</Text>
            <View style={styles.daySeparatorLine} />
        </View>
    );

    /**
     * Renders an individual message in the chat
     * @param {Object} item - The message object to render
     * @returns {JSX.Element} - The rendered message component
     */
    const renderMessage = ({ item }) => {
        // Date separator
        if (item.dateSeparator) {
            return renderDateSeparator(item);
        }

        // System message
        if (item.system && !item.dateSeparator) {
            return (
                <View style={styles.systemMessageContainer}>
                    <Text style={styles.systemMessageText}>{item.text}</Text>
                </View>
            );
        }

        // User message (right) or received message (left)
        const isCurrentUser = item.user?._id === userID;

        // Format time with fallback
        let timeDisplay = "N/A";
        try {
            // Ensure createdAt is a Date object
            const date = item.createdAt instanceof Date ?
                item.createdAt : new Date(item.createdAt);

            timeDisplay = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch (error) {
            console.log("Error formatting message time", error);
        }

        return (
            <View style={[
                styles.messageContainer,
                isCurrentUser ? styles.userMessageContainer : styles.receivedMessageContainer
            ]}>
                <View style={[
                    styles.messageBubble,
                    isCurrentUser ? styles.userMessageBubble : styles.receivedMessageBubble
                ]}>
                    {!isCurrentUser && (
                        <Text style={styles.messageUsername}>{item.user?.name || 'Anonymous'}</Text>
                    )}

                    {/* Render text message if it exists */}
                    {item.text ? (
                        <Text style={[
                            styles.messageText,
                            isCurrentUser ? styles.userMessageText : styles.receivedMessageText
                        ]}>
                            {item.text}
                        </Text>
                    ) : null}

                    {/* Render image if it exists - now touchable */}
                    {item.image && (
                        <TouchableOpacity
                            onPress={() => handleImagePress(item.image)}
                            accessible={true}
                            accessibilityLabel="Chat image"
                            accessibilityHint="Tap to view full-sized image"
                            accessibilityRole="image"
                        >
                            <Image
                                source={{ uri: item.image }}
                                style={styles.messageImage}
                                resizeMode="cover"
                            />
                        </TouchableOpacity>
                    )}

                    {/* Render location map if it exists */}
                    {item.location && (
                        <View style={styles.mapContainer}>
                            <MapView
                                style={styles.map}
                                initialRegion={{
                                    latitude: item.location.latitude,
                                    longitude: item.location.longitude,
                                    latitudeDelta: 0.0922,
                                    longitudeDelta: 0.0421,
                                }}
                            >
                                <Marker
                                    coordinate={{
                                        latitude: item.location.latitude,
                                        longitude: item.location.longitude,
                                    }}
                                    pinColor="#3478F6"
                                />
                            </MapView>
                        </View>
                    )}

                    <Text style={[
                        styles.messageTime,
                        isCurrentUser && styles.userMessageTime
                    ]}>
                        {timeDisplay}
                    </Text>
                </View>
            </View>
        );
    };

    // Group messages by date and prepare for rendering
    const displayMessages = groupMessagesByDate(messages);

    return (
        <ImageBackground
            source={getBackgroundSource()}
            style={styles.backgroundImage}
            resizeMode="cover"
        >
            {/* Semi-transparent overlay for better readability */}
            <View style={styles.overlay}>
                <StatusBar barStyle="light-content" />

                {/* Loading indicator */}
                {isLoading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#3478F6" />
                        <Text style={styles.loadingText}>Loading messages...</Text>
                    </View>
                )}

                {/* Full-screen image modal */}
                <Modal
                    visible={selectedImage !== null}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setSelectedImage(null)}
                >
                    <StatusBar barStyle="light-content" backgroundColor="#000000" />
                    <TouchableOpacity
                        style={styles.fullscreenImageContainer}
                        onPress={() => setSelectedImage(null)}
                        accessible={true}
                        accessibilityLabel="Full screen image view"
                        accessibilityHint="Tap anywhere to close"
                        accessibilityRole="button"
                    >
                        <Image
                            source={{ uri: selectedImage }}
                            style={styles.fullscreenImage}
                            resizeMode="contain"
                        />
                        <View style={styles.closeButtonContainer}>
                            <Text style={styles.closeButtonText}>Tap anywhere to close</Text>
                        </View>
                    </TouchableOpacity>
                </Modal>

                {/* Offline indicator */}
                {!isConnected && (
                    <View style={styles.offlineBanner}>
                        <Text style={styles.offlineBannerText}>
                            You're offline. Messages will appear when you reconnect.
                        </Text>
                    </View>
                )}

                {/* Message list */}
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                    keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
                >
                    {!isLoading && (
                        <FlatList
                            ref={flatListRef}
                            data={displayMessages}
                            renderItem={renderMessage}
                            keyExtractor={item => item._id.toString()}
                            style={styles.messagesList}
                            contentContainerStyle={{
                                paddingBottom: keyboardVisible ? 100 : 80,
                                paddingTop: 10
                            }}
                            inverted
                            showsVerticalScrollIndicator={false}
                            ListEmptyComponent={() => (
                                <View style={styles.emptyContainer}>
                                    <Text style={styles.emptyText}>
                                        No messages yet. Start the conversation!
                                    </Text>
                                </View>
                            )}
                        />
                    )}

                    {/* Message input area - only shown when online */}
                    {isConnected && (
                        <View style={styles.inputContainer}>
                            <CustomActions
                                storage={storage}
                                userID={userID}
                                onSend={(messageArray) => {
                                    console.log("onSend called with messages:", messageArray);
                                    // Add the message to Firestore
                                    if (messageArray && messageArray.length > 0) {
                                        addDoc(collection(db, "messages"), messageArray[0])
                                            .then(() => console.log("Message added to Firestore"))
                                            .catch(error => console.error("Error adding message:", error));
                                    }
                                }}
                            />
                            <TextInput
                                ref={inputRef}
                                style={styles.input}
                                value={inputText}
                                onChangeText={setInputText}
                                placeholder="Message"
                                placeholderTextColor="#8E8E93"
                                multiline={true}
                                maxHeight={100}
                            />
                            <TouchableOpacity
                                style={[
                                    styles.sendButton,
                                    { opacity: inputText.trim() && !sending ? 1 : 0.5 }
                                ]}
                                onPress={handleSend}
                                disabled={!inputText.trim() || sending}
                                accessible={true}
                                accessibilityLabel="Send message"
                                accessibilityHint="Sends your message to the chat"
                            >
                                {sending ? (
                                    <ActivityIndicator size="small" color="#FFFFFF" />
                                ) : (
                                    <Text style={styles.sendButtonText}>Send</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    )}
                </KeyboardAvoidingView>
            </View>
        </ImageBackground>
    );
};

export default Chat;