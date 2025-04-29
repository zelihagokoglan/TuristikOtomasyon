import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import globalStyles from "../styles/globalStyles";

const ButtonComponent = ({ onPress, children }) => {
  return (
    <TouchableOpacity onPress={onPress} style={{ marginHorizontal: 5 }}>
      <View
        style={[
          globalStyles.button,
          {
            backgroundColor: "#000000", // Siyah renk
            borderColor: "#000000", // Siyah renk
            borderWidth: 1,
          },
        ]}
      >
        <Text style={[globalStyles.buttonText, { color: "#ffffff" }]}>
          {children}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ButtonComponent;
