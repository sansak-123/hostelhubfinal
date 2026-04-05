// src/theme.js — HostelHub Pink-Orange Theme
export const COLORS = {
  // Backgrounds
  bg:           "#FFF5F7",
  bgCard:       "#FFFFFF",
  bgElevated:   "#FFFFFF",
  bgInput:      "#FFF0F3",
  bgMuted:      "#FFE8ED",

  // Sidebar (dark with pink-tinted overlay)
  sidebar:          "#1A0A0F",
  sidebarBorder:    "rgba(255,255,255,0.07)",
  sidebarText:      "#C9A0AB",
  sidebarActive:    "rgba(251,113,133,0.18)",
  sidebarActiveText:"#FB7185",

  // Accent — hot pink → orange gradient family
  accent:      "#F43F5E",       // rose-500
  accentLight: "#FB7185",       // rose-400
  accentMuted: "rgba(244,63,94,0.10)",
  accentGlow:  "rgba(244,63,94,0.22)",

  // Secondary accent — warm orange
  accentOrange:      "#F97316",
  accentOrangeMuted: "rgba(249,115,22,0.10)",

  // Text
  text:      "#1C0A10",
  textSub:   "#9F6672",
  textMuted: "#E8C5CC",

  // Borders
  border:      "#FFD6DE",
  borderFocus: "rgba(244,63,94,0.4)",

  // Semantic
  success:      "#16A34A",
  successMuted: "rgba(22,163,74,0.10)",
  danger:       "#DC2626",
  dangerMuted:  "rgba(220,38,38,0.10)",
  warning:      "#D97706",
  warningMuted: "rgba(217,119,6,0.10)",
  star:         "#F97316",

  white:   "#FFFFFF",
  overlay: "rgba(28,10,16,0.55)",
};

export const RADIUS = {
  xs: 6, sm: 10, md: 14, lg: 18, xl: 24, full: 999,
};

export const SPACING = {
  xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48,
};

export const FONTS = {
  display:    { fontWeight: "800", letterSpacing: -0.8 },
  heading:    { fontWeight: "700", letterSpacing: -0.4 },
  subheading: { fontWeight: "600" },
  body:       { fontWeight: "400" },
  label:      { fontWeight: "600", letterSpacing: 0.8 },
};

export const SHADOWS = {
  card: {
    shadowColor: "#F43F5E",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  accent: {
    shadowColor: "#F43F5E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 10,
    elevation: 6,
  },
  float: {
    shadowColor: "#F43F5E",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.10,
    shadowRadius: 24,
    elevation: 10,
  },
};