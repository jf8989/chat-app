// components/StartStyles.js
import { StyleSheet } from 'react-native';

const StartStyles = StyleSheet.create({
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
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 5
    },
    contentBox: {
        width: '88%',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        alignItems: 'center',
        height: 'auto',
        justifyContent: 'space-evenly',
        marginBottom: '6%',
        borderRadius: 20,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 10,
    },
    inputContainer: {
        width: '100%',
        marginBottom: 20,
    },
    textInput: {
        height: 50,
        borderColor: '#757083',
        borderWidth: 1,
        width: '100%',
        padding: 10,
        color: '#000000',
        fontSize: 16,
        fontWeight: '300',
        borderRadius: 8,
    },
    colorSelection: {
        width: '100%',
        marginBottom: 20,
    },
    colorSelectionText: {
        fontSize: 16,
        fontWeight: '300',
        color: '#757083',
        marginBottom: 15,
        textAlign: 'center',
    },
    backgroundOptions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        width: '100%',
    },
    backgroundOption: {
        height: 40,
        width: 40,
        borderRadius: 8,
        margin: 5,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    selectedBackground: {
        borderWidth: 2,
        borderColor: '#3478F6',
        transform: [{ scale: 1.1 }],
    },
    backgroundThumbnail: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    button: {
        backgroundColor: '#757083',
        width: '100%',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        marginTop: 10,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default StartStyles;