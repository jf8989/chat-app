// components/Chat.js
import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';

const Chat = ({ route }) => {
    // Get parameters from navigation
    const { name, backgroundColor } = route.params;

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <Text style={styles.text}>Welcome to the chat, {name}!</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
});

export default Chat;