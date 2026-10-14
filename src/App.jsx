import React from "react";
import { RestaurantProvider } from "./context/RestaurantContext";
import Home from "./pages/Home";

export default function App() {
  return (
    <RestaurantProvider>
      <Home />
    </RestaurantProvider>
  );
}
