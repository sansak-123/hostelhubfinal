import React from "react";
import AppNavigator from "./src/navigation/AppNavigator";

// ✅ IMPORT CONTEXT PROVIDERS
import { CartProvider } from "./src/Mess/context/CartContext";
import { MessProvider } from "./src/Mess/context/MessContext";
import { OrdersProvider } from "./src/Mess/context/OrdersContext";

export default function App() {
  return (
    <CartProvider>
      <MessProvider>
        <OrdersProvider>
          <AppNavigator />
        </OrdersProvider>
      </MessProvider>
    </CartProvider>
  );
}
