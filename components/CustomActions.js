// components/CustomActions.js
import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Alert } from 'react-native';
import { useActionSheet } from '@expo/react-native-action-sheet';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

/**
 * CustomActions component - Provides action buttons for additional chat features
 * @param {Object} props - Component props
 * @param {Object} props.wrapperStyle - Style for wrapper
 * @param {Function} props.onSend - Function to send messages
 * @param {Object} props.storage - Firebase storage reference
 * @param {String} props.userID - Current user ID
 * @returns {JSX.Element} - Rendered component
 */
const CustomActions = ({ wrapperStyle, iconTextStyle, onSend, storage, userID }) => {
    const { showActionSheetWithOptions } = useActionSheet();

    /**
     * Upload image to Firebase Storage and send it
     * @param {String} uri - Local URI of the image
     */
    const uploadAndSendImage = async (uri) => {
        try {
            const response = await fetch(uri);
            const blob = await response.blob();
            const imageRef = ref(storage, `images/${userID}-${Date.now()}`);

            // Upload image to Firebase Storage
            await uploadBytes(imageRef, blob);

            // Get the download URL for the image
            const imageURL = await getDownloadURL(imageRef);

            // Send the image message
            onSend({
                image: imageURL,
                createdAt: new Date(),
                user: {
                    _id: userID,
                },
            });
        } catch (error) {
            console.error("Error uploading image: ", error);
            Alert.alert("Upload failed", "Failed to upload the image.");
        }
    };

    /**
     * Pick image from device library
     */
    const pickImage = async () => {
        let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissions?.granted) {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });

            if (!result.canceled) {
                const imageURI = result.assets[0].uri;
                uploadAndSendImage(imageURI);
            }
        } else {
            Alert.alert("Permissions required", "Permission to access the library is required.");
        }
    };

    /**
     * Take photo with device camera
     */
    const takePhoto = async () => {
        let permissions = await ImagePicker.requestCameraPermissionsAsync();

        if (permissions?.granted) {
            let result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });

            if (!result.canceled) {
                const imageURI = result.assets[0].uri;
                uploadAndSendImage(imageURI);
            }
        } else {
            Alert.alert("Permissions required", "Permission to use the camera is required.");
        }
    };

    /**
     * Get and send current location
     */
    const getLocation = async () => {
        let permissions = await Location.requestForegroundPermissionsAsync();

        if (permissions?.granted) {
            try {
                const location = await Location.getCurrentPositionAsync({});

                if (location) {
                    onSend({
                        location: {
                            longitude: location.coords.longitude,
                            latitude: location.coords.latitude,
                        },
                        createdAt: new Date(),
                        user: {
                            _id: userID,
                        },
                    });
                }
            } catch (error) {
                console.error("Error getting location: ", error);
                Alert.alert("Location Error", "Could not get your current location.");
            }
        } else {
            Alert.alert("Permissions required", "Permission to access location is required.");
        }
    };

    /**
     * Show ActionSheet with communication options
     */
    const onActionPress = () => {
        const options = ['Choose From Library', 'Take Photo', 'Share Location', 'Cancel'];
        const cancelButtonIndex = options.length - 1;

        showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
            },
            async (buttonIndex) => {
                switch (buttonIndex) {
                    case 0:
                        pickImage();
                        break;
                    case 1:
                        takePhoto();
                        break;
                    case 2:
                        getLocation();
                        break;
                }
            }
        );
    };

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onActionPress}
            accessible={true}
            accessibilityLabel="Communication options"
            accessibilityHint="Choose to send an image, take a photo, or share your location"
            accessibilityRole="button"
        >
            <View style={[styles.wrapper, wrapperStyle]}>
                <Text style={[styles.iconText, iconTextStyle]}>+</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 26,
        height: 26,
        marginLeft: 10,
        marginBottom: 10,
    },
    wrapper: {
        borderRadius: 13,
        borderColor: '#b2b2b2',
        borderWidth: 2,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconText: {
        color: '#b2b2b2',
        fontSize: 16,
        fontWeight: 'bold',
        backgroundColor: 'transparent',
    },
});

export default CustomActions;