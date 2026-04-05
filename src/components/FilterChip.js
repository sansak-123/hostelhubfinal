// src/components/FilterChip.js
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { COLORS, RADIUS } from "../theme";

export default function FilterChip({ label, selected, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.chip, selected && styles.chipSelected]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <Text style={[styles.label, selected && styles.labelSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: RADIUS.xl,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 8,
    marginBottom: 8,
  },
  chipSelected: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  label: {
    color: COLORS.textSub,
    fontSize: 13,
  },
  labelSelected: {
    color: COLORS.white,
    fontWeight: "600",
  },
});
