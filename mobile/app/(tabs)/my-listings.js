import React, { useEffect, useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { Text, Button, Chip, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../src/hooks/useAuth';
import { apiGet, apiPatch, apiDelete } from '../../src/utils/api';
import ListingCard from '../../src/components/ListingCard';

export default function MyListingsScreen() {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSold, setShowSold] = useState(false);

  useEffect(() => {
    if (user) loadListings();
  }, [user]);

  async function loadListings() {
    if (!user) return;
    try {
      setLoading(true);
      const all = await apiGet('/listings?sort=newest', user);
      const mine = all.filter((l) => l.ownerId === user.id || l.ownerId?._id === user.id);
      setListings(mine);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function ensureLoggedIn() {
    if (!user) {
      Alert.alert('Login required', 'Please log in to view your listings', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Login', onPress: () => navigation.navigate('Login') }
      ]);
      return false;
    }
    return true;
  }

  async function markSold(id) {
    if (!ensureLoggedIn()) return;
    try {
      await apiPatch(`/listings/${id}/status`, { status: 'sold' }, user);
      await loadListings();
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  }

  async function deleteListing(id) {
    if (!ensureLoggedIn()) return;
    Alert.alert('Delete', 'Delete this listing permanently?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await apiDelete(`/listings/${id}`, user);
            await loadListings();
          } catch (e) {
            Alert.alert('Error', e.message);
          }
        }
      }
    ]);
  }

  const available = listings.filter((l) => l.status === 'available');
  const sold = listings.filter((l) => l.status === 'sold');

  return (
    <ScrollView
      style={{ flex: 1, paddingHorizontal: 16, paddingTop: 40, backgroundColor: '#F9FAFB' }}
      contentContainerStyle={{ paddingBottom: 24 }}
    >
      <Text
        style={{
          fontFamily: 'Poppins_600SemiBold',
          fontSize: 20,
          textAlign: 'center',
          marginBottom: 12
        }}
      >
        MY LISTINGS
      </Text>

      {!user && (
        <Button mode="contained-tonal" onPress={() => navigation.navigate('Login')}>
          Login to view your listings
        </Button>
      )}

      {user && (
        <>
          <Text style={{ marginTop: 12, marginBottom: 8, fontFamily: 'Poppins_600SemiBold' }}>
            Available
          </Text>
          {available.map((l) => (
            <View key={l._id} style={{ marginBottom: 8 }}>
              <ListingCard
                item={l}
                onPress={() => navigation.navigate('ListingDetail', { id: l._id })}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 4,
                  paddingHorizontal: 4
                }}
              >
                <Button compact onPress={() => markSold(l._id)}>
                  Mark as Sold
                </Button>
                <Button
                  compact
                  textColor="#DC2626"
                  onPress={() => deleteListing(l._id)}
                >
                  Delete
                </Button>
              </View>
            </View>
          ))}

          <Divider style={{ marginVertical: 8 }} />

          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <Text style={{ fontFamily: 'Poppins_600SemiBold' }}>Sold</Text>
            <Chip selected={showSold} onPress={() => setShowSold((s) => !s)}>
              {showSold ? 'Hide' : 'Show'}
            </Chip>
          </View>

          {showSold &&
            sold.map((l) => (
              <View key={l._id} style={{ marginTop: 8 }}>
                <ListingCard
                  item={l}
                  onPress={() => navigation.navigate('ListingDetail', { id: l._id })}
                />
              </View>
            ))}
        </>
      )}
    </ScrollView>
  );
}
