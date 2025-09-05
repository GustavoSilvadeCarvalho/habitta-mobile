// CÓDIGO NOVO (COM ESTILIZAÇÃO)
// src/navigation/AppTabs.tsx

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { StyleSheet } from 'react-native';

// Importe suas telas
import HomeScreen from '../screens/App/HomeScreen';
import FavoritesScreen from '../screens/App/FavoritesScreen';
import ProfileScreen from '../screens/App/ProfileScreen';
import { COLORS } from '../constants/colors';

const Tab = createBottomTabNavigator();

export default function AppTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarShowLabel: false,
                tabBarStyle: {
                    elevation: 0,
                    backgroundColor: 'transparent',
                    height: 70,
                    borderTopColor: COLORS.gray,
                    borderTopWidth: 0,
                    paddingBottom: 5,
                    borderRadius: 15,
                    position: 'absolute',
                    marginLeft: '5%',
                    marginRight: '5%',
                    width: 'auto',
                    bottom: 50,
                },

                tabBarBackground: () => (
                    <BlurView tint="light" intensity={80} style={StyleSheet.absoluteFillObject} />
                ),

                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.gray,

                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                },

                headerStyle: {
                    backgroundColor: COLORS.primary,
                },
                headerTintColor: COLORS.white,
                headerTitleStyle: {
                    fontWeight: 'bold',
                },

                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Início') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Salvos') {
                        iconName = focused ? 'heart' : 'heart-outline';
                    } else if (route.name === 'Perfil') {
                        iconName = focused ? 'person-circle' : 'person-circle-outline';
                    }

                    return <Ionicons name={iconName} size={size * 1.1} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Início" component={HomeScreen} />
            <Tab.Screen name="Salvos" component={FavoritesScreen} />
            <Tab.Screen name="Perfil" component={ProfileScreen} />
        </Tab.Navigator>
    );
}