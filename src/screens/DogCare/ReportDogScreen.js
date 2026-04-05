import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

import * as ImagePicker from "expo-image-picker";

import { COLORS, SPACING } from "../../theme";
import DogReportCard from "../../components/DogReportCard";

export default function ReportDogScreen() {
  const [issue, setIssue] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);
  const [reports, setReports] = useState([]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync();

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const submitReport = () => {
    const newReport = { issue, location, image };

    setReports([newReport, ...reports]);

    setIssue("");
    setLocation("");
    setImage(null);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Report Stray Dog</Text>

      <TextInput
        placeholder="Issue (injured/aggressive)"
        placeholderTextColor={COLORS.textSub}
        style={styles.input}
        value={issue}
        onChangeText={setIssue}
      />

      <TextInput
        placeholder="Location"
        placeholderTextColor={COLORS.textSub}
        style={styles.input}
        value={location}
        onChangeText={setLocation}
      />

      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Upload Photo</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.submit} onPress={submitReport}>
        <Text style={styles.buttonText}>Submit Report</Text>
      </TouchableOpacity>

      {reports.map((item, index) => (
        <DogReportCard key={index} report={item} />
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

  input: {
    backgroundColor: COLORS.bgInput,
    padding: SPACING.md,
    borderRadius: 10,
    marginBottom: SPACING.md,
    color: COLORS.text,
  },

  button: {
    backgroundColor: COLORS.accentMuted,
    padding: SPACING.md,
    borderRadius: 10,
    marginBottom: SPACING.md,
  },

  submit: {
    backgroundColor: COLORS.accent,
    padding: SPACING.md,
    borderRadius: 10,
    marginBottom: SPACING.lg,
  },

  buttonText: {
    color: COLORS.white,
    textAlign: "center",
  },
});
