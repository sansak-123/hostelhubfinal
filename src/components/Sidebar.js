// src/components/Sidebar.js
import React, { useState, useRef } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, Dimensions,
} from "react-native";
import {
  LayoutDashboard, BedDouble, UtensilsCrossed,
  MessageSquareWarning, PawPrint, Bot,
  LogOut, ChevronLeft, ChevronRight, Building2,
} from "lucide-react-native";
import { COLORS, SPACING, RADIUS, SHADOWS } from "../theme";

const NAV_ITEMS = [
  { id: "Home",           label: "Dashboard",   Icon: LayoutDashboard      },
  { id: "RoomFinderTabs", label: "Room Finder",  Icon: BedDouble            },
  { id: "NightMess",      label: "Night Mess",   Icon: UtensilsCrossed      },
  { id: "Complaint",      label: "Complaints",   Icon: MessageSquareWarning },
  { id: "DogCareMenu",    label: "Dog Welfare",  Icon: PawPrint             },
  { id: "Chat",           label: "AI Chatbot",   Icon: Bot                  },
];

const SIDEBAR_FULL = 220;
const SIDEBAR_MINI = 64;

export default function Sidebar({ navigationRef, activeRoute }) {
  const [collapsed, setCollapsed] = useState(false);
  const widthAnim = useRef(new Animated.Value(SIDEBAR_FULL)).current;

  const toggle = () => {
    const toValue = collapsed ? SIDEBAR_FULL : SIDEBAR_MINI;
    Animated.spring(widthAnim, {
      toValue, tension: 60, friction: 12, useNativeDriver: false,
    }).start();
    setCollapsed(!collapsed);
  };

  // Safe navigate using the ref — works even before full mount
  const navigate = (screenName) => {
    if (navigationRef?.isReady()) {
      navigationRef.navigate(screenName);
    }
  };

  return (
    <Animated.View style={[styles.sidebar, { width: widthAnim }]}>

      {/* Logo */}
      <View style={styles.logoRow}>
        <View style={styles.logoIcon}>
          <Building2 size={18} color="#FFFFFF" strokeWidth={2.5} />
        </View>
        {!collapsed && (
          <Text style={styles.logoText} numberOfLines={1}>HostelHub</Text>
        )}
      </View>

      {/* Nav items */}
      <View style={styles.nav}>
        {NAV_ITEMS.map(({ id, label, Icon }) => {
          const isActive = activeRoute === id;
          return (
            <TouchableOpacity
              key={id}
              style={[styles.navItem, isActive && styles.navItemActive]}
              onPress={() => navigate(id)}
              activeOpacity={0.7}
            >
              {isActive && <View style={styles.activeBar} />}
              <Icon
                size={18}
                color={isActive ? COLORS.sidebarActiveText : COLORS.sidebarText}
                strokeWidth={isActive ? 2.5 : 2}
              />
              {!collapsed && (
                <Text
                  style={[styles.navLabel, isActive && styles.navLabelActive]}
                  numberOfLines={1}
                >
                  {label}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={[styles.userRow, collapsed && styles.userRowCollapsed]}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>RA</Text>
          </View>
          {!collapsed && (
            <View style={styles.userInfo}>
              <Text style={styles.userName} numberOfLines={1}>Ridanshi Agarwal</Text>
              <Text style={styles.userSub}>Student · D Block</Text>
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.logoutBtn} activeOpacity={0.7}>
          <LogOut size={16} color={COLORS.sidebarText} strokeWidth={2} />
          {!collapsed && <Text style={styles.logoutText}>Logout</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.collapseBtn} onPress={toggle} activeOpacity={0.7}>
          {collapsed
            ? <ChevronRight size={16} color={COLORS.sidebarText} />
            : <ChevronLeft  size={16} color={COLORS.sidebarText} />
          }
          {!collapsed && <Text style={styles.collapseText}>Collapse</Text>}
        </TouchableOpacity>
      </View>

    </Animated.View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    backgroundColor: COLORS.sidebar,
    minHeight: "100%",
    flexDirection: "column",
    borderRightWidth: 1,
    borderRightColor: COLORS.sidebarBorder,
    overflow: "hidden",
  },
  logoRow: {
    flexDirection: "row", alignItems: "center", gap: 10,
    padding: SPACING.md, paddingVertical: 20,
    borderBottomWidth: 1, borderBottomColor: COLORS.sidebarBorder,
  },
  logoIcon: {
    width: 34, height: 34, borderRadius: RADIUS.sm,
    backgroundColor: COLORS.accent,
    alignItems: "center", justifyContent: "center",
    flexShrink: 0, ...SHADOWS.accent,
  },
  logoText: {
    color: "#FFFFFF", fontSize: 16, fontWeight: "800",
    letterSpacing: -0.5, flex: 1,
  },
  nav: { flex: 1, padding: SPACING.sm, gap: 2 },
  navItem: {
    flexDirection: "row", alignItems: "center", gap: 10,
    paddingVertical: 10, paddingHorizontal: 12,
    borderRadius: RADIUS.sm, position: "relative", overflow: "hidden",
  },
  navItemActive: { backgroundColor: COLORS.sidebarActive },
  activeBar: {
    position: "absolute", left: 0, top: "20%", bottom: "20%",
    width: 3, borderRadius: 2, backgroundColor: COLORS.accentLight,
  },
  navLabel: { color: COLORS.sidebarText, fontSize: 14, fontWeight: "500", flex: 1 },
  navLabelActive: { color: COLORS.sidebarActiveText, fontWeight: "600" },
  footer: {
    padding: SPACING.sm, gap: 2,
    borderTopWidth: 1, borderTopColor: COLORS.sidebarBorder,
  },
  userRow: {
    flexDirection: "row", alignItems: "center", gap: 10,
    padding: 10, marginBottom: 4,
  },
  userRowCollapsed: { justifyContent: "center" },
  avatar: {
    width: 32, height: 32, borderRadius: RADIUS.full,
    backgroundColor: COLORS.sidebarActive,
    borderWidth: 1.5, borderColor: COLORS.accentLight,
    alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  avatarText: { color: COLORS.sidebarActiveText, fontSize: 11, fontWeight: "700" },
  userInfo: { flex: 1 },
  userName: { color: "#FFFFFF", fontSize: 12, fontWeight: "600", lineHeight: 16 },
  userSub: { color: COLORS.sidebarText, fontSize: 10, marginTop: 1 },
  logoutBtn: {
    flexDirection: "row", alignItems: "center", gap: 10,
    padding: 10, borderRadius: RADIUS.sm,
  },
  logoutText: { color: COLORS.sidebarText, fontSize: 13, fontWeight: "500" },
  collapseBtn: {
    flexDirection: "row", alignItems: "center", gap: 10,
    padding: 10, borderRadius: RADIUS.sm,
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  collapseText: { color: COLORS.sidebarText, fontSize: 12 },
});