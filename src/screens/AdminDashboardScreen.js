import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import api from '../api';
import { logout } from '../auth';

export default function AdminDashboardScreen({ navigation }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const resp = await api.get('dashboard/admin_summary/');
        setData(resp.data);
      } catch (e) {
        console.warn(e);
      }
    })();
  }, []);

  return (
    <View style={{ flex: 1, padding: 12 }}>
      <Text>Admin Dashboard (District summary)</Text>
      <Button title="View recorded beneficiaries" onPress={() => navigation.navigate('RecordedBeneficiaries')} />
      <Button title="Logout" onPress={async () => { await logout(); navigation.reset({ index: 0, routes: [{ name: 'Login' }] }); }} />
      <FlatList
        data={data}
        keyExtractor={(item) => String(item.district_id)}
        renderItem={({ item }) => (
          <View style={{ padding: 8 }}>
            <Text>{item.district_name} (Recorded: {item.recorded_count})</Text>
            {/* For admin: you can route into district drilling, but for now keep simple */}
          </View>
        )}
      />
    </View>
  );
}
