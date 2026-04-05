// src/screens/RoomFinder/UploadScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from "react-native";

import { addRoom } from "../../services/api";
import { BLOCKS, BLOCK_TYPES, ROOM_TYPES } from "../../data/mockRooms";
import RatingInput from "../../components/RatingInput";
import FilterChip from "../../components/FilterChip";
import { COLORS, SPACING, RADIUS } from "../../theme";

// ── Initial form state ────────────────────────────────────────
const INITIAL_FORM = {
  block: null,
  blockType: null,
  roomType: null,
  beds: null,
  ratings: { wifi: 0, spaciousness: 0, cupboard: 0, overall: 0 },
  rank: "",
  additionalInfo: "",
  photos: [], // placeholder — actual upload to Supabase Storage later
};

export default function UploadScreen({ navigation }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);

  // ── Field helpers ────────────────────────────────────────────
  const set = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const setRating = (key, val) =>
    setForm((prev) => ({
      ...prev,
      ratings: { ...prev.ratings, [key]: val },
    }));

  const toggleSingle = (key, val) => set(key, form[key] === val ? null : val);

  // ── Validation ───────────────────────────────────────────────
  const isValid =
    form.block &&
    form.blockType &&
    form.roomType &&
    form.beds &&
    form.ratings.wifi > 0 &&
    form.ratings.spaciousness > 0 &&
    form.ratings.cupboard > 0 &&
    form.ratings.overall > 0;

  // ── Submit ───────────────────────────────────────────────────
  // SUPABASE: addRoom() in api.js will be replaced with a Supabase insert.
  // Photo upload will call supabase.storage.from('room-photos').upload(...)
  const handleSubmit = async () => {
    if (!isValid) {
      Alert.alert(
        "Incomplete",
        "Please fill in all required fields and ratings.",
      );
      return;
    }
    setSubmitting(true);
    try {
      await addRoom({
        ...form,
        rank: form.rank ? Number(form.rank) : null,
      });
      Alert.alert("✅ Success", "Room added!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      Alert.alert("Error", "Could not save room. Please try again.");
      console.error("addRoom error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Reusable section header ──────────────────────────────────
  const Section = ({ title, children }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  // ── Chip group ───────────────────────────────────────────────
  const ChipGroup = ({ options, formKey }) => (
    <View style={styles.chipGroup}>
      {options.map((opt) => (
        <FilterChip
          key={String(opt)}
          label={String(opt)}
          selected={form[formKey] === opt}
          onPress={() => toggleSingle(formKey, opt)}
        />
      ))}
    </View>
  );

  // ── Render ───────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Room Details ─── */}
        <Section title="Block *">
          <ChipGroup options={BLOCKS} formKey="block" />
        </Section>

        <Section title="Block Type *">
          <ChipGroup options={BLOCK_TYPES} formKey="blockType" />
        </Section>

        <Section title="Room Type *">
          <ChipGroup options={ROOM_TYPES} formKey="roomType" />
        </Section>

        <Section title="Number of Beds *">
          <ChipGroup options={[1, 2, 3, 4, 5, 6]} formKey="beds" />
        </Section>

        {/* ── Ratings ─── */}
        <Section title="Ratings *">
          <RatingInput
            label="WiFi Quality"
            value={form.ratings.wifi}
            onChange={(v) => setRating("wifi", v)}
          />
          <RatingInput
            label="Room Spaciousness"
            value={form.ratings.spaciousness}
            onChange={(v) => setRating("spaciousness", v)}
          />
          <RatingInput
            label="Cupboard Space"
            value={form.ratings.cupboard}
            onChange={(v) => setRating("cupboard", v)}
          />
          <RatingInput
            label="Overall"
            value={form.ratings.overall}
            onChange={(v) => setRating("overall", v)}
          />
        </Section>

        {/* ── Optional ─── */}
        <Section title="Rank (optional)">
          <TextInput
            style={styles.input}
            placeholder="e.g. 1"
            placeholderTextColor={COLORS.textSub}
            keyboardType="numeric"
            value={form.rank}
            onChangeText={(t) => set("rank", t)}
          />
        </Section>

        <Section title="Additional Info (optional)">
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Corner room, great view, noisy floor, etc."
            placeholderTextColor={COLORS.textSub}
            multiline
            numberOfLines={4}
            value={form.additionalInfo}
            onChangeText={(t) => set("additionalInfo", t)}
          />
        </Section>

        {/* ── Photo / Video Upload (UI only) ─── */}
        {/* SUPABASE: Wire real upload to supabase.storage here */}
        <Section title="Photos / Videos (optional)">
          <TouchableOpacity style={styles.uploadBox} activeOpacity={0.7}>
            <Text style={styles.uploadIcon}>📷</Text>
            <Text style={styles.uploadText}>Tap to attach media</Text>
            <Text style={styles.uploadSub}>
              Upload will connect to Supabase Storage
            </Text>
          </TouchableOpacity>
        </Section>

        {/* ── Submit ─── */}
        <TouchableOpacity
          style={[styles.submitBtn, !isValid && styles.submitDisabled]}
          onPress={handleSubmit}
          activeOpacity={0.85}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.submitText}>Submit Room</Text>
          )}
        </TouchableOpacity>

        <View style={{ height: SPACING.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scroll: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    color: COLORS.textSub,
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: SPACING.sm,
  },
  chipGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  input: {
    backgroundColor: COLORS.bgInput,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: 12,
    color: COLORS.text,
    fontSize: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  uploadBox: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderStyle: "dashed",
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    alignItems: "center",
    gap: 6,
  },
  uploadIcon: { fontSize: 32 },
  uploadText: { color: COLORS.text, fontWeight: "600", fontSize: 14 },
  uploadSub: { color: COLORS.textSub, fontSize: 11 },
  submitBtn: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.md,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: SPACING.md,
  },
  submitDisabled: {
    opacity: 0.4,
  },
  submitText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 16,
  },
});
