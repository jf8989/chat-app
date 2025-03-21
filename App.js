// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import the screens
import Start from './components/Start';
import Chat from './components/Chat';

// Import Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

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
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen name="Start" component={Start} />
        <Stack.Screen
          name="Chat"
          options={({ route }) => ({ title: route.params.name })}
        >
          {props => <Chat db={db} {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;