import React, { useState } from 'react';
import { View, Text, Button, FlatList, TextInput } from 'react-native';
import api from '../api';

export default function RecordedBeneficiariesScreen({ navigation }) {
  const [districts, setDistricts] = useState([]);
  const [qBlock, setQBlock] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  async function fetchDistricts() {
    try {
      const resp = await api.get('dashboard/admin_summary/');
      setDistricts(resp.data);
    } catch (e) {
      console.warn(e);
    }
  }

  // initial fetch
  React.useEffect(() => { fetchDistricts(); }, []);

  return (
    <View style={{ flex: 1, padding: 12 }}>
      <Text>Recorded Beneficiaries — Admin/CRP view</Text>
      <FlatList
        data={districts}
        keyExtractor={(item) => String(item.district_id)}
        renderItem={({ item }) => (
          <View style={{ padding: 8 }}>
            <Text>{item.district_name} (Recorded: {item.recorded_count})</Text>
            <Button title="View" onPress={() => {
              // navigate into district drilldown - for now show PanchayatSelect so admin can search
              navigation.navigate('PanchayatSelect', { district_id: item.district_id });
            }} />
          </View>
        )}
      />
    </View>
  );
}
