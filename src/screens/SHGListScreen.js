import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, TextInput } from 'react-native';
import api from '../api';

export default function SHGListScreen({ navigation, route }) {
  const { village_id } = route.params;
  const [shgs, setShgs] = useState([]);
  const [q, setQ] = useState('');

  useEffect(() => {
    fetchShgs();
  }, []);

  async function fetchShgs() {
    try {
      const resp = await api.get(`villages/${village_id}/shgs/`, { params: q ? { q } : {} });
      setShgs(resp.data.results || resp.data);
    } catch (e) {
      console.warn(e);
    }
  }

  return (
    <View style={{ flex:1, padding: 12 }}>
      <Text>SHGs in Village {village_id}</Text>
      <TextInput value={q} onChangeText={setQ} placeholder="Search SHG" />
      <Button title="Search" onPress={fetchShgs} />
      <FlatList
        data={shgs}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={{ padding: 8 }}>
            <Text>{item.shg_name || item.shg_code} (Recorded: {item.recorded_count || 0})</Text>
            <Button title="Fetch Beneficiaries" onPress={() => navigation.navigate('BeneficiaryList', { shg_id: item.id })} />
          </View>
        )}
      />
    </View>
  );
}
