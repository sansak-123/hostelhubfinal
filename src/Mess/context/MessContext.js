// src/Mess/context/MessContext.js
import React, { createContext, useContext, useState } from "react";

const MessContext = createContext();

export const MESS_LIST = [
  {
    id: "mess_d",
    name: "D Block Night Mess",
    shortName: "D Block",
    icon: "🌙",
    location: "D Block, Ground Floor",
    hours: "9:00 PM – 1:00 AM",
    rating: 4.3,
    reviewCount: 128,
    tags: ["Fast", "Popular", "Rice Varieties"],
    isOpen: true,
    avgWait: "10–15 min",
    color: "#6366F1",
  },
  {
    id: "mess_c",
    name: "C Block Mess",
    shortName: "C Block",
    icon: "⭐",
    location: "C Block, Canteen Area",
    hours: "8:30 PM – 12:30 AM",
    rating: 4.1,
    reviewCount: 87,
    tags: ["Dosa Specials", "South Indian"],
    isOpen: true,
    avgWait: "15–20 min",
    color: "#10B981",
  },
  {
    id: "mess_main",
    name: "Main Block Canteen",
    shortName: "Main Block",
    icon: "🏛️",
    location: "Main Block, First Floor",
    hours: "8:00 PM – 11:30 PM",
    rating: 3.8,
    reviewCount: 210,
    tags: ["Variety", "Budget"],
    isOpen: false,
    avgWait: "5–10 min",
    color: "#F59E0B",
  },
  {
    id: "mess_new",
    name: "New Block Café",
    shortName: "New Block",
    icon: "☕",
    location: "New Block, Basement",
    hours: "9:30 PM – 2:00 AM",
    rating: 4.6,
    reviewCount: 55,
    tags: ["Late Night", "Beverages", "Snacks"],
    isOpen: true,
    avgWait: "5–8 min",
    color: "#EF476F",
  },
];

export function MessProvider({ children }) {
  const [selectedMess, setSelectedMess] = useState(null);

  const selectMess = (mess) => setSelectedMess(mess);
  const clearMess = () => setSelectedMess(null);

  return (
    <MessContext.Provider
      value={{ selectedMess, selectMess, clearMess, messList: MESS_LIST }}
    >
      {children}
    </MessContext.Provider>
  );
}

export const useMess = () => {
  const ctx = useContext(MessContext);
  if (!ctx) throw new Error("useMess must be used within a MessProvider");
  return ctx;
};
