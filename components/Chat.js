// components/Chat.js
import React, { useState, useEffect } from 'react';
import { View, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import styles from './ChatStyles'; // Import the styles

/**
 * Chat component that implements the Gifted Chat UI
 * @param {Object} route - Contains route parameters passed from the Start screen
 * @param {Object} navigation - Navigation object for screen navigation
 * @returns {JSX.Element} - Rendered Chat component
 */
const Chat = ({ route, navigation }) => {
    // Extract name and background color from route parameters
    const { name, backgroundColor } = route.params;

    // Initialize messages state array
    const [messages, setMessages] = useState([]);

    // Set up initial messages when the component mounts
    useEffect(() => {
        // Populate the messages state with initial messages
        setMessages([
            {
                _id: 1, // Unique ID for the message
                text: 'Hello developer', // Message content
                createdAt: new Date(), // Timestamp
                user: {
                    _id: 2, // Sender's ID (2 represents the system/bot)
                    name: 'React Native',
                    avatar: 'https://placeimg.com/140/140/any',
                },
            },
            {
                _id: 2, // Unique ID for the system message
                text: `${name} has entered the chat`, // Dynamic system message
                createdAt: new Date(), // Timestamp
                system: true, // Identifies this as a system message
            }
        ]);
    }, []);

    /**
     * Handler for sending new messages
     * @param {Array} newMessages - Array of new message objects
     */
    const onSend = (newMessages = []) => {
        // Update the messages state by appending new messages to existing ones
        setMessages(previousMessages =>
            GiftedChat.append(previousMessages, newMessages)
        );
    };

    /**
     * Custom bubble component to customize message appearance
     * @param {Object} props - Properties passed to the Bubble component
     * @returns {JSX.Element} - Customized Bubble component
     */
    const renderBubble = (props) => {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: '#000' // Black bubbles for user's messages
                    },
                    left: {
                        backgroundColor: '#FFF' // White bubbles for received messages
                    }
                }}
            />
        );
    };

    return (
        <View style={[styles.container, { backgroundColor }]}>
            {/* Gifted Chat component that provides the chat UI */}
            <GiftedChat
                messages={messages} // Pass the messages state
                onSend={messages => onSend(messages)} // Handle sending messages
                user={{
                    _id: 1, // The current user's ID
                }}
                renderBubble={renderBubble} // Custom bubble component
            />
            {/* Fix for Android keyboard issues */}
            {Platform.OS === 'android' && <KeyboardAvoidingView behavior="height" />}
        </View>
    );
};

export default Chat;