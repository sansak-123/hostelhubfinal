// src/Mess/screens/CartScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";
import { COLORS, SPACING, RADIUS } from "../../theme";
import { useCart } from "../context/CartContext";
import { useMess } from "../context/MessContext";
import { useOrders } from "../context/OrdersContext";

const TYPE_COLOR = { veg: "#06D6A0", "non-veg": "#EF476F", egg: "#FFD166" };
const TYPE_LABEL = { veg: "V", "non-veg": "N", egg: "E" };

const CartItem = ({ item, onAdd, onRemove }) => (
  <View style={styles.cartItem}>
    <View style={styles.typeTag}>
      <Text
        style={[
          styles.typeTagText,
          { color: TYPE_COLOR[item.type] || COLORS.textSub },
        ]}
      >
        {TYPE_LABEL[item.type] || "?"}
      </Text>
    </View>
    <View style={styles.itemInfo}>
      <Text style={styles.itemName}>{item.foodname}</Text>
      <Text style={styles.itemPrice}>₹{item.price} each</Text>
    </View>
    <View style={styles.qtyRow}>
      <TouchableOpacity style={styles.qtyBtn} onPress={() => onRemove(item.id)}>
        <Text style={styles.qtyBtnText}>−</Text>
      </TouchableOpacity>
      <Text style={styles.qtyText}>{item.quantity}</Text>
      <TouchableOpacity style={styles.qtyBtn} onPress={() => onAdd(item)}>
        <Text style={styles.qtyBtnText}>+</Text>
      </TouchableOpacity>
    </View>
    <Text style={styles.itemTotal}>
      ₹{(item.quantity * parseFloat(item.price)).toFixed(2)}
    </Text>
  </View>
);

export default function CartScreen({ navigation }) {
  const { cart, addToCart, removeFromCart, clearCart, getTotalPrice } =
    useCart();
  const { selectedMess } = useMess();
  const { placeOrder } = useOrders();
  const [ordering, setOrdering] = useState(false);

  const handlePlaceOrder = () => {
    if (cart.length === 0 || !selectedMess) return;

    Alert.alert(
      "Place Order",
      `Ordering from ${selectedMess.name}\n\nTotal: ₹${getTotalPrice().toFixed(2)}\n\nConfirm?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: () => {
            setOrdering(true);
            // Save order to local state (replace with backend call when ready)
            placeOrder({ cart, mess: selectedMess });
            // TODO: backend integration:
            // await axios.post(`${BASE_URL}/place_order`, { items: cart, messId: selectedMess.id }, { withCredentials: true });
            clearCart();
            setOrdering(false);
            Alert.alert(
              "Order Placed! 🎉",
              "You can track your order status in the Orders tab.",
              [
                {
                  text: "Track Order",
                  onPress: () => navigation.navigate("Orders"),
                },
              ],
            );
          },
        },
      ],
    );
  };

  if (cart.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🛒</Text>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySub}>Add items from the menu</Text>
          <TouchableOpacity
            style={styles.browseBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.browseBtnText}>Browse Menu</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={cart}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <CartItem item={item} onAdd={addToCart} onRemove={removeFromCart} />
        )}
        ListHeaderComponent={
          <View>
            <Text style={styles.screenTitle}>Your Cart 🛒</Text>
            {selectedMess && (
              <View style={styles.messBanner}>
                <Text style={styles.messBannerIcon}>{selectedMess.icon}</Text>
                <View style={styles.messBannerText}>
                  <Text style={styles.messBannerName}>{selectedMess.name}</Text>
                  <Text style={styles.messBannerSub}>
                    📍 {selectedMess.location}
                  </Text>
                </View>
              </View>
            )}
          </View>
        }
        ListFooterComponent={
          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Items</Text>
              <Text style={styles.summaryValue}>
                {cart.reduce((s, c) => s + c.quantity, 0)}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>
                ₹{getTotalPrice().toFixed(2)}
              </Text>
            </View>
          </View>
        }
      />

      <View style={styles.footer}>
        <TouchableOpacity style={styles.clearBtn} onPress={clearCart}>
          <Text style={styles.clearBtnText}>Clear</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.orderBtn, ordering && { opacity: 0.6 }]}
          onPress={handlePlaceOrder}
          disabled={ordering}
        >
          <Text style={styles.orderBtnText}>
            Place Order · ₹{getTotalPrice().toFixed(2)}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  list: { padding: SPACING.md, paddingBottom: 100 },
  screenTitle: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: "800",
    marginBottom: SPACING.sm,
  },
  messBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.sm,
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  messBannerIcon: { fontSize: 24 },
  messBannerText: { flex: 1 },
  messBannerName: { color: COLORS.text, fontSize: 14, fontWeight: "700" },
  messBannerSub: { color: COLORS.textSub, fontSize: 12, marginTop: 1 },
  cartItem: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  typeTag: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.bgInput,
  },
  typeTagText: { fontSize: 9, fontWeight: "800" },
  itemInfo: { flex: 1 },
  itemName: { color: COLORS.text, fontSize: 15, fontWeight: "700" },
  itemPrice: { color: COLORS.textSub, fontSize: 12, marginTop: 2 },
  qtyRow: { flexDirection: "row", alignItems: "center", gap: SPACING.sm },
  qtyBtn: {
    backgroundColor: COLORS.bgInput,
    borderRadius: RADIUS.sm,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  qtyBtnText: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 22,
  },
  qtyText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "700",
    minWidth: 20,
    textAlign: "center",
  },
  itemTotal: {
    color: COLORS.accent,
    fontSize: 15,
    fontWeight: "800",
    minWidth: 60,
    textAlign: "right",
  },
  summary: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    marginTop: SPACING.md,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  summaryLabel: { color: COLORS.textSub, fontSize: 14 },
  summaryValue: { color: COLORS.text, fontSize: 14, fontWeight: "600" },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.sm,
  },
  totalLabel: { color: COLORS.text, fontSize: 16, fontWeight: "800" },
  totalValue: { color: COLORS.accent, fontSize: 18, fontWeight: "800" },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    gap: SPACING.sm,
    padding: SPACING.md,
    backgroundColor: COLORS.bg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  clearBtn: {
    flex: 1,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  clearBtnText: { color: COLORS.textSub, fontWeight: "700", fontSize: 15 },
  orderBtn: {
    flex: 3,
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.md,
    paddingVertical: 14,
    alignItems: "center",
  },
  orderBtnText: { color: "#fff", fontWeight: "800", fontSize: 15 },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.xl,
  },
  emptyEmoji: { fontSize: 60, marginBottom: SPACING.md },
  emptyTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: SPACING.xs,
  },
  emptySub: { color: COLORS.textSub, fontSize: 14, marginBottom: SPACING.lg },
  browseBtn: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
  },
  browseBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});
