// src/screens/HomeScreen.js
// Warm light theme · Lucide icons · Sidebar dashboard layout

import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Dimensions,
} from "react-native";
import {
  BedDouble,
  UtensilsCrossed,
  MessageSquareWarning,
  PawPrint,
  Bot,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react-native";
import { COLORS, SPACING, RADIUS, SHADOWS } from "../theme";

const STATS = [
  {
    label: "Available Rooms",
    value: "3",
    Icon: BedDouble,
    color: "#EA580C",
    bg: "rgba(234,88,12,0.08)",
    border: "rgba(234,88,12,0.18)",
  },
  {
    label: "Open Complaints",
    value: "1",
    Icon: AlertCircle,
    color: "#DC2626",
    bg: "rgba(220,38,38,0.07)",
    border: "rgba(220,38,38,0.18)",
  },
  {
    label: "Dogs on Campus",
    value: "7",
    Icon: PawPrint,
    color: "#16A34A",
    bg: "rgba(22,163,74,0.07)",
    border: "rgba(22,163,74,0.18)",
  },
  {
    label: "Mess Status",
    value: "Open",
    Icon: CheckCircle2,
    color: "#D97706",
    bg: "rgba(217,119,6,0.08)",
    border: "rgba(217,119,6,0.18)",
  },
];

const FEATURES = [
  {
    id: "RoomFinderTabs",
    label: "Room Finder",
    desc: "Search and discover available rooms across all blocks and floors.",
    Icon: BedDouble,
    accent: "#EA580C",
    bg: "rgba(234,88,12,0.07)",
    border: "rgba(234,88,12,0.15)",
    tag: "12 listed",
    tagColor: "#EA580C",
    tagBg: "rgba(234,88,12,0.10)",
  },
  {
    id: "NightMess",
    label: "Night Mess",
    desc: "Check tonight's menu, timings, and special items at a glance.",
    Icon: UtensilsCrossed,
    accent: "#D97706",
    bg: "rgba(217,119,6,0.07)",
    border: "rgba(217,119,6,0.15)",
    tag: "Open Now",
    tagColor: "#16A34A",
    tagBg: "rgba(22,163,74,0.10)",
  },
  {
    id: "Complaint",
    label: "Complaint Portal",
    desc: "Raise issues, track status, and get them resolved quickly.",
    Icon: MessageSquareWarning,
    accent: "#DC2626",
    bg: "rgba(220,38,38,0.07)",
    border: "rgba(220,38,38,0.15)",
    tag: "1 open",
    tagColor: "#DC2626",
    tagBg: "rgba(220,38,38,0.10)",
  },
  {
    id: "DogCareMenu",
    label: "Dog Welfare",
    desc: "View campus dogs, report nuisances, and contribute to welfare funds.",
    Icon: PawPrint,
    accent: "#16A34A",
    bg: "rgba(22,163,74,0.07)",
    border: "rgba(22,163,74,0.15)",
    tag: "7 dogs",
    tagColor: "#16A34A",
    tagBg: "rgba(22,163,74,0.10)",
  },
  {
    id: "Chat",
    label: "AI Chatbot",
    desc: "Get instant answers to your campus queries with AI assistance.",
    Icon: Bot,
    accent: "#7C3AED",
    bg: "rgba(124,58,237,0.07)",
    border: "rgba(124,58,237,0.15)",
    tag: "AI",
    tagColor: "#7C3AED",
    tagBg: "rgba(124,58,237,0.10)",
  },
];

function StatCard({ stat, index }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, delay: index * 70, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 70, friction: 12, delay: index * 70, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[
      styles.statCard,
      { backgroundColor: stat.bg, borderColor: stat.border, opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
    ]}>
      <View style={[styles.statIconBox, { backgroundColor: stat.color + "18" }]}>
        <stat.Icon size={18} color={stat.color} strokeWidth={2.5} />
      </View>
      <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
      <Text style={styles.statLabel}>{stat.label}</Text>
    </Animated.View>
  );
}

