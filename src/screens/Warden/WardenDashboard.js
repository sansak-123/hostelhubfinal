import React from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet
} from "react-native";

import { getComplaints, resolveComplaint } from "../../services/api";

export default function WardenDashboard() {

  const complaints = getComplaints();

  return (

    <FlatList
      data={complaints}
      keyExtractor={(item) => item.id}

      renderItem={({ item }) => (

        <View style={styles.card}>

          <Text>Type: {item.type}</Text>
          <Text>Description: {item.description}</Text>
          <Text>Priority: {item.priority}</Text>
          <Text>Status: {item.status}</Text>

          {item.status !== "resolved" && (

            <Button
              title="Mark Resolved"
              onPress={() => resolveComplaint(item.id)}
            />

          )}

        </View>

      )}
    />

  );

}

const styles = StyleSheet.create({

  card: {
    padding: 15,
    borderBottomWidth: 1
  }

});