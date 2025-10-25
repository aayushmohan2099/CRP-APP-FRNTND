// import React, { useState } from 'react';
// import { View, Text, TextInput, Button, Alert } from 'react-native';
// import { login } from '../auth';

// export default function LoginScreen({ navigation }) {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');

//   async function handleLogin() {
//     try {
//       const user = await login(username, password);
//       navigation.reset({
//         index: 0,
//         routes: [{ name: user.role === 'ADMIN' ? 'AdminDashboard' : 'CRPDashboard' }],
//       });
//     } catch (err) {
//       Alert.alert('Login Failed', 'Invalid credentials');
//     }
//   }

//   return (
//     <View style={{ padding: 20 }}>
//       <Text>Username</Text>
//       <TextInput value={username} onChangeText={setUsername} autoCapitalize="none" />
//       <Text>Password</Text>
//       <TextInput value={password} onChangeText={setPassword} secureTextEntry />
//       <Button title="Login" onPress={handleLogin} />
//     </View>
//   );
// }


import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';

// ✅ Paste your Web App URL here:
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwPylVWmyLrUdvmzkgvQiiOO4t2feGvf72TlcQ2_QSrdxbRqk_5P6KZ2QYE7bFo1lhw/exec';

const generateCaptcha = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let captcha = '';
  for (let i = 0; i < 6; i++) {
    captcha += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return captcha;
};

const LoginForm = ({ navigation }) => {
  const [userType, setUserType] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaText, setCaptchaText] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const refreshCaptcha = useCallback(() => {
    setCaptchaText(generateCaptcha());
  }, []);

  useEffect(() => {
    refreshCaptcha();
  }, [refreshCaptcha]);

  const resetForm = () => {
    setUserType('');
    setUsername('');
    setPassword('');
    setCaptchaInput('');
    refreshCaptcha();
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    if (!userType || !username || !password) {
      setError('Please fill all fields.');
      return;
    }

    if (captchaInput.toLowerCase() !== captchaText.toLowerCase()) {
      setError('Invalid Captcha. Please try again.');
      refreshCaptcha();
      setCaptchaInput('');
      return;
    }

    setLoading(true);

    try {
      const formData = {
        userType,
        username: btoa(username),
        password: btoa(password),
      };

      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess('✅ Login successful! Data saved.');
        resetForm();

        // Optional: Navigate after short delay
        setTimeout(() => {
          if (userType.toLowerCase() === 'admin') {
            navigation?.replace('AdminDashboard');
          } else {
            navigation?.replace('CRPDashboard');
          }
        }, 1500);
      } else {
        setError('Failed to save data.');
      }
    } catch (err) {
      console.error('Error submitting data:', err);
      setError('Network or server error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CRP-EP</Text>

      <Text style={styles.label}>User Type</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter user type (admin/user)"
        value={userType}
        onChangeText={setUserType}
        editable={!loading}
      />

      <Text style={styles.label}>User Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter username"
        value={username}
        onChangeText={setUsername}
        editable={!loading}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        editable={!loading}
      />

      <Text style={styles.label}>Captcha</Text>
      <View style={styles.captchaContainer}>
        <View style={styles.captchaBox}>
          <Text style={styles.captchaText}>{captchaText}</Text>
        </View>
        <TouchableOpacity onPress={refreshCaptcha} style={styles.refreshButton}>
          <Text style={{ color: '#16a34a', fontWeight: 'bold', fontSize: 18 }}>↻</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Enter captcha"
        value={captchaInput}
        onChangeText={setCaptchaInput}
        editable={!loading}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {success ? <Text style={styles.success}>{success}</Text> : null}

      <TouchableOpacity
        onPress={handleSubmit}
        disabled={loading}
        style={[styles.button, loading && { opacity: 0.6 }]}
      >
        {loading ? <ActivityIndicator color="#16a34a" /> : <Text style={styles.buttonText}>Log In</Text>}
      </TouchableOpacity>
    </View>
  );
};

export default LoginForm;

const styles = StyleSheet.create({
  container: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    alignSelf: 'center',
    marginTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ef4444',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#a7f3d0',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  captchaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  captchaBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
  },
  captchaText: {
    color: '#ef4444',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 4,
  },
  refreshButton: {
    marginLeft: 8,
    padding: 6,
  },
  button: {
    backgroundColor: '#dcfce7',
    borderWidth: 2,
    borderColor: '#bbf7d0',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#16a34a',
    fontWeight: '600',
  },
  error: {
    color: '#ef4444',
    fontSize: 12,
    marginBottom: 4,
  },
  success: {
    color: '#16a34a',
    fontSize: 12,
    marginBottom: 4,
  },
});
