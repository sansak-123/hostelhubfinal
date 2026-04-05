import React from "react";
import { ScrollView, Text, StyleSheet } from "react-native";

import { FEEDING_SCHEDULE } from "../../data/FeedingSchedule";
import FeedCard from "../../components/FeedCard";
import { COLORS, SPACING } from "../../theme";

export default function FeedingScheduleScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Feeding Schedule</Text>

      {FEEDING_SCHEDULE.map((item) => (
        <FeedCard key={item.id} location={item.location} time={item.time} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    padding: SPACING.lg,
  },

  title: {
    color: COLORS.text,
    fontSize: 22,
    marginBottom: SPACING.md,
  },
});
