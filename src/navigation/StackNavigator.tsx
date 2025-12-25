import { createStackNavigator, CardStyleInterpolators } from "@react-navigation/stack";
import WelcomeScreen from "../screens/WelcomeScreen";
import TabNavigator from "./TabNavigator";
import CategoryScreen from "../screens/CategoryScreen";
import ReligiousPlacesScreen from "../screens/ReligiousPlacesScreen";
import BeachesScreen from "../screens/BeachesScreen";
import ParksScreen from "../screens/ParksScreen";
import NatureScreen from "../screens/NatureScreen";
import NightlifeScreen from "../screens/NightlifeScreen";
import AdventureScreen from "../screens/AdventureScreen";
import TheatresScreen from "../screens/TheatresScreen";
import PhotoshootScreen from "../screens/PhotoshootScreen";
import ShoppingScreen from "../screens/ShoppingScreen";
import PubsScreen from "../screens/PubsScreen";
import AccommodationScreen from "../screens/AccommodationScreen";
import RestaurantsScreen from "../screens/RestaurantsScreen";
import PlaceDetailsScreen from "../screens/PlaceDetailsScreen";
import AIDetailScreen from "../screens/AIDetailScreen";
import SettingsScreen from "../screens/SettingsScreen";
import HistoryScreen from "../screens/HistoryScreen";
import TripPlannerInput from "../screens/TripPlannerInput";
import TripPlannerOutput from "../screens/TripPlannerOutput";
import ExploreScreen from "../screens/ExploreScreen";
import LoginScreen from "../screens/LoginScreen";
import AIChatbotScreen from "../screens/AIChatbotScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { useAuth } from "../context/AuthContext";

const Stack = createStackNavigator();

