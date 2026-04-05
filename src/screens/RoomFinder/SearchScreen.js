// src/screens/RoomFinder/SearchScreen.js
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { getRooms } from "../../services/api";
import {
  BLOCKS,
  BLOCK_TYPES,
  ROOM_TYPES,
  BED_OPTIONS,
} from "../../data/mockRooms";
import RoomCard from "../../components/RoomCard";
import FilterChip from "../../components/FilterChip";
import { COLORS, SPACING, RADIUS } from "../../theme";

// ── Filter state shape ──────────────────────────────────────────
const INITIAL_FILTERS = {
  block: null,
  blockType: null,
  roomType: null,
  beds: null,
};

export default function SearchScreen({ navigation }) {
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Reload whenever screen is focused (e.g., after Upload)
  useFocusEffect(
    useCallback(() => {
      fetchRooms(filters);
    }, [filters]),
  );

  // ── Data fetching ────────────────────────────────────────────
  // SUPABASE: getRooms already abstracts the call.
  // No changes needed here when you switch to Supabase.
  const fetchRooms = async (currentFilters) => {
    try {
      const data = await getRooms(currentFilters);
      setRooms(data);
    } catch (err) {
      console.error("fetchRooms error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchRooms(filters);
  };

  // ── Filter toggle helper ─────────────────────────────────────
  const toggle = (key, value) => {
    const next = { ...filters, [key]: filters[key] === value ? null : value };
    setFilters(next);
    setLoading(true);
    fetchRooms(next);
  };

  const clearAll = () => {
    setFilters(INITIAL_FILTERS);
    setLoading(true);
    fetchRooms(INITIAL_FILTERS);
  };

  const hasFilters = Object.values(filters).some((v) => v !== null);

  // ── Filter panel ─────────────────────────────────────────────
  const FilterSection = ({ label, options, filterKey }) => (
    <View style={styles.filterSection}>
      <Text style={styles.filterLabel}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {options.map((opt) => (
          <FilterChip
            key={String(opt)}
            label={String(opt)}
            selected={filters[filterKey] === opt}
            onPress={() => toggle(filterKey, opt)}
          />
        ))}
      </ScrollView>
    </View>
  );

  // ── Render ───────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safe}>
      {/* Filter Panel */}
      <View style={styles.filterPanel}>
        <View style={styles.filterHeader}>
          <Text style={styles.filterTitle}>Filters</Text>
          {hasFilters && (
            <TouchableOpacity onPress={clearAll}>
              <Text style={styles.clearText}>Clear all</Text>
            </TouchableOpacity>
          )}
        </View>
        <FilterSection label="Block" options={BLOCKS} filterKey="block" />
        <FilterSection
          label="Block Type"
          options={BLOCK_TYPES}
          filterKey="blockType"
        />
        <FilterSection
          label="Room Type"
          options={ROOM_TYPES}
          filterKey="roomType"
        />
        <FilterSection label="Beds" options={BED_OPTIONS} filterKey="beds" />
      </View>

      {/* Results */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={COLORS.accent} size="large" />
        </View>
      ) : (
        <FlatList
          data={rooms}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <RoomCard room={item} />}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.accent}
            />
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={styles.emptyText}>No rooms match your filters.</Text>
            </View>
          }
          ListFooterComponent={<View style={{ height: SPACING.xl }} />}
        />
      )}

      {/* FAB — Upload */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("Upload")}
        activeOpacity={0.85}
      >
        <Text style={styles.fabText}>+ Add Room</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  filterPanel: {
    backgroundColor: COLORS.bgCard,
    paddingTop: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: SPACING.sm,
  },
  filterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.xs,
  },
  filterTitle: {
    color: COLORS.text,
    fontWeight: "700",
    fontSize: 15,
  },
  clearText: {
    color: COLORS.accent,
    fontSize: 13,
  },
  filterSection: {
    marginBottom: SPACING.sm,
  },
  filterLabel: {
    color: COLORS.textSub,
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  list: {
    paddingTop: SPACING.md,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.xl,
  },
  emptyIcon: { fontSize: 40, marginBottom: SPACING.sm },
  emptyText: { color: COLORS.textSub, fontSize: 14, textAlign: "center" },
  fab: {
    position: "absolute",
    right: SPACING.lg,
    bottom: SPACING.xl,
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.xl,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 14,
    elevation: 6,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  fabText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 15,
  },
});
