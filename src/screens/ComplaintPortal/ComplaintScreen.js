// src/screens/ComplaintPortal/ComplaintScreen.js
// Warm light theme · Lucide icons

import React, { useRef, useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, ToastAndroid, Platform,
  Animated, SafeAreaView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  Zap, Droplets, Wrench, Trash2, ShieldAlert,
  CalendarDays, Clock, ChevronRight, CheckCircle2,
  MessageSquareWarning,
} from "lucide-react-native";
import { COLORS, SPACING, RADIUS, SHADOWS } from "../../theme";

const TYPES = [
  { label: "Electrical", value: "Electrical", Icon: Zap,        color: "#D97706" },
  { label: "Plumbing",   value: "Plumbing",   Icon: Droplets,   color: "#2563EB" },
  { label: "General",    value: "General",    Icon: Wrench,      color: "#78716C" },
  { label: "Sanitation", value: "Sanitation", Icon: Trash2,      color: "#16A34A" },
  { label: "Security",   value: "Security",   Icon: ShieldAlert, color: "#DC2626" },
];

const PRIORITIES = [
  { label: "Low",    value: 1, color: COLORS.success, bg: COLORS.successMuted },
  { label: "Medium", value: 2, color: COLORS.warning,  bg: COLORS.warningMuted  },
  { label: "High",   value: 3, color: COLORS.danger,   bg: COLORS.dangerMuted   },
];

function SectionHeader({ number, title }) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionNum}>
        <Text style={styles.sectionNumText}>{number}</Text>
      </View>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

