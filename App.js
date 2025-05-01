import React, { useEffect, useState } from "react";
import "react-native-gesture-handler";

import MapScreen from "./src/pages/map";
import SignScreen from "./src/pages/sign-screen";
import AppNavigator from "./src/app-navigator";

export default function App() {
  return <AppNavigator />;
}
