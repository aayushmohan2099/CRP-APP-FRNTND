import React, { useEffect } from 'react';
import { View, Text } from 'react-native';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const t = setTimeout(() => {
      navigation.replace('Login');
    }, 900); // short splash
    return () => clearTimeout(t);
  }, [navigation]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>My App Logo</Text>
      <Text>Powered by TechnoHorizon's RN Engine</Text>
    </View>
  );
}
