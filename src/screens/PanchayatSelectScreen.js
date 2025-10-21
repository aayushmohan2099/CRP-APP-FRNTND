import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, TextInput } from 'react-native';
import api from '../api';

export default function PanchayatSelectScreen({ navigation, route }) {
  const defaultPanchayat = route.params?.defaultPanchayat;
  const [panchayats, setPanchayats] = useState([]);
  const [q, setQ] = useState('');

  useEffect(() => {
    fetchList();
  }, []);

  async function fetchList(page=1) {
    try {
      const resp = await api.get('panchayats/assigned/', { params: q ? { q, page } : { page } });
      setPanchayats(resp.data.results || resp.data);
    } catch (e) {
      console.warn(e);
    }
  }

  return (
    <View style={{ flex: 1, padding: 12 }}>
      <Text>Select Gram Panchayat</Text>
      <TextInput value={q} onChangeText={setQ} placeholder="Search GP" />
      <Button title="Search" onPress={() => fetchList(1)} />
      <FlatList
        data={panchayats}
        keyExtractor={(item) => String(item.panchayat_id)}
        renderItem={({ item }) => (
          <View style={{ padding: 8 }}>
            <Text>{item.panchayat_name_en}</Text>
            <Button title="Open Villages" onPress={() => navigation.navigate('VillageList', { panchayat_id: item.panchayat_id })} />
          </View>
        )}
      />
      {defaultPanchayat ? <Button title="Open default panchayat" onPress={() => navigation.navigate('VillageList', { panchayat_id: defaultPanchayat })} /> : null}
    </View>
  );
}
