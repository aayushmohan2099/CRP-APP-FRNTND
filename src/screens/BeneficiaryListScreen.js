import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, TextInput, Alert } from 'react-native';
import api from '../api';

export default function BeneficiaryListScreen({ navigation, route }) {
  const { shg_id } = route.params;
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [q, setQ] = useState('');
  const [showOnlyRecorded, setShowOnlyRecorded] = useState(false);

  useEffect(() => {
    fetchBeneficiaries();
  }, []);

  async function fetchBeneficiaries() {
    try {
      const params = {};
      if (showOnlyRecorded) params.recorded = 'true';
      if (q) params.q = q;
      const resp = await api.get(`shgs/${shg_id}/beneficiaries/`, { params });
      setBeneficiaries(resp.data.results || resp.data);
    } catch (e) {
      console.warn(e);
      Alert.alert('Error', 'Failed to fetch beneficiaries');
    }
  }

  return (
    <View style={{ flex: 1, padding: 12 }}>
      <Text>Beneficiaries in SHG {shg_id}</Text>
      <TextInput value={q} onChangeText={setQ} placeholder="Search beneficiary" />
      <Button title="Search" onPress={fetchBeneficiaries} />
      <Button title={showOnlyRecorded ? "Show All" : "Show Only Recorded"} onPress={() => { setShowOnlyRecorded(!showOnlyRecorded); setTimeout(fetchBeneficiaries, 100); }} />
      <FlatList
        data={beneficiaries}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={{ padding: 8 }}>
            <Text>{item.member_name || item.member_code} - {item.mobile_no}</Text>
            <Text>Recorded: {item.recorded ? 'Yes' : 'No'}</Text>
            <Button title={item.recorded ? "Edit / View" : "Record"} onPress={() => navigation.navigate('EnterpriseForm', { beneficiary_id: item.id })} />
          </View>
        )}
      />
    </View>
  );
}
