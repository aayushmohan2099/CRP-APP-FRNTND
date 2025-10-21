import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import CRPDashboardScreen from '../screens/CRPDashboardScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import PanchayatSelectScreen from '../screens/PanchayatSelectScreen';
import VillageListScreen from '../screens/VillageListScreen';
import SHGListScreen from '../screens/SHGListScreen';
import BeneficiaryListScreen from '../screens/BeneficiaryListScreen';
import EnterpriseFormScreen from '../screens/EnterpriseFormScreen';
import RecordedBeneficiariesScreen from '../screens/RecordedBeneficiariesScreen';
import { getCurrentUser } from '../auth';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const [initialRoute, setInitialRoute] = useState('Splash');

  useEffect(() => {
    (async () => {
      const user = await getCurrentUser();
      setInitialRoute(user ? (user.role === 'ADMIN' ? 'AdminDashboard' : 'CRPDashboard') : 'Login');
    })();
  }, []);

  return (
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
      <Stack.Screen name="CRPDashboard" component={CRPDashboardScreen} />
      <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
      <Stack.Screen name="PanchayatSelect" component={PanchayatSelectScreen} />
      <Stack.Screen name="VillageList" component={VillageListScreen} />
      <Stack.Screen name="SHGList" component={SHGListScreen} />
      <Stack.Screen name="BeneficiaryList" component={BeneficiaryListScreen} />
      <Stack.Screen name="EnterpriseForm" component={EnterpriseFormScreen} />
      <Stack.Screen name="RecordedBeneficiaries" component={RecordedBeneficiariesScreen} />
    </Stack.Navigator>
  );
}
