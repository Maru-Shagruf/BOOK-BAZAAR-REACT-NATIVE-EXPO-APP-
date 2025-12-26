import React, { useEffect, useState } from 'react';
import { View, FlatList, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../src/hooks/useAuth';
import { apiGet } from '../../src/utils/api';
import ListingCard from '../../src/components/ListingCard';

export default function FreeScreen() {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);

  async function loadListings() {
    try {
      setLoading(true);
      const data = await apiGet('/listings?priceType=free&status=available', user);
      setListings(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadListings();
  }, []);

  return (
    <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 40, backgroundColor: '#F9FAFB' }}>
      <Text
        style={{
          fontFamily: 'Poppins_600SemiBold',
          fontSize: 20,
          textAlign: 'center',
          marginBottom: 12,
          color: '#10B981'
        }}
      >
        FREE BOOKS
      </Text>

      <FlatList
        data={listings}
        keyExtractor={(item) => item._id}
        refreshing={loading}
        onRefresh={loadListings}
        renderItem={({ item }) => (
          <ListingCard
            item={item}
            onPress={() => navigation.navigate('ListingDetail', { id: item._id })}
          />
        )}
        ListEmptyComponent={
          !loading && (
            <View style={{ paddingTop: 40, alignItems: 'center' }}>
              <Text>No free listings yet.</Text>
            </View>
          )
        }
        contentContainerStyle={{ paddingBottom: 16 }}
      />
    </View>
  );
}
