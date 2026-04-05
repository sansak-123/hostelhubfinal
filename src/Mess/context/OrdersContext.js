// src/Mess/context/OrdersContext.js
import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";

const OrdersContext = createContext();

const SIMULATE_STATUS_DELAYS = {
  Pending:   8000,
  Confirmed: 20000,
};

let orderCounter = 1;

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const timersRef = useRef({});

  const placeOrder = ({ cart, mess }) => {
    const now      = new Date();
    const todayKey = now.toISOString().split("T")[0];

    const todayOrders = orders.filter(
      (o) =>
        o.messId === mess.id &&
        o.dateKey === todayKey &&
        o.status !== "Rejected"
    );
    const queueNumber = todayOrders.length + 1;

    const newOrders = cart.map((item, idx) => ({
      id:           `${Date.now()}_${idx}`,
      orderId:      `ORD${String(orderCounter++).padStart(4, "0")}`,
      messId:       mess.id,
      messName:     mess.name,
      messIcon:     mess.icon,
      messLocation: mess.location,
      dateKey:      todayKey,
      createdAt:    now.toISOString(),
      foodname:     item.foodname,
      category:     item.category,
      type:         item.type,
      price:        item.price,
      quantity:     item.quantity,
      status:       "Pending",
      queueNumber,
      estimatedTime: null,
    }));

    setOrders((prev) => [...newOrders, ...prev]);

    newOrders.forEach((order) => simulateProgression(order.id));

    return newOrders;
  };

  const simulateProgression = (orderId) => {
    const t1 = setTimeout(() => {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? { ...o, status: "Confirmed", estimatedTime: 12 }
            : o
        )
      );
      const t2 = setTimeout(() => {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId
              ? { ...o, status: "Ready", estimatedTime: null }
              : o
          )
        );
      }, SIMULATE_STATUS_DELAYS.Confirmed);
      timersRef.current[`${orderId}_2`] = t2;
    }, SIMULATE_STATUS_DELAYS.Pending);
    timersRef.current[`${orderId}_1`] = t1;
  };

  const getOrdersByDate  = (dateKey) => orders.filter((o) => o.dateKey === dateKey);
  const getActiveOrders  = ()         => orders.filter((o) => o.status === "Pending" || o.status === "Confirmed");

  useEffect(() => {
    return () => {
      Object.values(timersRef.current).forEach(clearTimeout);
    };
  }, []);

  return (
    <OrdersContext.Provider
      value={{ orders, placeOrder, getOrdersByDate, getActiveOrders }}
    >
      {children}
    </OrdersContext.Provider>
  );
}

export const useOrders = () => {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used within an OrdersProvider");
  return ctx;
};