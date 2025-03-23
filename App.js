// App.js
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Alert } from 'react-native';

// Import the screens
import Start from './components/Start';
import Chat from './components/Chat';

// Import Firebase
import { initializeApp } from "firebase/app";
import { getFirestore, disableNetwork, enableNetwork } from "firebase/firestore";

// Import NetInfo for network connectivity
import { useNetInfo } from "@react-native-community/netinfo";

// Firebase configuration - replace with your own values from Firebase console
const firebaseConfig = {
  apiKey: "AIzaSyBgqMkMAFepGPeLJnOKSs3tIwNrTYZlirs",
  authDomain: "chat-app-91caf.firebaseapp.com",
  projectId: "chat-app-91caf",
  storageBucket: "chat-app-91caf.firebasestorage.app",
  messagingSenderId: "278481177904",
  appId: "1:278481177904:web:067c0f94579c24ca538cf5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore database
const db = getFirestore(app);

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
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen name="Start">
          {props => <Start
            isConnected={connectionStatus.isConnected}
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
            {...props}
          />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;