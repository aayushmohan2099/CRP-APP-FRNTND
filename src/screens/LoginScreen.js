import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { login } from '../auth';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin() {
    try {
      const user = await login(username, password);
      navigation.reset({
        index: 0,
        routes: [{ name: user.role === 'ADMIN' ? 'AdminDashboard' : 'CRPDashboard' }],
      });
    } catch (err) {
      Alert.alert('Login Failed', 'Invalid credentials');
    }
  }

  return (
    <View style={{ padding: 20 }}>
      <Text>Username</Text>
      <TextInput value={username} onChangeText={setUsername} autoCapitalize="none" />
      <Text>Password</Text>
      <TextInput value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}
