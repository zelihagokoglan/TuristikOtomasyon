import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Button, TextInput } from "react-native-paper";
import globalStyles from "../styles/globalStyles";
import { useAuth } from "../hooks/useAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";

function SignScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignIn, setIsSignIn] = useState(true);
  const { signIn, signUp, isLoading, error } = useAuth();

  const handleAuth = async () => {
    if (password.length < 8) {
      Alert.alert("Hata", "Şifre en az 8 karakter olmalıdır.");
      return;
    }

    try {
      let result;
      if (isSignIn) {
        result = await signIn(email, password);
      } else {
        result = await signUp(email, password);
      }

      console.log("Backend sonucu:", result);

      const userId = result?.user?.id || result?.id || result?.userId;
      if (userId) {
        await AsyncStorage.setItem("user_id", userId.toString());
      } else {
        console.warn("Kullanıcı ID alınamadı, saklanmadı.");
      }

      Alert.alert(
        "Başarılı",
        result.message || (isSignIn ? "Giriş başarılı" : "Kayıt başarılı")
      );

      navigation.replace("Map");
    } catch (error) {
      Alert.alert("Hata", error.message);
    }
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.headerText}>
        {isSignIn ? "Sign In" : "Sign Up"}
      </Text>

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={globalStyles.input}
        autoCapitalize="none"
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        style={globalStyles.input}
        secureTextEntry
      />

      <Button
        style={globalStyles.signButton}
        mode="contained"
        onPress={handleAuth}
        loading={isLoading}
      >
        {isSignIn ? "Sign In" : "Sign Up"}
      </Button>

      {error && <Text style={{ color: "red" }}>{error}</Text>}

      <TouchableOpacity onPress={() => setIsSignIn(!isSignIn)}>
        <Text style={globalStyles.toggleText}>
          {isSignIn
            ? "Don't have an account? Sign Up"
            : "Already have an account? Sign In"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default SignScreen;
