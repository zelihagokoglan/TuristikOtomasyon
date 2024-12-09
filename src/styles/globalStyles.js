import { StyleSheet } from "react-native";

const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  customMarker: {
    backgroundColor: "blue",
    padding: 8,
    borderRadius: 10,
    borderColor: "white",
    borderWidth: 2,
  },
});

export default globalStyles;
