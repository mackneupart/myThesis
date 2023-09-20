import {
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
  Text,
  Modal,
} from "react-native";
import { useState } from "react";
import CustomButton from "./customButton";
import AddStory from "./AddStory";

export default function PopUpAdd() {
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const openPopup = () => {
    setIsPopupVisible(true);
  };

  const closePopup = () => {
    setIsPopupVisible(false);
  };
  return (
    <View>
      <TouchableOpacity onPress={openPopup} style={styles.imagecontainer}>
        <Image
          source={require("../assets/icons/plus.png")}
          resizeMode="contain"
          style={styles.image}
        />
      </TouchableOpacity>
      <Modal
        visible={isPopupVisible}
        animationType="slide"
        style={styles.modal}>
        <View style={styles.modalContent}>
          <AddStory />
          <TouchableOpacity onPress={closePopup} style={styles.closeButton}>
            <Text>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  modalContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  imagecontainer: {
    top: -30,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 60,
    height: 60,
    tintColor: "#8F5AFF",
  },
  closeButton: {
    position: "absolute",
    top: 50,
    right: 30,
  },
});
