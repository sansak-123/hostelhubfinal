// src/screens/Chat/ChatScreen.js
// Warm light theme · Lucide icons

import { useState, useRef, useEffect } from "react";
import {
  View, TextInput, TouchableOpacity, Text,
  FlatList, StyleSheet, KeyboardAvoidingView,
  Platform, Animated, SafeAreaView,
} from "react-native";
import { Send, Bot, Zap } from "lucide-react-native";
import { sendMessage } from "../../services/chatbotApi";
import { COLORS, RADIUS, SPACING, SHADOWS } from "../../theme";

const QUICK_PROMPTS = [
  "Mess timings?",
  "Warden contact?",
  "WiFi password?",
  "Laundry hours?",
];

function TypingIndicator() {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = (dot, delay) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: -5, duration: 280, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0,  duration: 280, useNativeDriver: true }),
        ])
      ).start();
    anim(dot1, 0); anim(dot2, 140); anim(dot3, 280);
  }, []);

  return (
    <View style={styles.typingRow}>
      <View style={styles.botAvatarSmall}>
        <Bot size={14} color={COLORS.accent} strokeWidth={2.5} />
      </View>
      <View style={styles.typingBubble}>
        {[dot1, dot2, dot3].map((d, i) => (
          <Animated.View key={i} style={[styles.typingDot, { transform: [{ translateY: d }] }]} />
        ))}
      </View>
    </View>
  );
}

function ChatBubble({ msg }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(8)).current;
  const isUser = msg.type === "user";

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 220, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 90, friction: 12, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[
      styles.bubbleRow,
      isUser ? styles.bubbleRowUser : styles.bubbleRowBot,
      { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
    ]}>
      {!isUser && (
        <View style={styles.botAvatar}>
          <Bot size={15} color={COLORS.accent} strokeWidth={2.5} />
        </View>
      )}
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}>
        <Text style={[styles.bubbleText, isUser ? styles.userText : styles.botText]}>
          {msg.text}
        </Text>
        <Text style={[styles.timestamp, isUser && styles.timestampUser]}>
          {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </Text>
      </View>
    </Animated.View>
  );
}

