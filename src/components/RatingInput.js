// src/components/RatingInput.js
// Tap-to-rate star widget (1–5). No native dependencies.
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS, SPACING } from "../theme";

export default function RatingInput({ label, value, onChange }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.stars}>
        {[1, 2, 3, 4, 5].map((i) => (
          <TouchableOpacity
            key={i}
            onPress={() => onChange(i)}
            activeOpacity={0.7}
          >
            <Text style={[styles.star, i <= value && styles.starFilled]}>
              ★
            </Text>
          </TouchableOpacity>
        ))}
        {value > 0 && <Text style={styles.val}>{value}/5</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SPACING.sm,
  },
  label: {
    color: COLORS.text,
    fontSize: 14,
    flex: 1,
  },
  stars: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  star: {
    fontSize: 26,
    color: COLORS.border,
  },
  starFilled: {
    color: COLORS.star,
  },
  val: {
    color: COLORS.textSub,
    fontSize: 12,
    marginLeft: 6,
  },
});
