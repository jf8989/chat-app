// components/Start.js
import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ImageBackground,
    Platform,
    KeyboardAvoidingView,
} from 'react-native';

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
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleContainer: {
        marginTop: 60,
        marginBottom: 'auto',
    },
    title: {
        fontSize: 45,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    contentBox: {
        width: '88%',
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        height: '44%',
        justifyContent: 'space-evenly',
        marginBottom: '6%',
    },
    inputContainer: {
        width: '88%',
    },
    textInput: {
        height: 50,
        borderColor: '#757083',
        borderWidth: 1,
        width: '100%',
        padding: 10,
        color: '#757083',
        fontSize: 16,
        fontWeight: '300',
        opacity: 0.5,
    },
    colorSelection: {
        width: '88%',
    },
    colorSelectionText: {
        fontSize: 16,
        fontWeight: '300',
        color: '#757083',
        marginBottom: 10,
    },
    colorOptions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
    },
    colorOption: {
        height: 50,
        width: 50,
        borderRadius: 25,
    },
    selectedColor: {
        borderWidth: 2,
        borderColor: '#757083',
    },
    button: {
        backgroundColor: '#757083',
        width: '88%',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default Start;