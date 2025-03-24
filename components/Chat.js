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
    Image
} from 'react-native';
import styles from './ChatStyles';
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomActions from './CustomActions';
import MapView, { Marker } from 'react-native-maps';

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
    // Extract name, user ID and background color from route parameters
    const { name, userID, backgroundColor } = route.params;

    // State for messages and input text
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [keyboardVisible, setKeyboardVisible] = useState(false);

    // Create a ref for the FlatList
    const flatListRef = useRef(null);

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
        }
    };

    // Set up Firestore listener for messages when component mounts
    useEffect(() => {
        // Set screen title with username
        navigation.setOptions({ title: name });

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
    const handleSend = () => {
        if (inputText.trim() === '') return;

        const newMessage = {
            text: inputText,
            createdAt: new Date(),
            user: {
                _id: userID,
                name: name,
            },
            system: false,
        };

        // Add message to Firestore
        addDoc(collection(db, "messages"), newMessage);
        setInputText('');
    };

    /**
     * Handle sending an image message
     * @param {String} imageUrl - URL of the image to send
     */
    const handleSendImage = (imageUrl) => {
        const newMessage = {
            text: "",
            image: imageUrl,
            createdAt: new Date(),
            user: {
                _id: userID,
                name: name,
            },
            system: false,
        };

        // Add message to Firestore
        addDoc(collection(db, "messages"), newMessage);
    };

    /**
     * Handle sending a location message
     * @param {Object} location - Object containing latitude and longitude
     */
    const handleSendLocation = (location) => {
        const newMessage = {
            text: "",
            location: location,
            createdAt: new Date(),
            user: {
                _id: userID,
                name: name,
            },
            system: false,
        };

        // Add message to Firestore
        addDoc(collection(db, "messages"), newMessage);
    };

    /**
     * Renders an individual message in the chat
     * @param {Object} item - The message object to render
     * @returns {JSX.Element} - The rendered message component
     */
    const renderMessage = ({ item }) => {
        // System message
        if (item.system) {
            return (
                <View style={styles.systemMessageContainer}>
                    <Text style={styles.systemMessageText}>{item.text}</Text>
                </View>
            );
        }

        // User message (right) or received message (left)
        const isCurrentUser = item.user._id === userID;

        // Format time with fallback
        let timeDisplay = "N/A";
        try {
            // Ensure createdAt is a Date object
            const date = item.createdAt instanceof Date ?
                item.createdAt : new Date(item.createdAt);

            timeDisplay = `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
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
                        <Text style={styles.messageUsername}>{item.user.name}</Text>
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

                    {/* Render image if it exists */}
                    {item.image && (
                        <Image
                            source={{ uri: item.image }}
                            style={styles.messageImage}
                            resizeMode="cover"
                        />
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
                                />
                            </MapView>
                        </View>
                    )}

                    <Text style={styles.messageTime}>
                        {timeDisplay}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView
            style={[styles.container, { backgroundColor }]}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 80}
        >
            {/* Message list */}
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={item => item._id.toString()}
                style={[
                    styles.messagesList,
                    { marginBottom: isConnected ? (keyboardVisible ? 0 : 60) : 0 }
                ]}
                contentContainerStyle={{ paddingBottom: keyboardVisible ? 80 : 10 }}
                inverted
            />

            {/* Message input area - only shown when online */}
            {isConnected && (
                <View style={[
                    styles.inputContainer,
                    {
                        position: 'absolute',
                        bottom: keyboardVisible ? 0 : 0,
                        left: 0,
                        right: 0,
                        backgroundColor: '#fff'
                    }
                ]}>
                    <CustomActions
                        onSendImage={handleSendImage}
                        onSendLocation={handleSendLocation}
                        storage={storage}
                        userID={userID}
                    />
                    <TextInput
                        style={styles.input}
                        value={inputText}
                        onChangeText={setInputText}
                        placeholder="Type a message..."
                        placeholderTextColor="#999"
                        returnKeyType="send"
                        onSubmitEditing={handleSend}
                    />
                    <TouchableOpacity
                        style={styles.sendButton}
                        onPress={handleSend}
                        accessible={true}
                        accessibilityLabel="Send message"
                        accessibilityHint="Sends your message to the chat"
                    >
                        <Text style={styles.sendButtonText}>Send</Text>
                    </TouchableOpacity>
                </View>
            )}
        </KeyboardAvoidingView>
    );
};

export default Chat;