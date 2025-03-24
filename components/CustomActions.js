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
 * @param {Function} props.onSend - Function to send messages (from GiftedChat)
 * @param {Object} props.storage - Firebase storage reference
 * @param {String} props.userID - Current user ID
 * @returns {JSX.Element} - Rendered component
 */
const CustomActions = ({ onSend, storage, userID }) => {
    const { showActionSheetWithOptions } = useActionSheet();

    /**
     * Upload image to Firebase Storage and send it
     * @param {String} uri - Local URI of the image
     */
    const uploadAndSendImage = async (uri) => {
        try {
            console.log("Uploading image from URI:", uri);
            const response = await fetch(uri);
            const blob = await response.blob();
            const imageRef = ref(storage, `images/${userID}-${Date.now()}`);

            console.log("Uploading to Firebase Storage...");
            // Upload image to Firebase Storage
            await uploadBytes(imageRef, blob);

            console.log("Getting download URL...");
            // Get the download URL for the image
            const imageURL = await getDownloadURL(imageRef);
            console.log("Image URL obtained:", imageURL);

            // Send the image message using onSend from GiftedChat
            onSend([{
                image: imageURL,
                createdAt: new Date(),
                user: {
                    _id: userID,
                },
            }]);
            console.log("Image message sent");
        } catch (error) {
            console.error("Error uploading image: ", error);
            Alert.alert("Upload failed", "Failed to upload the image.");
        }
    };

    /**
     * Pick image from device library
     */
    const pickImage = async () => {
        try {
            console.log("Requesting media library permissions...");
            let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
            console.log("Permissions response:", permissions);

            if (permissions?.granted) {
                console.log("Launching image library picker...");
                let result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images, // Fix: Use MediaTypeOptions instead of MediaType
                    allowsEditing: true,
                    aspect: [4, 3],
                    quality: 0.8,
                });

                console.log("Image picker result:", result);

                if (!result.canceled && result.assets && result.assets.length > 0) {
                    const imageURI = result.assets[0].uri;
                    console.log("Selected image URI:", imageURI);
                    uploadAndSendImage(imageURI);
                } else {
                    console.log("Image selection was canceled or no assets returned");
                }
            } else {
                console.log("Media library permission denied");
                Alert.alert(
                    "Permission Required",
                    "This app needs permission to access your photo library.",
                    [{ text: "OK" }]
                );
            }
        } catch (error) {
            console.error("Error picking image:", error);
            Alert.alert("Error", "Something went wrong when trying to access your photos.");
        }
    };

    /**
     * Take photo with device camera
     */
    const takePhoto = async () => {
        try {
            console.log("Requesting camera permissions...");
            let permissions = await ImagePicker.requestCameraPermissionsAsync();
            console.log("Camera permissions:", permissions);

            if (permissions?.granted) {
                console.log("Launching camera...");
                let result = await ImagePicker.launchCameraAsync({
                    allowsEditing: true,
                    aspect: [4, 3],
                    quality: 0.8,
                });

                console.log("Camera result:", result);

                if (!result.canceled && result.assets && result.assets.length > 0) {
                    const imageURI = result.assets[0].uri;
                    console.log("Captured image URI:", imageURI);
                    uploadAndSendImage(imageURI);
                } else {
                    console.log("Photo capture was canceled or no assets returned");
                }
            } else {
                console.log("Camera permission denied");
                Alert.alert(
                    "Permission Required",
                    "This app needs permission to use your camera.",
                    [{ text: "OK" }]
                );
            }
        } catch (error) {
            console.error("Error taking photo:", error);
            Alert.alert("Error", "Something went wrong when trying to use the camera.");
        }
    };

    /**
     * Get and send current location
     */
    const getLocation = async () => {
        try {
            console.log("Requesting location permissions...");
            let permissions = await Location.requestForegroundPermissionsAsync();
            console.log("Location permissions:", permissions);

            if (permissions?.granted) {
                console.log("Getting current position...");
                const location = await Location.getCurrentPositionAsync({});
                console.log("Location obtained:", location);

                if (location) {
                    // Send the location message using onSend from GiftedChat
                    onSend([{
                        location: {
                            longitude: location.coords.longitude,
                            latitude: location.coords.latitude,
                        },
                        createdAt: new Date(),
                        user: {
                            _id: userID,
                        },
                    }]);
                    console.log("Location message sent");
                }
            } else {
                console.log("Location permission denied");
                Alert.alert(
                    "Permission Required",
                    "This app needs permission to access your location.",
                    [{ text: "OK" }]
                );
            }
        } catch (error) {
            console.error("Error getting location: ", error);
            Alert.alert("Location Error", "Could not get your current location.");
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
                console.log("Selected option index:", buttonIndex);
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
            style={styles.actionButton}
            onPress={onActionPress}
            accessible={true}
            accessibilityLabel="Communication options"
            accessibilityHint="Choose to send an image, take a photo, or share your location"
            accessibilityRole="button"
        >
            <Text style={styles.actionButtonText}>+</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    actionButton: {
        width: 26,
        height: 26,
        marginRight: 10,
        borderRadius: 13,
        borderColor: '#b2b2b2',
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionButtonText: {
        color: '#b2b2b2',
        fontSize: 16,
        fontWeight: 'bold',
    }
});

export default CustomActions;