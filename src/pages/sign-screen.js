import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Button, TextInput } from "react-native-paper";
import globalStyles from "../styles/globalStyles";
import { useAuth } from "../hooks/useAuth"; // doğru import

function SignScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignIn, setIsSignIn] = useState(true); // Varsayılan giriş ekranı

  const { signIn, signUp, isLoading, error } = useAuth(); // useAuth hook'unu kullan

  // Kullanıcı giriş ya da kayıt olduğunda çağrılacak fonksiyon
  const handleAuth = async () => {
    try {
      let result;
      if (isSignIn) {
        result = await signIn(email, password);
      } else {
        result = await signUp(email, password);
      }

      // API'den gelen başarı mesajını göster
      Alert.alert(
        "Başarılı",
        result.message || (isSignIn ? "Giriş başarılı" : "Kayıt başarılı")
      );

      // Başarılı girişten sonra token'ı sakla (örn. AsyncStorage)
      // await AsyncStorage.setItem("auth_token", result.token);
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
        onPress={handleAuth} // Burada handleAuth çağrılır
        loading={isLoading} // Buton yükleniyor durumu
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
