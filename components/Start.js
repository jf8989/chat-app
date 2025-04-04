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
    Image
} from 'react-native';
import styles from './StartStyles'; // Import the styles
import { signInAnonymously } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Start = ({ navigation, isConnected, auth }) => {
    // State variables
    const [name, setName] = useState('');
    const [backgroundImage, setBackgroundImage] = useState('background1');

    // Background images for chat
    const backgrounds = {
        background1: require('../assets/background1.png'),
        background2: require('../assets/background2.png'),
        background3: require('../assets/background3.png'),
        background4: require('../assets/background4.png'),
        background5: require('../assets/background5.png'),
        background7: require('../assets/background7.png'),
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
                        backgroundImage
                    });
                })
                .catch(error => {
                    console.log('Error retrieving saved userID: ', error);
                    // Use fallback temporary ID
                    const tempUserID = `offline-${Date.now().toString()}`;
                    navigation.navigate("Chat", {
                        userID: tempUserID,
                        name: name || 'Anonymous User',
                        backgroundImage
                    });
                });
            return;
        }

        // Online authentication - use the passed auth instance
        signInAnonymously(auth)
            .then(result => {
                // Save userID for offline use
                const userID = result.user.uid;
                AsyncStorage.setItem('userID', userID);

                // Navigate to Chat screen with user info
                navigation.navigate("Chat", {
                    userID: userID,
                    name: name || 'Anonymous User',
                    backgroundImage
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
                                placeholderTextColor="rgba(117, 112, 131, 0.5)"
                            />
                        </View>

                        <View style={styles.colorSelection}>
                            <Text style={styles.colorSelectionText}>Choose Background Image:</Text>
                            <View style={styles.backgroundOptions}>
                                {Object.keys(backgrounds).map((key) => (
                                    <TouchableOpacity
                                        key={key}
                                        style={[
                                            styles.backgroundOption,
                                            backgroundImage === key && styles.selectedBackground
                                        ]}
                                        onPress={() => setBackgroundImage(key)}
                                    >
                                        <Image
                                            source={backgrounds[key]}
                                            style={styles.backgroundThumbnail}
                                        />
                                    </TouchableOpacity>
                                ))}
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