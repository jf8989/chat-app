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
        color: '#000000', // Change to black for better visibility
        fontSize: 16,
        fontWeight: '300',
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

export default StartStyles;