// components/ChatStyles.js
import { StyleSheet } from 'react-native';

const ChatStyles = StyleSheet.create({
    container: {
        flex: 1,
    },
    messagesList: {
        flex: 1,
        padding: 10,
    },
    messageContainer: {
        marginBottom: 10,
        flexDirection: 'row',
    },
    userMessageContainer: {
        justifyContent: 'flex-end',
    },
    receivedMessageContainer: {
        justifyContent: 'flex-start',
    },
    messageBubble: {
        maxWidth: '80%',
        padding: 10,
        borderRadius: 15,
    },
    userMessageBubble: {
        backgroundColor: '#000',
        marginLeft: 'auto',
    },
    receivedMessageBubble: {
        backgroundColor: '#FFF',
    },
    messageText: {
        fontSize: 16,
    },
    userMessageText: {
        color: '#FFF',
    },
    receivedMessageText: {
        color: '#000',
    },
    messageUsername: {
        fontWeight: 'bold',
        marginBottom: 5,
        fontSize: 12,
        color: '#555',
    },
    messageTime: {
        fontSize: 10,
        color: '#999',
        alignSelf: 'flex-end',
        marginTop: 5,
    },
    systemMessageContainer: {
        alignItems: 'center',
        marginVertical: 10,
    },
    systemMessageText: {
        fontSize: 12,
        color: '#999',
        fontStyle: 'italic',
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#EEE',
        backgroundColor: '#FFF',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginRight: 10,
    },
    sendButton: {
        backgroundColor: '#000',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 20,
        justifyContent: 'center',
    },
    sendButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    // New styles for images and maps
    messageImage: {
        width: 200,
        height: 200,
        borderRadius: 10,
        marginTop: 5,
        marginBottom: 5,
    },
    mapContainer: {
        width: 200,
        height: 150,
        marginTop: 5,
        marginBottom: 5,
        borderRadius: 10,
        overflow: 'hidden',
    },
    map: {
        width: '100%',
        height: '100%',
    }
});

export default ChatStyles;