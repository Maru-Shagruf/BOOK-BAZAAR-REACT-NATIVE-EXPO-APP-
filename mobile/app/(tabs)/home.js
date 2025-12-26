import React, { useEffect, useMemo, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity } from 'react-native';
import { Searchbar, Chip } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../src/hooks/useAuth';
import { apiGet } from '../../src/utils/api';
import { debounce } from '../../src/utils/debounce';
import ListingCard from '../../src/components/ListingCard';

const FILTERS = ['Buy', 'Free', 'Swap'];

export default function HomeScreen() {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [listings, setListings] = useState([]);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('Buy');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadListings();
  }, []);

  async function loadListings() {
    try {
      setLoading(true);
const data = await apiGet('/listings?status=available&sort=newest&_t=' + Date.now(), user);
      setListings(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const debouncedSetSearch = useMemo(
    () =>
      debounce((text) => {
        setSearch(text);
      }, 250),
    []
  );

  function onChangeSearch(text) {
    debouncedSetSearch(text);
  }

  const filtered = useMemo(() => {
    let result = [...listings];

    if (activeFilter === 'Free') {
      result = result.filter((l) => l.priceType === 'free' || l.price === 0);
    } else if (activeFilter === 'Swap') {
      result = result.filter((l) => l.allowSwap);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter((l) => {
        const target = `${l.title} ${l.description}`.toLowerCase();
        return target.includes(q);
      });
    }

    return result;
  }, [listings, search, activeFilter]);

  return (
    <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 40, backgroundColor: '#F9FAFB' }}>
      <Text
        style={{
          fontFamily: 'Poppins_600SemiBold',
          fontSize: 20,
          textAlign: 'center',
          marginBottom: 12
        }}
      >
        CAMPUS EXCHANGE
      </Text>

      <Searchbar
        placeholder="Search books, authors..."
        onChangeText={onChangeSearch}
        style={{ marginBottom: 8, borderRadius: 999 }}
      />

      <View style={{ flexDirection: 'row', marginBottom: 12 }}>
        {FILTERS.map((f) => (
          <Chip
            key={f}
            style={{ marginRight: 8 }}
            selected={activeFilter === f}
            onPress={() => setActiveFilter(f)}
          >
            {f}
          </Chip>
        ))}
      </View>

      <FlatList
        data={filtered}
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
              <Text>No listings yet.</Text>
            </View>
          )
        }
        contentContainerStyle={{ paddingBottom: 16 }}
      />
    </View>
  );
}
