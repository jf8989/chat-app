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

/**
 * Chat component - Provides a chat interface for sending and receiving messages
 * @param {Object} route - Contains route parameters from navigation
 * @param {Object} navigation - Navigation object for screen actions
 * @returns {JSX.Element} - Rendered Chat component
 */
const Chat = ({ route, navigation }) => {
    // Extract name and background color from route parameters
    const { name, backgroundColor } = route.params;

    // State for messages and input text
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');

    // Create a ref for the text input
    const inputRef = useRef(null);

    // Initialize with static messages when component mounts
    useEffect(() => {
        setMessages([
            {
                _id: 1,
                text: 'Hello developer',
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: 'React Native',
                },
                system: false,
            },
            {
                _id: 2,
                text: `${name} has entered the chat`,
                createdAt: new Date(),
                system: true,
            }
        ]);
    }, []);

    /**
     * Handle sending a new message
     * Creates a new message object and adds it to the messages state
     */
    const handleSend = () => {
        if (inputText.trim() === '') return;

        const newMessage = {
            _id: Math.random().toString(),
            text: inputText,
            createdAt: new Date(),
            user: {
                _id: 1, // Current user
                name: name,
            },
            system: false,
        };

        setMessages(previousMessages => [newMessage, ...previousMessages]);
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
        const isCurrentUser = item.user._id === 1;
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