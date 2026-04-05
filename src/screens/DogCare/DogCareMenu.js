// src/screens/DogCare/DogCareMenu.js
// Warm light theme · Lucide icons

import React, { useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated, SafeAreaView } from "react-native";
import { PawPrint, Camera, CalendarClock, ChevronRight, Info, Users, Heart } from "lucide-react-native";
import { COLORS, SPACING, RADIUS, SHADOWS } from "../../theme";

const ACTIONS = [
  {
    id: "ReportDog",
    Icon: Camera,
    label: "Report Stray Dog",
    description: "Upload a photo and location of a stray dog found on campus",
    accent: COLORS.warning,
    bg: COLORS.warningMuted,
    border: "rgba(217,119,6,0.2)",
    stat: "12 reported this week",
    statColor: COLORS.warning,
  },
  {
    id: "FeedingSchedule",
    Icon: CalendarClock,
    label: "Feeding Schedule",
    description: "View & sign up for community dog feeding slots",
    accent: COLORS.success,
    bg: COLORS.successMuted,
    border: "rgba(22,163,74,0.2)",
    stat: "Next slot: 6:00 PM",
    statColor: COLORS.success,
  },
];

const STATS = [
  { label: "Dogs on Campus", value: "7",   Icon: PawPrint },
  { label: "Fed Today",      value: "Yes",  Icon: Heart,    color: COLORS.success },
  { label: "Volunteers",     value: "23",   Icon: Users },
];

export default function DogCareMenu({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 60, friction: 12, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Page header */}
      <View style={styles.pageHeader}>
        <View style={styles.pageIconBox}>
          <PawPrint size={20} color={COLORS.success} strokeWidth={2} />
        </View>
        <View>
          <Text style={styles.pageTitle}>Dog Welfare</Text>
          <Text style={styles.pageSubtitle}>Campus dog profiles, reports and welfare fund</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

          {/* Stat strip */}
          <View style={styles.statStrip}>
            {STATS.map(({ label, value, Icon, color }) => (
              <View key={label} style={styles.statItem}>
                <Icon size={16} color={color || COLORS.accent} strokeWidth={2} />
                <Text style={[styles.statValue, { color: color || COLORS.accent }]}>{value}</Text>
                <Text style={styles.statLabel}>{label}</Text>
              </View>
            ))}
          </View>

          {/* Section label */}
          <Text style={styles.sectionLabel}>QUICK ACTIONS</Text>

          {/* Action cards */}
          {ACTIONS.map(({ id, Icon, label, description, accent, bg, border, stat, statColor }) => (
            <TouchableOpacity
              key={id}
              style={[styles.actionCard, { borderLeftColor: accent }]}
              onPress={() => navigation.navigate(id)}
              activeOpacity={0.85}
            >
              <View style={[styles.actionIconBox, { backgroundColor: bg, borderColor: border }]}>
                <Icon size={24} color={accent} strokeWidth={2} />
              </View>
              <View style={styles.actionBody}>
                <Text style={styles.actionLabel}>{label}</Text>
                <Text style={styles.actionDesc}>{description}</Text>
                <View style={styles.actionStatRow}>
                  <View style={[styles.actionDot, { backgroundColor: statColor }]} />
                  <Text style={[styles.actionStat, { color: statColor }]}>{stat}</Text>
                </View>
              </View>
              <ChevronRight size={18} color={COLORS.textSub} strokeWidth={2} />
            </TouchableOpacity>
          ))}

          {/* Info card */}
          <View style={styles.infoCard}>
            <Info size={16} color={COLORS.accent} strokeWidth={2} />
            <View style={styles.infoBody}>
              <Text style={styles.infoTitle}>Campus Animal Welfare Policy</Text>
              <Text style={styles.infoText}>
                All stray animals are under care of the Student Animal Welfare Cell. Please do not harm or chase them.
              </Text>
            </View>
          </View>

        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { flex: 1 },
  container: { padding: SPACING.lg, paddingBottom: SPACING.xxl },

  pageHeader: {
    flexDirection: "row", alignItems: "center", gap: 12,
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md,
    backgroundColor: COLORS.bgCard, borderBottomWidth: 1, borderBottomColor: COLORS.border,
    ...SHADOWS.card,
  },
  pageIconBox: {
    width: 40, height: 40, borderRadius: RADIUS.md,
    backgroundColor: COLORS.successMuted, borderWidth: 1, borderColor: "rgba(22,163,74,0.2)",
    alignItems: "center", justifyContent: "center",
  },
  pageTitle: { fontSize: 16, fontWeight: "700", color: COLORS.text },
  pageSubtitle: { fontSize: 12, color: COLORS.textSub, marginTop: 1 },

  statStrip: {
    flexDirection: "row", backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border,
    paddingVertical: SPACING.md, marginBottom: SPACING.lg,
    ...SHADOWS.card,
  },
  statItem: { flex: 1, alignItems: "center", gap: 4 },
  statValue: { fontSize: 18, fontWeight: "800", letterSpacing: -0.5 },
  statLabel: { color: COLORS.textSub, fontSize: 10, fontWeight: "500", textAlign: "center" },

  sectionLabel: { fontSize: 11, fontWeight: "700", letterSpacing: 1.4, color: COLORS.textSub, marginBottom: SPACING.md },

  actionCard: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: COLORS.bgCard, borderRadius: RADIUS.lg,
    borderWidth: 1, borderColor: COLORS.border, borderLeftWidth: 3,
    padding: SPACING.lg, marginBottom: SPACING.md, gap: SPACING.md,
    ...SHADOWS.card,
  },
  actionIconBox: {
    width: 54, height: 54, borderRadius: RADIUS.md,
    borderWidth: 1, alignItems: "center", justifyContent: "center",
  },
  actionBody: { flex: 1 },
  actionLabel: { color: COLORS.text, fontSize: 15, fontWeight: "700", marginBottom: 4 },
  actionDesc: { color: COLORS.textSub, fontSize: 13, lineHeight: 18, marginBottom: 8 },
  actionStatRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  actionDot: { width: 6, height: 6, borderRadius: 3 },
  actionStat: { fontSize: 12, fontWeight: "600" },

  infoCard: {
    flexDirection: "row", gap: 12,
    backgroundColor: COLORS.accentMuted, borderRadius: RADIUS.md,
    borderWidth: 1, borderColor: "rgba(234,88,12,0.2)",
    padding: SPACING.md, marginTop: SPACING.sm,
  },
  infoBody: { flex: 1 },
  infoTitle: { color: COLORS.accent, fontSize: 13, fontWeight: "700", marginBottom: 4 },
  infoText: { color: COLORS.textSub, fontSize: 12, lineHeight: 18 },
});