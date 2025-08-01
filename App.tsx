/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import "./global.css"
import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';



const App = () => {
  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#000000"
        translucent
      />
      <AppNavigator   />
    </SafeAreaProvider>
  );
};

export default App;
