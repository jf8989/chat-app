// components/Start.js
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ImageBackground,
    Platform,
    KeyboardAvoidingView,
    Alert,
} from 'react-native';
import styles from './StartStyles'; // Import the styles
import { getAuth, signInAnonymously } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Start = ({ navigation, isConnected }) => {
    // State variables
    const [name, setName] = useState('');
    const [backgroundColor, setBackgroundColor] = useState('#090C08');

    // Initialize Firebase Authentication
    const auth = getAuth();

    // Background colors for chat
    const colors = {
        black: '#090C08',
        purple: '#474056',
        grey: '#8A95A5',
        green: '#B9C6AE'
    };

    /**
     * Handle anonymous authentication and navigation to the Chat screen
     * Uses Firebase's anonymous authentication to create a user ID
     */
    const handleStartChatting = () => {
        // Check if we're offline
        if (isConnected === false) {
            // Try to get a saved userID from AsyncStorage
            AsyncStorage.getItem('userID')
                .then(savedUserID => {
                    let userID = savedUserID;
                    // If no saved ID, create a temporary one
                    if (!userID) {
                        userID = `offline-${Date.now().toString()}`;
                    }

                    // Navigate to Chat with offline user info
                    navigation.navigate("Chat", {
                        userID: userID,
                        name: name || 'Anonymous User',
                        backgroundColor
                    });
                })
                .catch(error => {
                    console.log('Error retrieving saved userID: ', error);
                    // Use fallback temporary ID
                    const tempUserID = `offline-${Date.now().toString()}`;
                    navigation.navigate("Chat", {
                        userID: tempUserID,
                        name: name || 'Anonymous User',
                        backgroundColor
                    });
                });
            return;
        }

        // Online authentication
        signInAnonymously(auth)
            .then(result => {
                // Save userID for offline use
                const userID = result.user.uid;
                AsyncStorage.setItem('userID', userID);

                // Navigate to Chat screen with user info
                navigation.navigate("Chat", {
                    userID: userID,
                    name: name || 'Anonymous User',
                    backgroundColor
                });
            })
            .catch(error => {
                console.log('Authentication failed: ', error);
                Alert.alert("Authentication failed", "Failed to sign in anonymously");
            });
    };

    return (
        // KeyboardAvoidingView to prevent keyboard from covering input fields
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.container}>
                <ImageBackground
                    source={require('../assets/Background-Image.png')}
                    resizeMode="cover"
                    style={styles.backgroundImage}
                >
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Chat App</Text>
                    </View>

                    <View style={styles.contentBox}>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.textInput}
                                value={name}
                                onChangeText={setName}
                                placeholder="Your Name"
                                placeholderTextColor="rgba(117, 112, 131, 0.5)" // Apply opacity only to placeholder
                            />
                        </View>

                        <View style={styles.colorSelection}>
                            <Text style={styles.colorSelectionText}>Choose Background Color:</Text>
                            <View style={styles.colorOptions}>
                                <TouchableOpacity
                                    style={[styles.colorOption, { backgroundColor: colors.black },
                                    backgroundColor === colors.black && styles.selectedColor]}
                                    onPress={() => setBackgroundColor(colors.black)}
                                />
                                <TouchableOpacity
                                    style={[styles.colorOption, { backgroundColor: colors.purple },
                                    backgroundColor === colors.purple && styles.selectedColor]}
                                    onPress={() => setBackgroundColor(colors.purple)}
                                />
                                <TouchableOpacity
                                    style={[styles.colorOption, { backgroundColor: colors.grey },
                                    backgroundColor === colors.grey && styles.selectedColor]}
                                    onPress={() => setBackgroundColor(colors.grey)}
                                />
                                <TouchableOpacity
                                    style={[styles.colorOption, { backgroundColor: colors.green },
                                    backgroundColor === colors.green && styles.selectedColor]}
                                    onPress={() => setBackgroundColor(colors.green)}
                                />
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleStartChatting}
                        >
                            <Text style={styles.buttonText}>Start Chatting</Text>
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
            </View>
        </KeyboardAvoidingView>
    );
};

export default Start;