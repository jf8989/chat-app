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
    Keyboard
} from 'react-native';
import styles from './ChatStyles';
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";

/**
 * Chat component - Provides a chat interface for sending and receiving messages
 * @param {Object} route - Contains route parameters from navigation
 * @param {Object} navigation - Navigation object for screen actions
 * @param {Object} db - Firestore database instance
 * @returns {JSX.Element} - Rendered Chat component
 */
const Chat = ({ route, navigation, db }) => {
    // Extract name, user ID and background color from route parameters
    const { name, userID, backgroundColor } = route.params;

    // State for messages and input text
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');

    // Create a ref for the text input
    const inputRef = useRef(null);

    // Set up Firestore listener for messages when component mounts
    useEffect(() => {
        // Set screen title with username
        navigation.setOptions({ title: name });

        // Create query for messages sorted by creation time (newest first)
        const q = query(
            collection(db, "messages"),
            orderBy("createdAt", "desc")
        );

        // Set up real-time listener for messages
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            let newMessages = [];
            querySnapshot.forEach(doc => {
                // Get data from each message document
                const messageData = doc.data();
                // Convert Firestore timestamp to Date object
                const createdAt = messageData.createdAt ? new Date(messageData.createdAt.toMillis()) : new Date();

                newMessages.push({
                    _id: doc.id,
                    text: messageData.text,
                    createdAt: createdAt,
                    user: messageData.user,
                    system: messageData.system || false
                });
            });

            // Update state with new messages
            setMessages(newMessages);
        });

        // Clean up listener on component unmount
        return () => unsubscribe();
    }, []);

    /**
     * Handle sending a new message
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
                    <Text style={[
                        styles.messageText,
                        isCurrentUser ? styles.userMessageText : styles.receivedMessageText
                    ]}>
                        {item.text}
                    </Text>
                    <Text style={styles.messageTime}>
                        {item.createdAt.getHours()}:{String(item.createdAt.getMinutes()).padStart(2, '0')}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={[styles.container, { backgroundColor }]}
            keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
            {/* Message list - inverted to show newest messages at the bottom */}
            <FlatList
                data={messages}
                renderItem={renderMessage}
                keyExtractor={item => item._id.toString()}
                style={styles.messagesList}
                inverted
            />

            {/* Message input area */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder="Type a message..."
                    placeholderTextColor="#999"
                    ref={inputRef}
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
        </KeyboardAvoidingView>
    );
};

export default Chat;