export default function ChatScreen() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { type: "bot", text: "Hi! I'm your HostelHub AI assistant. Ask me anything about hostel rules, facilities, or campus life." },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const listRef = useRef(null);

  const scrollDown = () => setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);

  const handleSend = async (text) => {
    const msg = text || input;
    if (!msg.trim()) return;

    setMessages(prev => [...prev, { type: "user", text: msg }]);
    setInput("");
    setIsTyping(true);
    scrollDown();

    try {
      const res = await sendMessage(msg, messages);
      setMessages(prev => [...prev, { type: "bot", text: res.reply }]);
    } catch {
      setMessages(prev => [...prev, { type: "bot", text: "Sorry, I couldn't connect. Please try again." }]);
    } finally {
      setIsTyping(false);
      scrollDown();
    }
  };

  const canSend = input.trim().length > 0;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Page header */}
      <View style={styles.pageHeader}>
        <View style={styles.pageHeaderLeft}>
          <View style={styles.pageIconBox}>
            <Bot size={20} color={COLORS.accent} strokeWidth={2} />
          </View>
          <View>
            <Text style={styles.pageTitle}>AI Chatbot</Text>
            <Text style={styles.pageSubtitle}>Powered by HostelHub AI</Text>
          </View>
        </View>
        <View style={styles.onlinePill}>
          <View style={styles.onlineDot} />
          <Text style={styles.onlineText}>Online</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={90}
      >
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(_, i) => String(i)}
          renderItem={({ item }) => <ChatBubble msg={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={isTyping ? <TypingIndicator /> : null}
          onContentSizeChange={scrollDown}
        />

        {/* Quick prompts */}
        {messages.length <= 1 && (
          <View style={styles.quickPrompts}>
            <View style={styles.quickHeader}>
              <Zap size={12} color={COLORS.accent} strokeWidth={2.5} />
              <Text style={styles.quickHeaderText}>Quick questions</Text>
            </View>
            <View style={styles.quickRow}>
              {QUICK_PROMPTS.map(q => (
                <TouchableOpacity key={q} style={styles.quickChip} onPress={() => handleSend(q)}>
                  <Text style={styles.quickChipText}>{q}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Input bar */}
        <View style={styles.inputBar}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Ask anything about the hostel..."
            placeholderTextColor={COLORS.textSub}
            style={styles.input}
            multiline
            maxLength={500}
            returnKeyType="send"
          />
          <TouchableOpacity
            style={[styles.sendBtn, !canSend && styles.sendBtnOff]}
            onPress={() => handleSend()}
            disabled={!canSend}
          >
            <Send size={16} color={canSend ? COLORS.white : COLORS.textSub} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },

  pageHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.bgCard,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    ...SHADOWS.card,
  },
  pageHeaderLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  pageIconBox: {
    width: 40, height: 40, borderRadius: RADIUS.md,
    backgroundColor: COLORS.accentMuted, borderWidth: 1, borderColor: "rgba(234,88,12,0.15)",
    alignItems: "center", justifyContent: "center",
  },
  pageTitle: { fontSize: 16, fontWeight: "700", color: COLORS.text },
  pageSubtitle: { fontSize: 12, color: COLORS.textSub, marginTop: 1 },
  onlinePill: {
    flexDirection: "row", alignItems: "center", gap: 5,
    backgroundColor: COLORS.successMuted, borderRadius: RADIUS.full,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  onlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.success },
  onlineText: { color: COLORS.success, fontSize: 11, fontWeight: "600" },

  listContent: { paddingHorizontal: SPACING.md, paddingTop: SPACING.md, paddingBottom: SPACING.sm },

  bubbleRow: { flexDirection: "row", marginBottom: SPACING.sm, alignItems: "flex-end", gap: 8 },
  bubbleRowUser: { justifyContent: "flex-end" },
  bubbleRowBot:  { justifyContent: "flex-start" },

  botAvatar: {
    width: 30, height: 30, borderRadius: RADIUS.full,
    backgroundColor: COLORS.accentMuted, borderWidth: 1, borderColor: "rgba(234,88,12,0.15)",
    alignItems: "center", justifyContent: "center", marginBottom: 2,
  },
  botAvatarSmall: {
    width: 26, height: 26, borderRadius: RADIUS.full,
    backgroundColor: COLORS.accentMuted,
    alignItems: "center", justifyContent: "center",
  },

  bubble: { maxWidth: "75%", borderRadius: RADIUS.lg, paddingHorizontal: SPACING.md, paddingVertical: 10 },
  userBubble: {
    backgroundColor: COLORS.accent,
    borderBottomRightRadius: RADIUS.xs,
    ...SHADOWS.accent,
  },
  botBubble: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 1, borderColor: COLORS.border,
    borderBottomLeftRadius: RADIUS.xs,
    ...SHADOWS.card,
  },
  bubbleText: { fontSize: 15, lineHeight: 22 },
  userText: { color: COLORS.white },
  botText:  { color: COLORS.text },
  timestamp: { fontSize: 10, color: "rgba(255,255,255,0.5)", alignSelf: "flex-end", marginTop: 4 },
  timestampUser: { color: "rgba(255,255,255,0.55)" },

  typingRow: { flexDirection: "row", alignItems: "flex-end", gap: 8, marginBottom: SPACING.sm, paddingLeft: SPACING.md },
  typingBubble: {
    flexDirection: "row", alignItems: "center", gap: 5,
    backgroundColor: COLORS.bgCard, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: RADIUS.lg, borderBottomLeftRadius: RADIUS.xs,
    paddingHorizontal: 16, paddingVertical: 14,
    ...SHADOWS.card,
  },
  typingDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.textSub },

  quickPrompts: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.sm },
  quickHeader: { flexDirection: "row", alignItems: "center", gap: 5, marginBottom: 8 },
  quickHeaderText: { fontSize: 11, fontWeight: "600", color: COLORS.textSub, letterSpacing: 0.3 },
  quickRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  quickChip: {
    backgroundColor: COLORS.bgCard, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: RADIUS.full, paddingHorizontal: 14, paddingVertical: 7,
    ...SHADOWS.card,
  },
  quickChipText: { color: COLORS.accent, fontSize: 13, fontWeight: "500" },

  inputBar: {
    flexDirection: "row", alignItems: "flex-end",
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, gap: 10,
    borderTopWidth: 1, borderTopColor: COLORS.border,
    backgroundColor: COLORS.bgCard,
  },
  input: {
    flex: 1, color: COLORS.text, fontSize: 15,
    backgroundColor: COLORS.bgInput, borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md, paddingVertical: 10,
    maxHeight: 100, borderWidth: 1, borderColor: COLORS.border,
  },
  sendBtn: {
    width: 42, height: 42, borderRadius: RADIUS.full,
    backgroundColor: COLORS.accent,
    alignItems: "center", justifyContent: "center",
    ...SHADOWS.accent,
  },
  sendBtnOff: { backgroundColor: COLORS.bgMuted, shadowOpacity: 0 },
});