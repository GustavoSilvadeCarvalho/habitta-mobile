import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthContext } from '../contexts/AuthContext';
import AppStack from './AppStack';
import AuthStack from './AuthStack';
import LoadingScreen from '../screens/Auth/LoadingScreen';

export default function RootNavigator() {
    const { user, isTransitioning } = useContext(AuthContext);

    return (
        <NavigationContainer>
            {isTransitioning ? (
                <LoadingScreen />
            ) : user ? (
                <AppStack />
            ) : (
                <AuthStack />
            )}
        </NavigationContainer>
    );
}