import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS, SPACING, RADIUS } from "../theme";

export default function FeedCard({ location, time }) {
  return (
    <View style={styles.card}>
      <Text style={styles.location}>📍 {location}</Text>
      <Text style={styles.time}>⏰ {time}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.bgCard,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
  },

  location: {
    color: COLORS.text,
    fontSize: 16,
  },

  time: {
    color: COLORS.accentLight,
    marginTop: 4,
  },
});