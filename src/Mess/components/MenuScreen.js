// src/Mess/components/MenuScreen.js
import React, { useState, useRef } from "react";
import {
  View, Text, StyleSheet, FlatList, TextInput,
  TouchableOpacity, ScrollView, Modal, Animated,
  StatusBar, SafeAreaView,
} from "react-native";
import {
  Search, X, ShoppingCart, ClipboardList, UtensilsCrossed, Plus,
  Flame, Soup, Salad, Coffee, Croissant, Egg, Pizza, Wheat,
  Leaf, Drumstick,
} from "lucide-react-native";
import { COLORS, SPACING, RADIUS, SHADOWS } from "../../theme";
import { useCart } from "../context/CartContext";
import { useMess } from "../context/MessContext";
import { MOCK_FOOD_ITEMS, CATEGORIES, TYPES } from "../data/MockData";

// ─── Category icon map ────────────────────────────────────────────────────────
const CATEGORY_ICON_MAP = {
  "fried rice": { Icon: Flame,     color: "#F97316" },
  noodles:      { Icon: Soup,      color: "#D97706" },
  pasta:        { Icon: Wheat,     color: "#CA8A04" },
  dosa:         { Icon: Salad,     color: "#16A34A" },
  omelete:      { Icon: Egg,       color: "#D97706" },
  beverage:     { Icon: Coffee,    color: "#92400E" },
  puff:         { Icon: Croissant, color: "#B45309" },
  idli:         { Icon: Pizza,     color: "#EA580C" },
};
const DEFAULT_CATEGORY = { Icon: UtensilsCrossed, color: COLORS.textSub };

// Type dot config
const TYPE_CONFIG = {
  veg:        { color: "#16A34A", Icon: Leaf },
  "non-veg":  { color: "#DC2626", Icon: Drumstick },
  egg:        { color: "#D97706", Icon: Egg },
};

// ─── Veg dot ─────────────────────────────────────────────────────────────────
const TypeDot = ({ type }) => {
  const cfg = TYPE_CONFIG[type] ?? { color: COLORS.textSub };
  return (
    <View style={[styles.typeDot, { borderColor: cfg.color, backgroundColor: cfg.color + "22" }]}>
      <View style={[styles.typeDotInner, { backgroundColor: cfg.color }]} />
    </View>
  );
};

// ─── Filter chip row — inline, no stretch ────────────────────────────────────
const FilterRow = ({ items, selected, onSelect, secondary }) =>
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.filterRow}
  >
    {items.map(item => {
      const isActive = selected === item.value;
      return (
        <TouchableOpacity
          key={item.value}
          style={[
            styles.chip,
            secondary && styles.chipSecondary,
            isActive && styles.chipActive,
          ]}
          onPress={() => onSelect(isActive ? "" : item.value)}
          activeOpacity={0.75}
        >
          <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
            {item.label}
          </Text>
        </TouchableOpacity>
      );
    })}
  </ScrollView>;

