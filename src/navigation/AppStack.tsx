// src/navigation/AppStack.tsx

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AppTabs from './AppTabs';
import PropertyDetailsScreen from '../screens/App/PropertyDetailsScreen';

const Stack = createStackNavigator();

export default function AppStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="MainTabs"
                component={AppTabs}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="PropertyDetails"
                component={PropertyDetailsScreen}
                options={{
                    headerShown: false,
                    presentation: 'modal'
                }}
            />
        </Stack.Navigator>
    );
}