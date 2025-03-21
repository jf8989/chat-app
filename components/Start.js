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
} from 'react-native';
import styles from './StartStyles'; // Import the styles

const Start = ({ navigation }) => {
    // State variables
    const [name, setName] = useState('');
    const [backgroundColor, setBackgroundColor] = useState('#090C08');

    // Background colors for chat
    const colors = {
        black: '#090C08',
        purple: '#474056',
        grey: '#8A95A5',
        green: '#B9C6AE'
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
                                placeholderTextColor="#757083"
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
                            onPress={() => {
                                navigation.navigate('Chat', {
                                    name: name || 'Anonymous User',
                                    backgroundColor
                                });
                            }}
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