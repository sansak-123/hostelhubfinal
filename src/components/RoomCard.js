// src/components/RoomCard.js
// Warm light theme · Lucide icons

import React, { useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { BedDouble, MapPin, Star, User } from "lucide-react-native";
import { COLORS, RADIUS, SPACING, SHADOWS } from "../theme";

const BLOCK_COLORS = {
  A: "#EA580C", B: "#16A34A", C: "#2563EB", D: "#7C3AED",
  E: "#D97706", F: "#0891B2", default: COLORS.accent,
};

export default function RoomCard({ room }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const blockColor = BLOCK_COLORS[room.block?.[0]] || BLOCK_COLORS.default;
  const rating = room.rating || 0;

  return (
    <Animated.View style={[styles.wrapper, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        style={styles.card}
        onPressIn={() => Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true }).start()}
        onPressOut={() => Animated.spring(scaleAnim, { toValue: 1, tension: 100, useNativeDriver: true }).start()}
        activeOpacity={1}
      >
        {/* Left accent stripe */}
        <View style={[styles.stripe, { backgroundColor: blockColor }]} />

        <View style={styles.content}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={[styles.blockBadge, { backgroundColor: blockColor + "15", borderColor: blockColor + "30" }]}>
              <Text style={[styles.blockBadgeText, { color: blockColor }]}>{room.block || "—"}</Text>
            </View>
            <View style={styles.tags}>
              {room.roomType && (
                <View style={styles.tag}>
                  <Text style={styles.tagText}>{room.roomType}</Text>
                </View>
              )}
              {room.blockType && (
                <View style={[styles.tag, styles.tagAlt]}>
                  <Text style={styles.tagText}>{room.blockType}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Room number */}
          <Text style={styles.roomNum}>Room {room.roomNumber || "—"}</Text>

          {/* Meta */}
          <View style={styles.metaRow}>
            {room.beds && (
              <View style={styles.metaItem}>
                <BedDouble size={12} color={COLORS.textSub} strokeWidth={2} />
                <Text style={styles.metaText}>{room.beds} bed{room.beds > 1 ? "s" : ""}</Text>
              </View>
            )}
            {room.floor && (
              <View style={styles.metaItem}>
                <MapPin size={12} color={COLORS.textSub} strokeWidth={2} />
                <Text style={styles.metaText}>Floor {room.floor}</Text>
              </View>
            )}
          </View>

          {/* Comment */}
          {room.comment && (
            <Text style={styles.comment} numberOfLines={2}>"{room.comment}"</Text>
          )}

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.starsRow}>
              {[1,2,3,4,5].map(s => (
                <Star
                  key={s}
                  size={12}
                  color={s <= rating ? COLORS.star : COLORS.textMuted}
                  fill={s <= rating ? COLORS.star : "none"}
                  strokeWidth={2}
                />
              ))}
              <Text style={styles.ratingNum}>{rating.toFixed(1)}</Text>
            </View>
            <View style={styles.reviewer}>
              <User size={10} color={COLORS.textSub} strokeWidth={2} />
              <Text style={styles.reviewerText}>{room.reviewerName || "Anonymous"}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginHorizontal: SPACING.md, marginBottom: SPACING.sm },
  card: {
    backgroundColor: COLORS.bgCard, borderRadius: RADIUS.lg,
    borderWidth: 1, borderColor: COLORS.border,
    flexDirection: "row", overflow: "hidden",
    ...SHADOWS.card,
  },
  stripe: { width: 4 },
  content: { flex: 1, padding: SPACING.md },

  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  blockBadge: {
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: RADIUS.sm, borderWidth: 1,
  },
  blockBadgeText: { fontSize: 12, fontWeight: "800", letterSpacing: 0.3 },
  tags: { flexDirection: "row", gap: 6 },
  tag: {
    backgroundColor: COLORS.bgInput, borderRadius: RADIUS.full,
    paddingHorizontal: 10, paddingVertical: 3, borderWidth: 1, borderColor: COLORS.border,
  },
  tagAlt: { backgroundColor: COLORS.accentMuted, borderColor: "rgba(234,88,12,0.2)" },
  tagText: { color: COLORS.textSub, fontSize: 10, fontWeight: "500" },

  roomNum: { fontSize: 18, fontWeight: "700", color: COLORS.text, letterSpacing: -0.3, marginBottom: 6 },

  metaRow: { flexDirection: "row", gap: 14, marginBottom: 8 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { color: COLORS.textSub, fontSize: 12 },

  comment: {
    color: COLORS.textSub, fontSize: 12, fontStyle: "italic", lineHeight: 17,
    marginBottom: 10, borderLeftWidth: 2, borderLeftColor: COLORS.border, paddingLeft: 8,
  },

  footer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  starsRow: { flexDirection: "row", alignItems: "center", gap: 2 },
  ratingNum: { color: COLORS.text, fontSize: 12, fontWeight: "700", marginLeft: 4 },
  reviewer: { flexDirection: "row", alignItems: "center", gap: 3 },
  reviewerText: { color: COLORS.textSub, fontSize: 10 },
});