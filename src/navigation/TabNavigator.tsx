import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Platform } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import TripPlannerScreen from '../screens/TripPlannerScreen';
import TransportScreen from '../screens/TransportScreen';
import EmergencyScreenTab from '../screens/EmergencyScreenTab';
import ProfileScreen from '../screens/ProfileScreen';
import { 
  HomeIcon, 
  TripPlannerIcon, 
  TransportIcon, 
  EmergencyIcon,
} from '../components/icons';
import { AccountCircleIcon } from '../components/icons/CommonIcons';
import { AnimatedTabIcon } from '../components/AnimatedTabIcon';
import { colors } from '../theme/colors';
import { radius } from '../theme/spacing';

const Tab = createBottomTabNavigator();

// Icon size for tabs (medium-large as requested)
const TAB_ICON_SIZE = 28;

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: colors.teal,
        tabBarInactiveTintColor: colors.textSecondary,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <AnimatedTabIcon 
              Icon={HomeIcon} 
              focused={focused} 
              iconSize={TAB_ICON_SIZE}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Trip"
        component={TripPlannerScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <AnimatedTabIcon 
              Icon={TripPlannerIcon} 
              focused={focused} 
              iconSize={TAB_ICON_SIZE}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Transport"
        component={TransportScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <AnimatedTabIcon 
              Icon={TransportIcon} 
              focused={focused} 
              iconSize={TAB_ICON_SIZE}
            />
          ),
        }}
      />
      <Tab.Screen
        name="SOS"
        component={EmergencyScreenTab}
        options={{
          tabBarIcon: ({ focused }) => (
            <AnimatedTabIcon 
              Icon={EmergencyIcon} 
              focused={focused} 
              iconSize={TAB_ICON_SIZE}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <AnimatedTabIcon 
              Icon={AccountCircleIcon} 
              focused={focused} 
              iconSize={TAB_ICON_SIZE}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.cardBackground,
    borderTopWidth: 0,
    height: Platform.OS === 'ios' ? 80 : 68,
    paddingBottom: Platform.OS === 'ios' ? 20 : 6,
    paddingTop: 6,
    paddingHorizontal: 8,
    // Rounded top corners
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    // Shadow / Elevation
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
  },
});