export default function ComplaintScreen() {
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const successAnim = useRef(new Animated.Value(0)).current;

  const webDateRef  = useRef(null);
  const webStartRef = useRef(null);
  const webEndRef   = useRef(null);

  const clearError = (f) => setErrors(p => ({ ...p, [f]: null }));
  const fmtDate = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  const fmtTime = d => `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
  const mergeDate = (old, s) => { const [y,m,d] = s.split("-").map(Number); const u = new Date(old); u.setFullYear(y,m-1,d); return u; };
  const mergeTime = (old, s) => { const [h,m] = s.split(":").map(Number); const u = new Date(old); u.setHours(h,m,0,0); return u; };

  const validate = () => {
    const e = {};
    if (!type) e.type = "Select a complaint type";
    if (!description.trim()) e.description = "Describe your issue";
    if (!priority) e.priority = "Select priority level";
    if (endTime <= startTime) e.endTime = "End time must be after start time";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    Animated.spring(successAnim, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }).start();
    setSubmitted(true);
    if (Platform.OS === "android") ToastAndroid.show("Complaint submitted!", ToastAndroid.LONG);
  };

  if (submitted) {
    return (
      <SafeAreaView style={styles.safe}>
        <Animated.View style={[styles.successWrap, { opacity: successAnim, transform: [{ scale: successAnim }] }]}>
          <View style={styles.successIconBox}>
            <CheckCircle2 size={48} color={COLORS.success} strokeWidth={1.5} />
          </View>
          <Text style={styles.successTitle}>Complaint Filed!</Text>
          <Text style={styles.successSub}>Your ticket has been submitted to the warden. You'll receive updates via the portal.</Text>
          <View style={styles.successMeta}>
            {[["Type", type], ["Priority", PRIORITIES.find(p=>p.value===priority)?.label], ["Date", date.toDateString()]].map(([l,v]) => (
              <View key={l} style={styles.successRow}>
                <Text style={styles.successMetaLabel}>{l}</Text>
                <Text style={styles.successMetaValue}>{v}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity style={styles.newBtn} onPress={() => { setSubmitted(false); setType(""); setDescription(""); setPriority(""); }}>
            <Text style={styles.newBtnText}>Submit Another</Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Page header */}
      <View style={styles.pageHeader}>
        <View style={styles.pageIconBox}>
          <MessageSquareWarning size={20} color={COLORS.accent} strokeWidth={2} />
        </View>
        <View>
          <Text style={styles.pageTitle}>Complaint Portal</Text>
          <Text style={styles.pageSubtitle}>Report hostel issues to the warden</Text>
        </View>
      </View>

      <>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

          {/* Section 1 */}
          <SectionHeader number="1" title="Complaint Type" />
          <View style={styles.typeGrid}>
            {TYPES.map(({ label, value, Icon, color }) => {
              const active = type === value;
              return (
                <TouchableOpacity
                  key={value}
                  style={[styles.typeChip, active && { backgroundColor: color + "15", borderColor: color + "60" }]}
                  onPress={() => { setType(value); clearError("type"); }}
                >
                  <Icon size={16} color={active ? color : COLORS.textSub} strokeWidth={2} />
                  <Text style={[styles.typeChipText, active && { color }]}>{label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {errors.type && <Text style={styles.error}>{errors.type}</Text>}

          {/* Section 2 */}
          <SectionHeader number="2" title="Describe the Issue" />
          <TextInput
            placeholder="Be specific — location, duration, severity..."
            placeholderTextColor={COLORS.textSub}
            multiline
            value={description}
            onChangeText={t => { setDescription(t); clearError("description"); }}
            style={[styles.textArea, errors.description && styles.inputErr]}
          />
          {errors.description && <Text style={styles.error}>{errors.description}</Text>}

          {/* Section 3 */}
          <SectionHeader number="3" title="When did it happen?" />
          <View style={styles.timeRow}>
            {[
              { label: "DATE",  icon: CalendarDays, val: date.toLocaleDateString(),
                onPress: () => Platform.OS === "web" ? webDateRef.current?.showPicker?.() : setShowDatePicker(true) },
              { label: "FROM",  icon: Clock, val: startTime.toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" }),
                onPress: () => Platform.OS === "web" ? webStartRef.current?.showPicker?.() : setShowStartPicker(true) },
              { label: "UNTIL", icon: Clock, val: endTime.toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" }),
                onPress: () => Platform.OS === "web" ? webEndRef.current?.showPicker?.() : setShowEndPicker(true),
                err: errors.endTime },
            ].map(({ label, icon: Icon, val, onPress, err }) => (
              <TouchableOpacity key={label} style={[styles.timeBtn, err && styles.inputErr]} onPress={onPress}>
                <Text style={styles.timeBtnLabel}>{label}</Text>
                <View style={styles.timeBtnRow}>
                  <Icon size={13} color={COLORS.textSub} strokeWidth={2} />
                  <Text style={styles.timeBtnVal}>{val}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
          {errors.endTime && <Text style={styles.error}>{errors.endTime}</Text>}

          {Platform.OS === "web" && (
            <>
              <input ref={webDateRef}  type="date" value={fmtDate(date)}      onChange={e => setDate(p => mergeDate(p, e.target.value))}  style={{ position:"absolute", opacity:0, pointerEvents:"none", width:1, height:1 }} />
              <input ref={webStartRef} type="time" value={fmtTime(startTime)} onChange={e => setStartTime(p => mergeTime(p, e.target.value))} style={{ position:"absolute", opacity:0, pointerEvents:"none", width:1, height:1 }} />
              <input ref={webEndRef}   type="time" value={fmtTime(endTime)}   onChange={e => setEndTime(p => mergeTime(p, e.target.value))}   style={{ position:"absolute", opacity:0, pointerEvents:"none", width:1, height:1 }} />
            </>
          )}

          {/* Section 4 */}
          <SectionHeader number="4" title="Priority Level" />
          <View style={styles.priorityRow}>
            {PRIORITIES.map(({ label, value, color, bg }) => (
              <TouchableOpacity
                key={value}
                style={[styles.priorityBtn, priority === value && { backgroundColor: bg, borderColor: color + "50" }]}
                onPress={() => { setPriority(value); clearError("priority"); }}
              >
                <View style={[styles.priorityDot, { backgroundColor: color }]} />
                <Text style={[styles.priorityLabel, priority === value && { color, fontWeight: "700" }]}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {errors.priority && <Text style={styles.error}>{errors.priority}</Text>}

          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} activeOpacity={0.85}>
            <Text style={styles.submitText}>Submit Complaint</Text>
            <ChevronRight size={18} color={COLORS.white} strokeWidth={2.5} />
          </TouchableOpacity>

          <View style={{ height: SPACING.xl }} />
        </ScrollView>

        {Platform.OS !== "web" && showDatePicker  && <DateTimePicker value={date}      mode="date" onChange={(e,d) => { setShowDatePicker(false);  d && setDate(d); }} />}
        {Platform.OS !== "web" && showStartPicker && <DateTimePicker value={startTime} mode="time" onChange={(e,d) => { setShowStartPicker(false); d && setStartTime(d); }} />}
        {Platform.OS !== "web" && showEndPicker   && <DateTimePicker value={endTime}   mode="time" onChange={(e,d) => { setShowEndPicker(false);   d && setEndTime(d); }} />}
      </>
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
    backgroundColor: COLORS.accentMuted, borderWidth: 1, borderColor: "rgba(234,88,12,0.15)",
    alignItems: "center", justifyContent: "center",
  },
  pageTitle: { fontSize: 16, fontWeight: "700", color: COLORS.text },
  pageSubtitle: { fontSize: 12, color: COLORS.textSub, marginTop: 1 },

  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: SPACING.lg, marginBottom: SPACING.sm },
  sectionNum: { width: 22, height: 22, borderRadius: RADIUS.full, backgroundColor: COLORS.accentMuted, alignItems: "center", justifyContent: "center" },
  sectionNumText: { color: COLORS.accent, fontSize: 11, fontWeight: "800" },
  sectionTitle: { color: COLORS.text, fontSize: 15, fontWeight: "600" },

  typeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  typeChip: {
    flexDirection: "row", alignItems: "center", gap: 7,
    paddingVertical: 9, paddingHorizontal: 14, borderRadius: RADIUS.md,
    borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.bgCard,
    ...SHADOWS.card,
  },
  typeChipText: { color: COLORS.textSub, fontSize: 13, fontWeight: "500" },

  textArea: {
    backgroundColor: COLORS.bgCard, borderRadius: RADIUS.md, padding: SPACING.md,
    minHeight: 120, color: COLORS.text, borderWidth: 1, borderColor: COLORS.border,
    textAlignVertical: "top", fontSize: 15, lineHeight: 22,
    ...SHADOWS.card,
  },

  timeRow: { flexDirection: "row", gap: 8 },
  timeBtn: {
    flex: 1, backgroundColor: COLORS.bgCard, borderRadius: RADIUS.md,
    borderWidth: 1, borderColor: COLORS.border, padding: SPACING.md,
    ...SHADOWS.card,
  },
  timeBtnLabel: { fontSize: 9, fontWeight: "700", letterSpacing: 1.2, color: COLORS.textSub, marginBottom: 6 },
  timeBtnRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  timeBtnVal: { color: COLORS.text, fontSize: 12, fontWeight: "500" },

  priorityRow: { flexDirection: "row", gap: 10 },
  priorityBtn: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
    backgroundColor: COLORS.bgCard, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: RADIUS.md, paddingVertical: SPACING.md,
    ...SHADOWS.card,
  },
  priorityDot: { width: 8, height: 8, borderRadius: 4 },
  priorityLabel: { color: COLORS.textSub, fontSize: 14, fontWeight: "500" },

  submitBtn: {
    marginTop: SPACING.xl, backgroundColor: COLORS.accent, borderRadius: RADIUS.lg,
    padding: 16, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6,
    ...SHADOWS.accent,
  },
  submitText: { color: COLORS.white, fontSize: 16, fontWeight: "700" },

  inputErr: { borderColor: COLORS.danger },
  error: { color: COLORS.danger, fontSize: 12, marginTop: 4, marginLeft: 2 },

  successWrap: { flex: 1, alignItems: "center", justifyContent: "center", padding: SPACING.xl },
  successIconBox: {
    width: 96, height: 96, borderRadius: RADIUS.xl,
    backgroundColor: COLORS.successMuted, alignItems: "center", justifyContent: "center",
    marginBottom: SPACING.lg, borderWidth: 1, borderColor: "rgba(22,163,74,0.2)",
  },
  successTitle: { fontSize: 26, fontWeight: "800", color: COLORS.text, letterSpacing: -0.6, marginBottom: 8 },
  successSub: { color: COLORS.textSub, fontSize: 14, textAlign: "center", lineHeight: 21, marginBottom: SPACING.lg },
  successMeta: {
    width: "100%", backgroundColor: COLORS.bgCard, borderRadius: RADIUS.lg,
    borderWidth: 1, borderColor: COLORS.border, padding: SPACING.lg,
    marginBottom: SPACING.lg, gap: 10, ...SHADOWS.card,
  },
  successRow: { flexDirection: "row", justifyContent: "space-between" },
  successMetaLabel: { color: COLORS.textSub, fontSize: 13 },
  successMetaValue: { color: COLORS.text, fontSize: 13, fontWeight: "600" },
  newBtn: {
    backgroundColor: COLORS.bgCard, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: RADIUS.lg, paddingVertical: 14, paddingHorizontal: SPACING.xl, ...SHADOWS.card,
  },
  newBtnText: { color: COLORS.text, fontWeight: "600", fontSize: 15 },
});