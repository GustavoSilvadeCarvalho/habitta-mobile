import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';

import HomeScreen from '../screens/App/HomeScreen';
import ExploreScreen from '../screens/App/ExploreScreen';
import FavoritesScreen from '../screens/App/FavoritesScreen';
import ProfileScreen from '../screens/App/ProfileScreen';
import { COLORS } from '../constants/colors';

const Tab = createBottomTabNavigator();

export default function AppTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: true,
                tabBarStyle: {
                    elevation: 0,
                    height: 70,
                    paddingBottom: 5,
                    paddingTop: 5,
                    borderRadius: 20,
                    border: 1,
                    position: 'absolute',
                    marginLeft: '4%',
                    marginRight: '4%',
                    width: 'auto',
                    bottom: 50,
                    overflow: 'hidden',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                },
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.gray,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: React.ComponentProps<typeof Ionicons>['name'] = 'help-circle';

                    if (route.name === 'Início') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Explorar') {
                        iconName = focused ? 'search' : 'search-outline';
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
            <Tab.Screen name="Explorar" component={ExploreScreen}/>
            <Tab.Screen name="Salvos" component={FavoritesScreen} />
            <Tab.Screen name="Perfil" component={ProfileScreen} />
        </Tab.Navigator>
    );
}