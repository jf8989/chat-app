// App.js
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Alert } from 'react-native';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

// Import the screens
import Start from './components/Start';
import Chat from './components/Chat';

// Import Firebase
import { initializeApp } from "firebase/app";
import { getFirestore, disableNetwork, enableNetwork } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import NetInfo for network connectivity
import { useNetInfo } from "@react-native-community/netinfo";

// Firebase configuration - replace with your own values from Firebase console
const firebaseConfig = {
  apiKey: "AIzaSyBgqMkMAFepGPeLJnOKSs3tIwNrTYZlirs",
  authDomain: "chat-app-91caf.firebaseapp.com",
  projectId: "chat-app-91caf",
  storageBucket: "chat-app-91caf.firebasestorage.app", // Correct bucket from Firebase console
  messagingSenderId: "278481177904",
  appId: "1:278481177904:web:067c0f94579c24ca538cf5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore database
const db = getFirestore(app);

// Initialize Firebase Storage
const storage = getStorage(app);

// Initialize Firebase Authentication with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Create the navigator
const Stack = createNativeStackNavigator();

// App component
const App = () => {
  // Network connectivity tracking
  const connectionStatus = useNetInfo();

  // Handle network status changes
  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert("Connection Lost!", "You are now offline.");
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected]);

  return (
    <ActionSheetProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Start">
          <Stack.Screen name="Start">
            {props => <Start
              isConnected={connectionStatus.isConnected}
              auth={auth} // Pass auth to Start component
              {...props}
            />}
          </Stack.Screen>
          <Stack.Screen
            name="Chat"
            options={({ route }) => ({ title: route.params.name })}
          >
            {props => <Chat
              isConnected={connectionStatus.isConnected}
              db={db}
              storage={storage}
              {...props}
            />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </ActionSheetProvider>
  );
}

export default App;