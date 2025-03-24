// components/ChatStyles.js
import { StyleSheet, Platform, Dimensions } from 'react-native';

// Get screen dimensions for responsive layouts
const { width, height } = Dimensions.get('window');

// Modern color palette that works with any background
const colors = {
    // Glass-morphic effects
    glass: {
        user: 'rgba(255, 255, 255, 0.25)',       // Semi-transparent white for user bubbles
        other: 'rgba(255, 255, 255, 0.85)',       // More opaque white for received bubbles
        system: 'rgba(255, 255, 255, 0.6)',      // Semi-transparent for system messages
        input: 'rgba(255, 255, 255, 0.8)',       // Semi-transparent input background
    },
    // Accent colors
    accent: {
        primary: '#222222',                      // Dark accent for buttons and highlights
        secondary: '#FFFFFF',                    // White accent for contrast
    },
    // Text colors
    text: {
        dark: '#000000',                         // Black for text on light backgrounds
        light: '#FFFFFF',                        // White for text on dark backgrounds
        userMessage: '#FFFFFF',                  // White for user message text
        receivedMessage: '#000000',              // Black for received message text
        subtle: 'rgba(0, 0, 0, 0.6)',            // Semi-transparent black for timestamps
        userTimestamp: 'rgba(255, 255, 255, 0.7)' // Semi-transparent white for user timestamps
    },
    // Border colors
    border: 'rgba(255, 255, 255, 0.3)',        // Semi-transparent white for borders
    // Shadow settings
    shadow: {
        color: 'rgba(0, 0, 0, 0.2)',             // Semi-transparent black for shadows
        userShadow: 'rgba(0, 0, 0, 0.4)'         // Stronger shadow for user messages
    },
    // Status colors
    status: {
        error: '#FF3B30',                        // Red for errors
        warning: '#FF9500',                      // Orange for warnings
        success: '#34C759',                      // Green for success
    }
};

