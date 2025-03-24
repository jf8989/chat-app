# 💬 React Native Mobile Chat App

![React Native](https://img.shields.io/badge/React%20Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

A mobile chat application built with React Native and Expo that allows users to enter a chat room, send messages, images, and share their location.

<p align="center">
  <i>Connect with friends, family, or fellow developers anytime, anywhere!</i>
</p>

## 🚀 Project Description

This application provides users with a sleek chat interface and options to share images and their location. Built using React Native, this cross-platform app works on both Android and iOS devices with a single codebase!

### ✨ Key Features

- 🎨 **Personalized UI** - Choose your chat background color for a customized experience
- 💬 **Real-time Chat** - Exchange messages with friends and family instantly
- 📷 **Image Sharing** - Send photos from your camera or library
- 🗺️ **Location Sharing** - Let others know where you are with a tap
- 📱 **Offline Access** - Read your conversations even without internet connection
- ♿ **Accessibility** - Fully compatible with screen readers

### 👤 User Stories

- ✅ As a new user, I want to **easily enter a chat room** so I can quickly start talking to my friends and family
- ✅ As a user, I want to **send messages** to exchange the latest news
- ✅ As a user, I want to **send images** to show what I'm currently doing
- ✅ As a user, I want to **share my location** with friends
- ✅ As a user, I want to **read messages offline** so I can reread conversations anytime
- ✅ As a user with a visual impairment, I want the app to be **compatible with screen readers**

## 🛠️ Technologies Used

- **Frontend**
  - React Native - Core framework
  - Expo - Development platform
  - React Navigation - Navigation between screens
  - Expo Image Picker - Camera and image library access
  - Expo Location - Location services
  - React Native Maps - Map display for location sharing
  
- **Backend & Storage**
  - Google Firestore Database - Real-time message storage
  - Google Firebase Authentication - Anonymous user authentication
  - Firebase Cloud Storage - Storage for images
  - AsyncStorage - Offline data persistence

## 📱 Screenshots

*Please check the repository for demonstration video*

## ⚙️ Setup and Installation

### Prerequisites

- 📦 Node.js
- 🧰 Expo CLI
- 📱 Expo Go app (for physical device testing)
- 🤖 Android Studio (for Android Emulator)
- 🍎 Xcode (for iOS Simulator, Mac only)
- 🔥 Firebase Account

### Installation Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/jf8989/chat-app.git
   ```

2. **Navigate to the project directory**:
   ```bash
   cd chat-app
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Firebase Setup**:
   - Create a Firebase project at [firebase.google.com](https://firebase.google.com)
   - Enable Firestore Database
   - Enable Firebase Authentication (Anonymous)
   - Enable Firebase Storage
   - Set Storage security rules to allow authenticated reads and writes:
     ```
     rules_version = '2';
     service firebase.storage {
       match /b/{bucket}/o {
         match /{allPaths=**} {
           allow read, write: if request.auth != null;
         }
       }
     }
     ```
   - Get your Firebase configuration details (apiKey, authDomain, etc.)
   - Update the Firebase configuration in App.js with your values:
     ```javascript
     const firebaseConfig = {
       apiKey: "YOUR_API_KEY",
       authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
       projectId: "YOUR_PROJECT_ID",
       storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
       messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
       appId: "YOUR_APP_ID"
     };
     ```

5. **Install required dependencies**:
   ```bash
   expo install @react-navigation/native @react-navigation/native-stack
   expo install @react-native-async-storage/async-storage
   expo install @react-native-community/netinfo
   expo install expo-image-picker
   expo install expo-location
   expo install react-native-maps
   expo install @expo/react-native-action-sheet
   npm install firebase
   ```

6. **Start the Expo development server**:
   ```bash
   npx expo start
   ```

7. **Run on your preferred platform**:
   - 📱 Scan the QR code with Expo Go (Android) or Camera app (iOS)
   - 🤖 Press 'a' to launch on Android Emulator
   - 🍎 Press 'i' to launch on iOS Simulator (Mac only)

## 🎯 Implemented Features

### Start Screen
- 📝 User name input field
- 🎨 Background color selection (4 options)
- ▶️ "Start Chatting" button to enter the chat
- 🔐 Anonymous authentication with Firebase

### Chat Screen
- 👤 User's name displayed in navigation bar
- 🎨 Custom background color based on selection
- 💬 Real-time messaging with Firestore
- 📸 Image sharing (camera and library)
- 📍 Location sharing with interactive maps
- 🔄 Network connectivity detection
- 📴 Offline message caching with AsyncStorage
- ♿ Accessibility support for screen readers

### Communication Features
- 📱 Custom action menu for additional options
- 📤 Image uploading to Firebase Storage
- 🗺️ Location sharing with MapView
- 🔄 Real-time updates across devices

## 👨‍💻 Development Process

This application was developed as part of the Full-Stack Web Development Program at Career Foundry. The app was created through a series of exercises that gradually added functionality to meet the project requirements.

## 📋 Progress Tracker

- [x] Setup development environment
- [x] Create Start screen with UI elements
- [x] Implement navigation between screens
- [x] Implement chat UI
- [x] Set up Firebase authentication
- [x] Implement data storage with Firestore
- [x] Add offline storage capabilities
- [x] Implement image sharing
- [x] Implement location sharing
- [x] Add accessibility features

## 📄 License

This project is licensed under the MIT License

---

<p align="center">
  Made with ❤️ by Juan Francisco
</p>