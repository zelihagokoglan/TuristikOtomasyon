import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import SignScreen from "./pages/sign-screen";
import MapScreen from "./pages/map";
import FavoritesScreen from "./pages/favorites";
import CommentsScreen from "./pages/comments";
const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignIn">
        <Stack.Screen name="SignIn" component={SignScreen} />
        <Stack.Screen
          name="Map"
          component={MapScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen name="Favorites" component={FavoritesScreen} />
        <Stack.Screen name="Comments" component={CommentsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
