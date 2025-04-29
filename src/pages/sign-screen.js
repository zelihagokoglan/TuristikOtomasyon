import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Button, TextInput } from "react-native-paper";
import globalStyles from "../styles/globalStyles";

function SignScreen() {
  // States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignIn, setIsSignIn] = useState(false);

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.headerText}>
        {isSignIn ? "Sign In" : "Sign Up"}
      </Text>

      <Text style={globalStyles.orText}>with</Text>

      <Button
        style={globalStyles.signButton}
        textColor="#000000" // Siyah renk
        icon="google"
        mode="outlined"
        onPress={() => {}}
      >
        Google
      </Button>

      <Text style={globalStyles.orText}>or</Text>

      <TextInput
        style={globalStyles.input}
        label="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={[globalStyles.input, { marginBottom: 30 }]}
        label="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
      />

      <Button
        style={globalStyles.signButton}
        textColor="#FFFFFF" // Beyaz renk
        mode="outlined"
        buttonColor="#000000" // Siyah arka plan
        onPress={() => {}}
      >
        {isSignIn ? "Sign In" : "Sign Up"}
      </Button>

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
