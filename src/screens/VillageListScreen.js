import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, TextInput } from 'react-native';
import api from '../api';

export default function VillageListScreen({ navigation, route }) {
  const { panchayat_id } = route.params;
  const [villages, setVillages] = useState([]);
  const [q, setQ] = useState('');

  useEffect(() => {
    fetchVillages();
  }, []);

  async function fetchVillages() {
    try {
      const resp = await api.get(`panchayats/${panchayat_id}/villages/`, { params: q ? { q } : {} });
      setVillages(resp.data.results || resp.data);
    } catch (e) {
      console.warn(e);
    }
  }

  return (
    <View style={{ flex: 1, padding: 12 }}>
      <Text>Villages in Panchayat {panchayat_id}</Text>
      <TextInput value={q} onChangeText={setQ} placeholder="Search village" />
      <Button title="Search" onPress={fetchVillages} />
      <FlatList
        data={villages}
        keyExtractor={(item) => String(item.village_id)}
        renderItem={({ item }) => (
          <View style={{ padding: 8 }}>
            <Text>{item.village_name_english} (Recorded: {item.recorded_count || 0})</Text>
            <Button title="Fetch SHGs" onPress={() => navigation.navigate('SHGList', { village_id: item.village_id })} />
          </View>
        )}
      />
    </View>
  );
}
