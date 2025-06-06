import { Tabs } from 'expo-router';
import React from 'react';
import { useColorScheme } from 'react-native';
// import { ChartBar as BarChart, Chrome as Home, History, Target } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function TabLayout() {
  const colorScheme = useColorScheme() || 'light';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.tabBar.active[colorScheme],
        tabBarInactiveTintColor: Colors.tabBar.inactive[colorScheme],
        tabBarStyle: {
          backgroundColor: Colors.tabBar.background[colorScheme],
          borderTopColor: Colors.border[colorScheme],
          height: 88,
          paddingBottom: 32,
          paddingTop: 12,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <MaterialIcons name='home' size={size} color={color}/>,
        }}
      />
      <Tabs.Screen
        name="log"
        options={{
          title: 'Log Run',
          tabBarIcon: ({ color, size }) => <MaterialIcons name='bar-chart' size={size} color={color}/>,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color, size }) => <MaterialIcons name='history' size={size} color={color}/>,
        }}
      />
      <Tabs.Screen
        name="goals"
        options={{
          title: 'Goals',
          tabBarIcon: ({ color, size }) => <MaterialIcons name='flag' size={size} color={color}/>,
        }}
      />
    </Tabs>
  );
}