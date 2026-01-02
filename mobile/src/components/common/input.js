import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

const Input = ({
  label,
  value,
  onChangeText,
  error,
  secureTextEntry,
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputContainer, error && styles.inputError]}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          autoCorrect={false}
          autoComplete="off"
          {...props}
        />
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            <Text style={styles.eyeText}>
              {isPasswordVisible ? "👁️" : "👁️‍🗨️"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 12 },
  label: { fontSize: 14, fontWeight: "500", marginBottom: 4 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 50, // Fixed height prevents layout jumps
  },
  input: { flex: 1, height: "100%", fontSize: 16 },
  inputError: { borderColor: "red" },
  errorText: { color: "red", fontSize: 12, marginTop: 2 },
  eyeText: { fontSize: 18 },
});

export default Input;