function FeatureCard({ item, index, onPress }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(16)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 450, delay: 200 + index * 80, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 65, friction: 12, delay: 200 + index * 80, useNativeDriver: true }),
    ]).start();
  }, []);

  const onPressIn = () => Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true }).start();
  const onPressOut = () => Animated.spring(scaleAnim, { toValue: 1, tension: 100, useNativeDriver: true }).start();

  return (
    <Animated.View style={[
      styles.featureCard,
      { borderColor: item.border, opacity: fadeAnim, transform: [{ translateY: slideAnim }, { scale: scaleAnim }] },
    ]}>
      <TouchableOpacity
        style={StyleSheet.absoluteFill}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={1}
      />

      {/* Icon + tag */}
      <View style={styles.featureTop}>
        <View style={[styles.featureIconBox, { backgroundColor: item.bg, borderColor: item.border }]}>
          <item.Icon size={22} color={item.accent} strokeWidth={2} />
        </View>
        <View style={[styles.featureTag, { backgroundColor: item.tagBg }]}>
          <Text style={[styles.featureTagText, { color: item.tagColor }]}>{item.tag}</Text>
        </View>
      </View>

      <Text style={styles.featureTitle}>{item.label}</Text>
      <Text style={styles.featureDesc}>{item.desc}</Text>

      <View style={styles.featureLink}>
        <Text style={[styles.featureLinkText, { color: item.accent }]}>Explore</Text>
        <ChevronRight size={14} color={item.accent} strokeWidth={2.5} />
      </View>
    </Animated.View>
  );
}

export default function HomeScreen({ navigation }) {
  const headerFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(headerFade, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

      {/* Header */}
      <Animated.View style={[styles.header, { opacity: headerFade }]}>
        <Text style={styles.greeting}>{greeting} 👋</Text>
        <Text style={styles.heroTitle}>Welcome back, Ridanshi</Text>
        <Text style={styles.heroSub}>
          Your all-in-one campus companion. Explore rooms, check the mess menu, raise complaints, or chat with AI.
        </Text>
      </Animated.View>

      {/* Stats */}
      <View style={styles.statsGrid}>
        {STATS.map((stat, i) => <StatCard key={stat.label} stat={stat} index={i} />)}
      </View>

      {/* Section label */}
      <Text style={styles.sectionLabel}>FEATURES</Text>

      {/* Feature grid */}
      <View style={styles.featureGrid}>
        {FEATURES.map((item, i) => (
          <FeatureCard
            key={item.id}
            item={item}
            index={i}
            onPress={() => navigation.navigate(item.id)}
          />
        ))}
      </View>

      <Text style={styles.footerText}>VIT Chennai · Hostel Block D</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: COLORS.bg },
  container: { padding: SPACING.lg, paddingBottom: SPACING.xxl },

  header: { marginBottom: SPACING.lg },
  greeting: { fontSize: 13, color: COLORS.textSub, marginBottom: 4 },
  heroTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.text,
    letterSpacing: -0.8,
    marginBottom: 8,
    lineHeight: 34,
  },
  heroSub: {
    color: COLORS.textSub,
    fontSize: 14,
    lineHeight: 21,
    maxWidth: 480,
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: SPACING.lg,
  },
  statCard: {
    flex: 1,
    minWidth: 130,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    padding: SPACING.md,
    gap: 4,
    ...SHADOWS.card,
  },
  statIconBox: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.sm,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.8,
    lineHeight: 30,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textSub,
    fontWeight: "500",
  },

  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.4,
    color: COLORS.textSub,
    marginBottom: SPACING.md,
  },

  featureGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  featureCard: {
    width: "47%",
    minWidth: 200,
    flex: 1,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    padding: SPACING.lg,
    ...SHADOWS.card,
  },
  featureTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: SPACING.md,
  },
  featureIconBox: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  featureTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  featureTagText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  featureDesc: {
    fontSize: 13,
    color: COLORS.textSub,
    lineHeight: 19,
    marginBottom: SPACING.md,
  },
  featureLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  featureLinkText: {
    fontSize: 13,
    fontWeight: "600",
  },

  footerText: {
    color: COLORS.textMuted,
    fontSize: 12,
    textAlign: "center",
    marginTop: SPACING.xl,
  },
});