import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import api from '../api';
import { logout, getCurrentUser } from '../auth';

export default function CRPDashboardScreen({ navigation }) {
  const [data, setData] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      setUser(await getCurrentUser());
      try {
        const resp = await api.get('dashboard/crp/');
        setData(resp.data);
      } catch (e) {
        console.warn(e);
      }
    })();
  }, []);

  return (
    <View style={{ flex: 1, padding: 12 }}>
      <Text>CRP Dashboard</Text>
      <Button title="Record new Beneficiary Enterprise" onPress={() => navigation.navigate('PanchayatSelect')} />
      <Button title="View recorded beneficiaries" onPress={() => navigation.navigate('RecordedBeneficiaries')} />
      <Button title="Logout" onPress={async () => { await logout(); navigation.reset({ index: 0, routes: [{ name: 'Login' }] }); }} />
      <FlatList
        data={data}
        keyExtractor={(item) => String(item.panchayat_id)}
        renderItem={({ item }) => (
          <View style={{ padding: 8 }}>
            <Text>{item.panchayat_name} (Recorded: {item.recorded_count})</Text>
            <Button title="Open" onPress={() => navigation.navigate('PanchayatSelect', { defaultPanchayat: item.panchayat_id })} />
          </View>
        )}
      />
    </View>
  );
}