const ChatStyles = StyleSheet.create({
    // Background image container
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },

    // Semi-transparent overlay for better readability
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.05)', // Very light overlay to maintain background visibility
    },

    // Main container
    container: {
        flex: 1,
    },

    // Messages list
    messagesList: {
        flex: 1,
        paddingHorizontal: 12,
    },

    // Message containers
    messageContainer: {
        marginVertical: 5,
        flexDirection: 'row',
        maxWidth: '80%',
    },
    userMessageContainer: {
        justifyContent: 'flex-end',
        alignSelf: 'flex-end',
    },
    receivedMessageContainer: {
        justifyContent: 'flex-start',
        alignSelf: 'flex-start',
    },

    // Message bubbles with glass-morphic effect
    messageBubble: {
        padding: 12,
        borderRadius: 20,
        maxWidth: '100%',
        minWidth: 60,
        borderWidth: 0.5,
        ...Platform.select({
            ios: {
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
            },
            android: {
                elevation: 5,
            },
        }),
    },
    userMessageBubble: {
        backgroundColor: colors.glass.user,
        borderColor: 'rgba(255, 255, 255, 0.5)',
        borderTopRightRadius: 4,
        shadowColor: colors.shadow.userShadow,
        // Add gradient-like border on the left and top for glass effect
        borderLeftWidth: 1,
        borderTopWidth: 1,
        borderLeftColor: 'rgba(255, 255, 255, 0.8)',
        borderTopColor: 'rgba(255, 255, 255, 0.8)',
    },
    receivedMessageBubble: {
        backgroundColor: colors.glass.other,
        borderColor: colors.border,
        borderBottomLeftRadius: 4,
        shadowColor: colors.shadow.color,
    },

    // Message text
    messageText: {
        fontSize: 16,
        lineHeight: 22,
        letterSpacing: 0.2,
    },
    userMessageText: {
        color: colors.text.userMessage,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    receivedMessageText: {
        color: colors.text.receivedMessage,
    },

    // Message metadata
    messageUsername: {
        fontWeight: '600',
        fontSize: 13,
        color: colors.text.subtle,
        marginBottom: 4,
    },
    messageTime: {
        fontSize: 11,
        color: colors.text.subtle,
        alignSelf: 'flex-end',
        marginTop: 4,
        marginLeft: 8,
    },
    userMessageTime: {
        color: colors.text.userTimestamp,
    },

    // System messages
    systemMessageContainer: {
        alignItems: 'center',
        marginVertical: 14,
    },
    systemMessageText: {
        fontSize: 13,
        color: colors.text.dark,
        backgroundColor: colors.glass.system,
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 0.5,
        borderColor: colors.border,
    },

    // Input container
    inputContainer: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 8,
        backgroundColor: colors.glass.input,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: colors.shadow.color,
                shadowOffset: { width: 0, height: -3 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
            },
            android: {
                elevation: 4,
            },
        }),
    },

    // Text input
    input: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderWidth: 0.5,
        borderColor: colors.border,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginHorizontal: 8,
        fontSize: 16,
        color: colors.text.dark,
        maxHeight: 120,
    },

    // Send button
    sendButton: {
        backgroundColor: colors.accent.primary,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 60,
        ...Platform.select({
            ios: {
                shadowColor: colors.shadow.color,
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.2,
                shadowRadius: 1,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    sendButtonText: {
        color: colors.text.light,
        fontWeight: '600',
        fontSize: 15,
    },

    // Media content
    messageImage: {
        width: width * 0.6,
        height: width * 0.45,
        borderRadius: 14,
        marginTop: 2,
        marginBottom: 2,
        backgroundColor: '#E5E5E5',
        ...Platform.select({
            ios: {
                shadowColor: colors.shadow.color,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 3,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    mapContainer: {
        width: width * 0.6,
        height: width * 0.45,
        borderRadius: 14,
        marginTop: 2,
        marginBottom: 2,
        overflow: 'hidden',
        borderWidth: 0.5,
        borderColor: colors.border,
        ...Platform.select({
            ios: {
                shadowColor: colors.shadow.color,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 3,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    map: {
        width: '100%',
        height: '100%',
    },

    // Full-screen image viewer
    fullscreenImageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
    },
    fullscreenImage: {
        width: width,
        height: height * 0.8,
        resizeMode: 'contain',
    },
    closeButtonContainer: {
        position: 'absolute',
        bottom: 40,
        width: '100%',
        alignItems: 'center',
    },
    closeButtonText: {
        color: colors.text.light,
        fontSize: 16,
        fontWeight: '500',
        padding: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 24,
        paddingHorizontal: 20,
        overflow: 'hidden',
    },

    // Date separators
    daySeparator: {
        alignItems: 'center',
        marginVertical: 16,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    daySeparatorLine: {
        flex: 1,
        height: 1,
        backgroundColor: 'rgba(224, 224, 224, 0.8)',
        marginHorizontal: 10,
        maxWidth: '30%',
    },
    daySeparatorText: {
        fontSize: 12,
        color: colors.text.dark,
        paddingHorizontal: 12,
        paddingVertical: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderRadius: 12,
        borderWidth: 0.5,
        borderColor: colors.border,
    },

    // Custom actions button
    actionButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderWidth: 0.5,
        borderColor: colors.border,
    },
    actionButtonText: {
        color: colors.accent.primary,
        fontSize: 24,
        fontWeight: 'bold',
    },

    // Loading states
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    loadingText: {
        marginTop: 10,
        color: colors.text.dark,
        fontSize: 14,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
    },

    // Empty state
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        color: colors.text.dark,
        fontSize: 16,
        textAlign: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
    },

    // Offline banner
    offlineBanner: {
        backgroundColor: 'rgba(255, 59, 48, 0.9)',
        padding: 10,
        alignItems: 'center',
    },
    offlineBannerText: {
        color: colors.text.light,
        fontWeight: '500',
    },

    // User avatar
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 8,
    },
});

export default ChatStyles;