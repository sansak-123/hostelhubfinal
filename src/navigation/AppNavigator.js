// src/navigation/AppNavigator.js
import React, { useRef } from "react";
import { View, StyleSheet } from "react-native";
import {
  NavigationContainer,
  useNavigationState,
  createNavigationContainerRef,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Sidebar from "../components/Sidebar";

import HomeScreen            from "../screens/HomeScreen";
import SearchScreen          from "../screens/RoomFinder/SearchScreen";
import UploadScreen          from "../screens/RoomFinder/UploadScreen";
import ChatScreen            from "../screens/Chat/ChatScreen";
import ComplaintScreen       from "../screens/ComplaintPortal/ComplaintScreen";
import ReportDogScreen       from "../screens/DogCare/ReportDogScreen";
import FeedingScheduleScreen from "../screens/DogCare/FeedingScheduleScreen";
import DogCareMenu           from "../screens/DogCare/DogCareMenu";
import MenuScreen            from "../Mess/components/MenuScreen";
import CartScreen            from "../Mess/screens/CartScreen";

import { CartProvider }   from "../Mess/context/CartContext";
import { MessProvider }   from "../Mess/context/MessContext";
import { OrdersProvider } from "../Mess/context/OrdersContext";
import { COLORS } from "../theme";

const Stack = createNativeStackNavigator();

// Create a ref that lives outside the component tree so Sidebar can use it
export const navigationRef = createNavigationContainerRef();

function AppStack() {
  const routeName = useNavigationState(
    (state) => state?.routes?.[state.index]?.name ?? "Home"
  );

  return (
    <View style={styles.root}>
      {/* Pass navigationRef so Sidebar can call navigationRef.navigate() */}
      <Sidebar activeRoute={routeName} navigationRef={navigationRef} />

      <View style={styles.content}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: COLORS.bg },
            animation: "fade_from_bottom",
          }}
        >
          <Stack.Screen name="Home"             component={HomeScreen} />
          <Stack.Screen name="RoomFinderTabs"   component={SearchScreen} />
          <Stack.Screen name="Upload"           component={UploadScreen} />
          <Stack.Screen name="Chat"             component={ChatScreen} />
          <Stack.Screen name="Complaint"        component={ComplaintScreen} />
          <Stack.Screen name="DogCareMenu"      component={DogCareMenu} />
          <Stack.Screen name="ReportDog"        component={ReportDogScreen} />
          <Stack.Screen name="FeedingSchedule"  component={FeedingScheduleScreen} />
          <Stack.Screen name="NightMess"        component={MenuScreen} />
          <Stack.Screen name="Cart"             component={CartScreen} />
        </Stack.Navigator>
      </View>
    </View>
  );
}

export default function AppNavigator() {
  return (
    // Pass the ref to NavigationContainer
    <NavigationContainer ref={navigationRef}>
      <MessProvider>
        <CartProvider>
          <OrdersProvider>
            <AppStack />
          </OrdersProvider>
        </CartProvider>
      </MessProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: COLORS.bg,
  },
  content: {
    flex: 1,
    overflow: "hidden",
  },
});