export default function StackNavigator() {
  const { user, loading } = useAuth();

  // Show loading while checking auth state
  if (loading) {
    return null; // App.tsx already handles loading
  }

  return (
    <Stack.Navigator 
      initialRouteName={!user ? "Welcome" : "Main"}
      screenOptions={{ 
        headerShown: false,
        cardStyleInterpolator: ({ current, next, layouts }) => {
          return {
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
              ],
              opacity: current.progress.interpolate({
                inputRange: [0, 0.5, 0.9, 1],
                outputRange: [0, 0.25, 0.7, 1],
              }),
            },
          };
        },
        transitionSpec: {
          open: {
            animation: 'timing',
            config: {
              duration: 350,
            },
          },
          close: {
            animation: 'timing',
            config: {
              duration: 350,
            },
          },
        },
      }}
    >
      {!user ? (
        // Unauthenticated routes
        <>
          <Stack.Screen 
            name="Welcome" 
            component={WelcomeScreen}
            options={{
              animationEnabled: false, // No animation on initial load
            }}
          />
          <Stack.Screen 
            name="Login" 
            component={LoginScreen}
            options={{
              animationEnabled: true,
            }}
          />
        </>
      ) : (
        // Authenticated routes
        <>
          <Stack.Screen name="Main" component={TabNavigator} />
      <Stack.Screen 
        name="Explore" 
        component={ExploreScreen}
        options={{
          animationEnabled: true,
        }}
      />
      <Stack.Screen 
        name="Category" 
        component={CategoryScreen}
        options={{
          animationEnabled: true,
          cardStyleInterpolator: CardStyleInterpolators.forVerticalFromBottomJS,
          transitionSpec: {
            open: { animation: 'timing', config: { duration: 350 } },
            close: { animation: 'timing', config: { duration: 350 } },
          },
        }}
      />
      <Stack.Screen 
        name="ReligiousPlaces" 
        component={ReligiousPlacesScreen}
        options={{
          animationEnabled: true,
          cardStyleInterpolator: CardStyleInterpolators.forVerticalFromBottomJS,
          transitionSpec: {
            open: { animation: 'timing', config: { duration: 350 } },
            close: { animation: 'timing', config: { duration: 350 } },
          },
        }}
      />
      <Stack.Screen 
        name="Beaches" 
        component={BeachesScreen}
        options={{
          animationEnabled: true,
          cardStyleInterpolator: CardStyleInterpolators.forVerticalFromBottomJS,
          transitionSpec: {
            open: { animation: 'timing', config: { duration: 350 } },
            close: { animation: 'timing', config: { duration: 350 } },
          },
        }}
      />
      <Stack.Screen 
        name="Parks" 
        component={ParksScreen}
        options={{
          animationEnabled: true,
          cardStyleInterpolator: CardStyleInterpolators.forVerticalFromBottomJS,
          transitionSpec: {
            open: { animation: 'timing', config: { duration: 350 } },
            close: { animation: 'timing', config: { duration: 350 } },
          },
        }}
      />
      <Stack.Screen 
        name="Nature" 
        component={NatureScreen}
        options={{
          animationEnabled: true,
          cardStyleInterpolator: CardStyleInterpolators.forVerticalFromBottomJS,
          transitionSpec: {
            open: { animation: 'timing', config: { duration: 350 } },
            close: { animation: 'timing', config: { duration: 350 } },
          },
        }}
      />
      <Stack.Screen 
        name="Nightlife" 
        component={NightlifeScreen}
        options={{
          animationEnabled: true,
          cardStyleInterpolator: CardStyleInterpolators.forVerticalFromBottomJS,
          transitionSpec: {
            open: { animation: 'timing', config: { duration: 350 } },
            close: { animation: 'timing', config: { duration: 350 } },
          },
        }}
      />
      <Stack.Screen 
        name="Adventure" 
        component={AdventureScreen}
        options={{
          animationEnabled: true,
          cardStyleInterpolator: CardStyleInterpolators.forVerticalFromBottomJS,
          transitionSpec: {
            open: { animation: 'timing', config: { duration: 350 } },
            close: { animation: 'timing', config: { duration: 350 } },
          },
        }}
      />
      <Stack.Screen 
        name="Theatres" 
        component={TheatresScreen}
        options={{
          animationEnabled: true,
          cardStyleInterpolator: CardStyleInterpolators.forVerticalFromBottomJS,
          transitionSpec: {
            open: { animation: 'timing', config: { duration: 350 } },
            close: { animation: 'timing', config: { duration: 350 } },
          },
        }}
      />
      <Stack.Screen 
        name="Photoshoot" 
        component={PhotoshootScreen}
        options={{
          animationEnabled: true,
          cardStyleInterpolator: CardStyleInterpolators.forVerticalFromBottomJS,
          transitionSpec: {
            open: { animation: 'timing', config: { duration: 350 } },
            close: { animation: 'timing', config: { duration: 350 } },
          },
        }}
      />
      <Stack.Screen 
        name="Shopping" 
        component={ShoppingScreen}
        options={{
          animationEnabled: true,
          cardStyleInterpolator: CardStyleInterpolators.forVerticalFromBottomJS,
          transitionSpec: {
            open: { animation: 'timing', config: { duration: 350 } },
            close: { animation: 'timing', config: { duration: 350 } },
          },
        }}
      />
      <Stack.Screen 
        name="Pubs" 
        component={PubsScreen}
        options={{
          animationEnabled: true,
          cardStyleInterpolator: CardStyleInterpolators.forVerticalFromBottomJS,
          transitionSpec: {
            open: { animation: 'timing', config: { duration: 350 } },
            close: { animation: 'timing', config: { duration: 350 } },
          },
        }}
      />
      <Stack.Screen 
        name="Accommodation" 
        component={AccommodationScreen}
        options={{
          animationEnabled: true,
          cardStyleInterpolator: CardStyleInterpolators.forVerticalFromBottomJS,
          transitionSpec: {
            open: { animation: 'timing', config: { duration: 350 } },
            close: { animation: 'timing', config: { duration: 350 } },
          },
        }}
      />
      <Stack.Screen 
        name="Restaurants" 
        component={RestaurantsScreen}
        options={{
          animationEnabled: true,
          cardStyleInterpolator: CardStyleInterpolators.forVerticalFromBottomJS,
          transitionSpec: {
            open: { animation: 'timing', config: { duration: 350 } },
            close: { animation: 'timing', config: { duration: 350 } },
          },
        }}
      />
      <Stack.Screen 
        name="PlaceDetails" 
        component={PlaceDetailsScreen}
        options={{
          animationEnabled: true,
          cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
          transitionSpec: {
            open: { animation: 'timing', config: { duration: 350 } },
            close: { animation: 'timing', config: { duration: 350 } },
          },
        }}
      />
      <Stack.Screen 
        name="AIDetail" 
        component={AIDetailScreen}
        options={{
          animationEnabled: true,
        }}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          animationEnabled: true,
        }}
      />
      <Stack.Screen 
        name="History" 
        component={HistoryScreen}
        options={{
          animationEnabled: true,
        }}
      />
      <Stack.Screen 
        name="TripPlannerInput" 
        component={TripPlannerInput}
        options={{
          animationEnabled: true,
          cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
          transitionSpec: {
            open: { animation: 'timing', config: { duration: 350 } },
            close: { animation: 'timing', config: { duration: 350 } },
          },
        }}
      />
          <Stack.Screen 
            name="TripPlannerOutput" 
            component={TripPlannerOutput}
            options={{
              animationEnabled: true,
              cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
              transitionSpec: {
                open: { animation: 'timing', config: { duration: 350 } },
                close: { animation: 'timing', config: { duration: 350 } },
              },
            }}
          />
          <Stack.Screen 
            name="AIChatbot" 
            component={AIChatbotScreen}
            options={{
              animationEnabled: true,
            }}
          />
          <Stack.Screen 
            name="Profile" 
            component={ProfileScreen}
            options={{
              animationEnabled: true,
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
