import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert, ScrollView } from 'react-native';
import api from '../api';

export default function EnterpriseFormScreen({ navigation, route }) {
  const { beneficiary_id } = route.params;
  const [loading, setLoading] = useState(true);
  const [enterprise, setEnterprise] = useState(null);

  // very basic fields for demo
  const [enterprise_name, setEnterpriseName] = useState('');
  const [type_of_enterprise, setTypeOfEnterprise] = useState('');
  const [ownership_type, setOwnershipType] = useState('');

  useEffect(() => {
    (async () => {
      try {
        // try fetch existing enterprise
        const resp = await api.get('enterprise/by_beneficiary/', { params: { beneficiary_id } });
        setEnterprise(resp.data);
        setEnterpriseName(resp.data.enterprise_name || '');
        setTypeOfEnterprise(resp.data.type_of_enterprise || '');
        setOwnershipType(resp.data.ownership_type || '');
      } catch (e) {
        // 404 = not found (no enterprise yet) - that's OK
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function submit() {
    try {
      const payload = {
        beneficiary: beneficiary_id,
        enterprise_name,
        type_of_enterprise,
        ownership_type,
      };

      if (enterprise && enterprise.id) {
        // update
        await api.put(`enterprise/${enterprise.id}/`, payload);
        Alert.alert('Success', 'Updated successfully');
      } else {
        // create
        await api.post('enterprise/', payload);
        Alert.alert('Success', 'Recorded successfully!');
      }
      navigation.goBack(); // return to beneficiary list
    } catch (err) {
      console.warn(err);
      Alert.alert('Error', err.response?.data ? JSON.stringify(err.response.data) : err.message);
    }
  }

  if (loading) return <View><Text>Loading...</Text></View>;

  return (
    <ScrollView style={{ padding: 12 }}>
      <Text>Enterprise for beneficiary {beneficiary_id}</Text>
      <Text>Enterprise Name</Text>
      <TextInput value={enterprise_name} onChangeText={setEnterpriseName} />
      <Text>Type of Enterprise</Text>
      <TextInput value={type_of_enterprise} onChangeText={setTypeOfEnterprise} />
      <Text>Ownership Type</Text>
      <TextInput value={ownership_type} onChangeText={setOwnershipType} />
      <Button title={enterprise ? "Update" : "Submit"} onPress={submit} />
      {enterprise ? <Button title="Delete" onPress={async () => {
        try {
          await api.delete(`enterprise/${enterprise.id}/`);
          Alert.alert('Deleted');
          navigation.goBack();
        } catch (e) {
          console.warn(e);
        }
      }} /> : null}
    </ScrollView>
  );
}
