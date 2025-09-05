// src/navigation/AppStack.tsx

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AppTabs from './AppTabs';

const Stack = createStackNavigator();

export default function AppStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="MainTabs"
                component={AppTabs}
                options={{ headerShown: false }}
            />

            {/*
        Futuramente, se você precisar de uma tela de detalhes que
        cubra as abas, você a adicionará aqui. Por exemplo:
        <Stack.Screen name="PropertyDetails" component={PropertyDetailsScreen} />
      */}
        </Stack.Navigator>
    );
}