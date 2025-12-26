import React, { useEffect, useState } from 'react';
import { View, ScrollView, Image, Alert, Linking } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useAuth } from '../../src/hooks/useAuth';
import { apiGet, apiPost } from '../../src/utils/api';

const BACKEND_BASE = 'http://10.34.214.244:4000';

export default function ListingDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { user } = useAuth();
  const { id } = route.params;
  const [listing, setListing] = useState(null);
  const [revealedPhone, setRevealedPhone] = useState(null);

  useEffect(() => {
    load();
  }, [id]);

  async function load() {
    try {
      const data = await apiGet(`/listings/${id}`, user);
      setListing(data);
      if (data.owner?.phoneFull) {
        setRevealedPhone(data.owner.phoneFull);
      }
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  }

  function ensureLoggedIn() {
    if (!user) {
      Alert.alert('Login required', 'Please log in to contact seller', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Login', onPress: () => navigation.navigate('Login') }
      ]);
      return false;
    }
    return true;
  }

  function handleRevealPhone() {
    if (!ensureLoggedIn()) return;
    if (listing?.owner?.phoneFull) {
      setRevealedPhone(listing.owner.phoneFull);
    } else if (listing?.owner?.phoneMasked) {
      Alert.alert(
        'Phone not available',
        'Seller phone is hidden or not set in their profile.'
      );
    }
  }

  async function handleSwap() {
    if (!ensureLoggedIn()) return;
    if (!listing.allowSwap) {
      Alert.alert('Not allowed', 'This listing does not accept swap offers.');
      return;
    }

    // Simple Android-friendly flow: just send a fixed message for now
    try {
      await apiPost(
        `/listings/${listing._id}/swap-offers`,
        { offeredDescription: 'Interested in swapping this book.' },
        user
      );
      Alert.alert('Sent', 'Swap offer sent to seller');
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  }

  if (!listing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const isFree = listing.priceType === 'free' || listing.price === 0;
  const isOwner = user && listing.ownerId && user.id === listing.ownerId;

  const rawImage = listing.images?.[0];
  const imageUrl =
    rawImage && rawImage.startsWith('http')
      ? rawImage
      : rawImage
      ? `${BACKEND_BASE}${rawImage}`
      : null;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#F9FAFB' }}
      contentContainerStyle={{ paddingBottom: 24 }}
    >
      {imageUrl && (
        <Image
          source={{ uri: imageUrl }}
          style={{
            width: '100%',
            height: 320,
            backgroundColor: '#E5E7EB'
          }}
          resizeMode="contain"
        />
      )}

      <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
        <Text
          style={{
            fontFamily: 'Poppins_600SemiBold',
            fontSize: 18,
            marginBottom: 4
          }}
        >
          {listing.title}
        </Text>
        <Text
          style={{
            fontFamily: 'Poppins_600SemiBold',
            color: isFree ? '#10B981' : '#111827',
            marginBottom: 6
          }}
        >
          {isFree ? 'FREE' : `₹${listing.price}`}
        </Text>
        <Text style={{ marginBottom: 8, color: '#4B5563' }}>{listing.condition}</Text>
        <Text style={{ marginBottom: 16 }}>{listing.description}</Text>

        <Text style={{ marginBottom: 4, fontFamily: 'Poppins_600SemiBold' }}>
          Seller
        </Text>
        <Text style={{ marginBottom: 8 }}>{listing.owner?.name || 'Unknown'}</Text>

        <Button
          mode="contained"
          style={{ marginBottom: 8 }}
          onPress={handleRevealPhone}
        >
          {revealedPhone ? `Call ${revealedPhone}` : 'Contact Seller'}
        </Button>

        {revealedPhone && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 8
            }}
          >
            <Button
              mode="outlined"
              onPress={() => Linking.openURL(`tel:${revealedPhone}`)}
            >
              Call
            </Button>
            <Button
              mode="outlined"
              onPress={() => Alert.alert('Copied', 'Number copied (simulate)')}
            >
              Copy
            </Button>
          </View>
        )}

        <Button mode="text" onPress={handleSwap}>
          Offer a swap instead?
        </Button>
        {isOwner && listing.swapNotes && (
  <View style={{ marginTop: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#E5E7EB' }}>
    <Text
      style={{
        fontFamily: 'Poppins_600SemiBold',
        marginBottom: 4
      }}
    >
      Swap offers
    </Text>
    <Text style={{ color: '#4B5563', whiteSpace: 'pre-line' }}>
      {listing.swapNotes}
    </Text>
  </View>
)}

      </View>
    </ScrollView>
  );
}
