import { useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";

function Navigation() {
  const [selectedGender, setSelectedGender] = useState("性别");
  const [selectedAge, setSelectedAge] = useState("年龄");
  const [modalVisible, setModalVisible] = useState(false);
  const [currentFilter, setCurrentFilter] = useState<"age" | "gender" | undefined>(undefined);

  const genderOptions = ["男", "女"];
  const ageOptions = ["18-25", "26-35", "36-45", "46+"];

  const openFilter = (filter: "age" | "gender") => {
    setCurrentFilter(filter);
    setModalVisible(true);
  };

  const handleSelect = (value: string) => {
    if (currentFilter === "gender") setSelectedGender(value);
    if (currentFilter === "age") setSelectedAge(value);
    setModalVisible(false);
  };

  const getOptions = () =>
    currentFilter === "gender" ? genderOptions : ageOptions;

  return (
    <View style={styles.container}>
      {/* 筛选按钮 */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          onPress={() => { openFilter("gender"); }}
          style={styles.filterButton}
        >
          <Text style={styles.filterText}>{selectedGender}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => { openFilter("age"); }}
          style={styles.filterButton}
        >
          <Text style={styles.filterText}>{selectedAge}</Text>
        </TouchableOpacity>
      </View>

      {/* Modal */}
      <Modal
        animationType="slide"
        onRequestClose={() => { setModalVisible(false); }}
        transparent
        visible={modalVisible}
      >
        <TouchableWithoutFeedback onPress={() => { setModalVisible(false); }}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <FlatList
                data={getOptions()}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => { handleSelect(item); }}
                    style={styles.optionItem}
                  >
                    <Text style={styles.optionText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

export default Navigation;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#fff",
    flex: 1,
    paddingTop: 100
  },
  filterButton: {
    backgroundColor: "#2196F3",
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10
  },
  filterRow: {
    flexDirection: "row",
    gap: 20
  },
  filterText: {
    color: "#fff",
    fontWeight: "bold"
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 20,
    width: 250
  },
  modalOverlay: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    flex: 1,
    justifyContent: "center",
    marginTop: 100
  },
  optionItem: {
    alignItems: "center",
    padding: 15,
  },
  optionText: {
    fontSize: 16
  }
});