// ─── Food card ────────────────────────────────────────────────────────────────
const FoodCard = ({ item, onAddToCart, onShowIngredients }) => {
  const { getItemQuantityInCart } = useCart();
  const inCart    = getItemQuantityInCart(item.id);
  const remaining = Math.max(0, (item.quantity || 0) - inCart);
  const isAvailable = item.status === "available" && remaining > 0;
  const { Icon: CatIcon, color: catColor } =
    CATEGORY_ICON_MAP[item.category?.toLowerCase()] ?? DEFAULT_CATEGORY;

  return (
    <View style={[styles.foodCard, !isAvailable && styles.foodCardDisabled]}>
      {/* Image area */}
      <View style={[styles.cardImage, { backgroundColor: catColor + "12" }]}>
        <View style={[styles.cardIconCircle, { backgroundColor: catColor + "20", borderColor: catColor + "35" }]}>
          <CatIcon size={30} color={catColor} strokeWidth={1.8} />
        </View>
        <View style={styles.typeDotWrap}><TypeDot type={item.type} /></View>
        {!isAvailable && (
          <View style={[styles.badge, styles.badgeOut]}><Text style={styles.badgeText}>Sold out</Text></View>
        )}
        {isAvailable && remaining <= 5 && (
          <View style={[styles.badge, styles.badgeLow]}><Text style={styles.badgeText}>{remaining} left</Text></View>
        )}
        {inCart > 0 && (
          <View style={[styles.badge, styles.badgeCart]}><Text style={styles.badgeText}>{inCart} in cart</Text></View>
        )}
      </View>

      {/* Body */}
      <View style={styles.cardBody}>
        <Text style={styles.cardName} numberOfLines={2}>{item.foodname}</Text>
        <TouchableOpacity style={styles.ingredBtn} onPress={() => onShowIngredients(item.des)}>
          <ClipboardList size={10} color={COLORS.textSub} strokeWidth={2} />
          <Text style={styles.ingredBtnText}>Ingredients</Text>
        </TouchableOpacity>
        <View style={styles.cardFooter}>
          <Text style={styles.price}>₹{item.price}</Text>
          <TouchableOpacity
            style={[styles.addBtn, !isAvailable && styles.addBtnOff]}
            onPress={() => isAvailable && onAddToCart(item)}
            disabled={!isAvailable}
          >
            {isAvailable
              ? <><Plus size={11} color={COLORS.white} strokeWidth={3} /><Text style={styles.addBtnText}>Add</Text></>
              : <Text style={[styles.addBtnText, { color: COLORS.textSub }]}>N/A</Text>
            }
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function MenuScreen({ navigation }) {
  const [search, setSearch]           = useState("");
  const [selType, setSelType]         = useState("");
  const [selCat, setSelCat]           = useState("");
  const [ingredModal, setIngredModal] = useState({ visible: false, text: "" });
  const [toast, setToast]             = useState({ visible: false, msg: "" });
  const [foodItems, setFoodItems]     = useState(MOCK_FOOD_ITEMS);
  const toastAnim = useRef(new Animated.Value(0)).current;

  const { addToCart, getTotalCount } = useCart();
  const { selectedMess }             = useMess();

  const showToast = (msg) => {
    setToast({ visible: true, msg });
    Animated.sequence([
      Animated.timing(toastAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.delay(1800),
      Animated.timing(toastAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => setToast(t => ({ ...t, visible: false })));
  };

  const handleAdd = (item) => {
    addToCart(item);
    setFoodItems(prev => prev.map(f =>
      f.id === item.id ? { ...f, quantity: f.quantity - 1 } : f
    ));
    showToast(`${item.foodname} added to cart`);
  };

  const filtered = foodItems.filter(item => {
    const s = search.toLowerCase();
    return (
      (!s || item.foodname.toLowerCase().includes(s) || item.category.toLowerCase().includes(s)) &&
      (!selType || item.type === selType) &&
      (!selCat  || item.category.toLowerCase().includes(selCat))
    );
  });

  const cartCount = getTotalCount();

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerIconBox}>
            <UtensilsCrossed size={18} color={COLORS.accent} strokeWidth={2} />
          </View>
          <View>
            <Text style={styles.headerTitle}>
              {selectedMess ? selectedMess.shortName : "Night Mess"}
            </Text>
            {selectedMess && <Text style={styles.headerSub}>{selectedMess.location}</Text>}
          </View>
        </View>
        <TouchableOpacity style={styles.cartBtn} onPress={() => navigation.navigate("Cart")}>
          <ShoppingCart size={20} color={COLORS.accent} strokeWidth={2} />
          {cartCount > 0 && (
            <View style={styles.cartBadge}><Text style={styles.cartBadgeText}>{cartCount}</Text></View>
          )}
        </TouchableOpacity>
      </View>

      {/* ── Filter bar: search + chips all in one contained block ── */}
      <View style={styles.filterBar}>
        {/* Search */}
        <View style={styles.searchBox}>
          <Search size={14} color={COLORS.textSub} strokeWidth={2} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search menu..."
            placeholderTextColor={COLORS.textSub}
            value={search}
            onChangeText={setSearch}
          />
          {!!search && (
            <TouchableOpacity onPress={() => setSearch("")} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <X size={14} color={COLORS.textSub} strokeWidth={2} />
            </TouchableOpacity>
          )}
        </View>

        {/* Divider */}
        <View style={styles.filterDivider} />

        {/* Type chips row label + chips */}
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>TYPE</Text>
          <FilterRow items={TYPES} selected={selType} onSelect={setSelType} />
        </View>

        {/* Category chips row */}
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>CATEGORY</Text>
          <FilterRow items={CATEGORIES} selected={selCat} onSelect={setSelCat} secondary />
        </View>

        {/* Active filter summary + clear */}
        {(selType || selCat || search) && (
          <View style={styles.activeSummary}>
            <Text style={styles.activeSummaryText}>
              {[search && `"${search}"`, selType, selCat].filter(Boolean).join(" · ")}
            </Text>
            <TouchableOpacity
              onPress={() => { setSearch(""); setSelType(""); setSelCat(""); }}
              style={styles.clearBtn}
            >
              <X size={10} color={COLORS.accent} strokeWidth={3} />
              <Text style={styles.clearBtnText}>Clear</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* ── Results count ── */}
      <View style={styles.resultsRow}>
        <Text style={styles.resultsText}>{filtered.length} items</Text>
      </View>

      {/* ── Grid ── */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        numColumns={2}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={({ item }) => (
          <FoodCard
            item={item}
            onAddToCart={handleAdd}
            onShowIngredients={t => setIngredModal({ visible: true, text: t })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyIconBox}>
              <UtensilsCrossed size={32} color={COLORS.textSub} strokeWidth={1.5} />
            </View>
            <Text style={styles.emptyTitle}>No items found</Text>
            <Text style={styles.emptySub}>Try adjusting your filters</Text>
          </View>
        }
      />

      {/* ── Ingredients modal ── */}
      <Modal
        visible={ingredModal.visible}
        transparent
        animationType="slide"
        onRequestClose={() => setIngredModal({ visible: false, text: "" })}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIngredModal({ visible: false, text: "" })}
        >
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <View style={styles.modalTitleRow}>
              <ClipboardList size={18} color={COLORS.accent} strokeWidth={2} />
              <Text style={styles.modalTitle}>Ingredients</Text>
            </View>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>{ingredModal.text}</Text>
            </View>
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setIngredModal({ visible: false, text: "" })}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ── Toast ── */}
      {toast.visible && (
        <Animated.View style={[styles.toast, { opacity: toastAnim }]}>
          <Text style={styles.toastText}>{toast.msg}</Text>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },

  // Header
  header: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: SPACING.md, paddingVertical: 12,
    backgroundColor: COLORS.bgCard,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
    ...SHADOWS.card,
  },
  headerLeft:    { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
  headerIconBox: {
    width: 36, height: 36, borderRadius: RADIUS.sm,
    backgroundColor: COLORS.accentMuted,
    borderWidth: 1, borderColor: "rgba(244,63,94,0.15)",
    alignItems: "center", justifyContent: "center",
  },
  headerTitle: { fontSize: 15, fontWeight: "700", color: COLORS.text },
  headerSub:   { fontSize: 11, color: COLORS.textSub, marginTop: 1 },
  cartBtn:     { padding: 8, position: "relative" },
  cartBadge: {
    position: "absolute", top: 2, right: 2,
    backgroundColor: COLORS.danger, borderRadius: RADIUS.full,
    minWidth: 17, height: 17, justifyContent: "center", alignItems: "center",
    paddingHorizontal: 3,
  },
  cartBadgeText: { color: COLORS.white, fontSize: 9, fontWeight: "700" },

  // ── Filter bar ──────────────────────────────────────────────────────────────
  // A single card that contains search + both chip rows
  filterBar: {
    marginHorizontal: SPACING.md,
    marginTop: SPACING.sm,
    marginBottom: 4,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    borderWidth: 1, borderColor: COLORS.border,
    overflow: "hidden",
    ...SHADOWS.card,
  },

  // Search row inside the card
  searchBox: {
    flexDirection: "row", alignItems: "center", gap: 8,
    paddingHorizontal: SPACING.md, paddingVertical: 10,
  },
  searchInput: {
    flex: 1, color: COLORS.text, fontSize: 14, paddingVertical: 0,
  },

  // Thin divider between search and chips
  filterDivider: {
    height: 1, backgroundColor: COLORS.border,
    marginHorizontal: SPACING.md,
  },

  // Each chip section (label + scroll row)
  filterSection: {
    paddingTop: 8, paddingBottom: 4,
  },
  filterLabel: {
    fontSize: 9, fontWeight: "700", letterSpacing: 1.2,
    color: COLORS.textSub,
    paddingHorizontal: SPACING.md,
    marginBottom: 6,
  },

  // The horizontal scroll — critical: alignItems must NOT stretch
  filterRow: {
    flexDirection: "row",       // ← explicit row direction
    alignItems: "center",       // ← center vertically, not stretch
    paddingHorizontal: SPACING.md,
    paddingBottom: 4,
    gap: 6,
  },

  // Chip — intrinsic size only, never flex-grow
  chip: {
    alignSelf: "flex-start",    // ← prevents height stretch
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.bgInput,
    borderWidth: 1, borderColor: COLORS.border,
  },
  chipSecondary: {
    backgroundColor: COLORS.bg,
  },
  chipActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  chipText:       { color: COLORS.textSub, fontSize: 12, fontWeight: "500" },
  chipTextActive: { color: COLORS.white,   fontSize: 12, fontWeight: "600" },

  // Active filter summary pill
  activeSummary: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    marginHorizontal: SPACING.md, marginBottom: 8, marginTop: 2,
    backgroundColor: COLORS.accentMuted,
    borderRadius: RADIUS.sm, paddingHorizontal: 10, paddingVertical: 5,
    borderWidth: 1, borderColor: "rgba(244,63,94,0.15)",
  },
  activeSummaryText: { color: COLORS.accent, fontSize: 11, fontWeight: "500", flex: 1 },
  clearBtn: {
    flexDirection: "row", alignItems: "center", gap: 3,
    paddingLeft: 8,
  },
  clearBtnText: { color: COLORS.accent, fontSize: 11, fontWeight: "700" },

  // Results row
  resultsRow: {
    paddingHorizontal: SPACING.md,
    paddingTop: 8, paddingBottom: 4,
  },
  resultsText: { color: COLORS.textSub, fontSize: 11, fontWeight: "500" },

  // FlatList
  list:        { flex: 1 },
  listContent: {
    paddingHorizontal: SPACING.sm,
    paddingTop: 4,
    paddingBottom: SPACING.xl,
  },
  columnWrapper: { gap: SPACING.sm, marginBottom: SPACING.sm },

  // Food card
  foodCard: {
    flex: 1,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    borderWidth: 1, borderColor: COLORS.border,
    overflow: "hidden",
    ...SHADOWS.card,
  },
  foodCardDisabled: { opacity: 0.55 },

  cardImage: {
    height: 100,
    justifyContent: "center", alignItems: "center",
    position: "relative",
  },
  cardIconCircle: {
    width: 56, height: 56, borderRadius: 28,
    borderWidth: 1,
    justifyContent: "center", alignItems: "center",
  },

  typeDotWrap: { position: "absolute", top: 7, left: 7 },
  typeDot: {
    width: 14, height: 14, borderRadius: 3, borderWidth: 1.5,
    justifyContent: "center", alignItems: "center",
  },
  typeDotInner: { width: 6, height: 6, borderRadius: 1.5 },

  badge: {
    position: "absolute",
    borderRadius: RADIUS.xs,
    paddingHorizontal: 5, paddingVertical: 2,
  },
  badgeOut:  { bottom: 6, left: 6,  backgroundColor: COLORS.danger  },
  badgeLow:  { bottom: 6, left: 6,  backgroundColor: COLORS.warning  },
  badgeCart: { top: 6,   right: 6,  backgroundColor: COLORS.accent   },
  badgeText: { color: COLORS.white, fontSize: 8, fontWeight: "700" },

  cardBody: { padding: SPACING.sm },
  cardName: {
    color: COLORS.text, fontSize: 12, fontWeight: "700",
    marginBottom: 5, lineHeight: 17, minHeight: 34,
  },
  ingredBtn: {
    flexDirection: "row", alignItems: "center", gap: 3,
    alignSelf: "flex-start",
    backgroundColor: COLORS.bgInput, borderRadius: RADIUS.xs,
    paddingVertical: 3, paddingHorizontal: 6, marginBottom: 7,
    borderWidth: 1, borderColor: COLORS.border,
  },
  ingredBtnText: { color: COLORS.textSub, fontSize: 9 },

  cardFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  price:      { color: COLORS.accent, fontSize: 14, fontWeight: "800" },
  addBtn: {
    flexDirection: "row", alignItems: "center", gap: 3,
    backgroundColor: COLORS.accent, borderRadius: RADIUS.sm,
    paddingHorizontal: 9, paddingVertical: 5,
  },
  addBtnOff:  { backgroundColor: COLORS.bgInput },
  addBtnText: { color: COLORS.white, fontSize: 10, fontWeight: "700" },

  // Empty state
  empty: {
    alignItems: "center", paddingTop: 72, gap: 10,
  },
  emptyIconBox: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: COLORS.bgMuted,
    alignItems: "center", justifyContent: "center", marginBottom: 4,
  },
  emptyTitle: { color: COLORS.text,    fontSize: 15, fontWeight: "700" },
  emptySub:   { color: COLORS.textSub, fontSize: 13 },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: COLORS.overlay, justifyContent: "flex-end" },
  modalSheet: {
    backgroundColor: COLORS.bgCard,
    borderTopLeftRadius: RADIUS.xl, borderTopRightRadius: RADIUS.xl,
    padding: SPACING.lg, paddingBottom: 36,
  },
  modalHandle: {
    width: 36, height: 4, backgroundColor: COLORS.border,
    borderRadius: 2, alignSelf: "center", marginBottom: SPACING.md,
  },
  modalTitleRow: {
    flexDirection: "row", alignItems: "center", gap: 8, marginBottom: SPACING.md,
  },
  modalTitle:   { color: COLORS.text, fontSize: 16, fontWeight: "700" },
  modalContent: {
    backgroundColor: COLORS.bgInput, borderRadius: RADIUS.md,
    padding: SPACING.md, marginBottom: SPACING.md,
    borderWidth: 1, borderColor: COLORS.border,
  },
  modalText:  { color: COLORS.text, fontSize: 14, lineHeight: 22 },
  modalClose: {
    backgroundColor: COLORS.accent, borderRadius: RADIUS.md,
    paddingVertical: 14, alignItems: "center", ...SHADOWS.accent,
  },
  modalCloseText: { color: COLORS.white, fontWeight: "700", fontSize: 15 },

  // Toast
  toast: {
    position: "absolute", bottom: 24,
    left: SPACING.lg, right: SPACING.lg,
    backgroundColor: COLORS.text, borderRadius: RADIUS.md,
    padding: SPACING.md, alignItems: "center",
  },
  toastText: { color: COLORS.white, fontWeight: "600", fontSize: 13 },
});