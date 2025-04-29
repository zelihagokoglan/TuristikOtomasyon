import { StyleSheet } from "react-native";

const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#ffffff", // Beyaz
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    width: 300,
    alignItems: "center",
  },
  modalImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  noImageText: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#888",
    textAlign: "center",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalType: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "red",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  //-------------------
  button: {
    backgroundColor: "#000000", // Siyah
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#000000", // Siyah
    marginHorizontal: 10,
    width: 100,
    height: 40,
  },
  buttonGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff", // Beyaz
    fontSize: 16,
    fontWeight: "bold",
  },
  signButton: {
    height: 55,
    width: 300, // example width, adjust as needed
    justifyContent: "center",
    alignItems: "center",
  },
  toggleText: {
    fontSize: 16,
    color: "#000000", // Siyah
    marginTop: 20,
  },
  descriptionText: {
    fontSize: 16,
    color: "#000000", // Siyah
    paddingHorizontal: 22,
    alignSelf: "center",
    textAlign: "left",
  },
  sourceTimeText: {
    fontSize: 12,
    color: "#000000", // Siyah
    fontWeight: "bold",
    alignSelf: "center",
    textAlign: "left",
    paddingHorizontal: 22,
    paddingBottom: 6,
  },
  detailTitleText: {
    fontSize: 18,
    color: "#000000", // Siyah
    fontWeight: "bold",
    alignSelf: "center",
    textAlign: "center",
    paddingHorizontal: 22,
    paddingBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    color: "#ffffff", // Beyaz
    padding: 10,
  },
  cardText: {
    fontSize: 12,
    color: "#ffffff", // Beyaz
    marginBottom: 20,
  },
  onBtext: {
    fontSize: 16,
    color: "#000000", // Siyah
    textAlign: "center",
  },
  orText: {
    marginVertical: 15,
    fontSize: 16,
    color: "#000000", // Siyah
  },
  headerText: {
    fontSize: 30,
    fontWeight: "bold",
    marginVertical: 15,
    color: "#000000", // Siyah
  },
  input: {
    width: "100%",
    marginVertical: 10,
    backgroundColor: "#ffffff", // Beyaz
  },
  listContent: {
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  separator: {
    height: 30,
    width: 30,
    backgroundColor: "transparent",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: "#dcdee0", // Gri
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    color: "#000000", // Siyah
  },
  searchIcon: {
    marginLeft: 10,
  },
  pressed: {
    opacity: 0.5,
  },
});

export default globalStyles;
