import React from 'react';
import { TouchableOpacity, Image, View, Text } from 'react-native';
import { Chip } from 'react-native-paper';
import { BACKEND_BASE } from '../utils/config';

export default function ListingCard({ item, onPress }) {
  const isFree = item.priceType === 'free' || item.price === 0;

  const raw = item.images?.[0];
  const imageUrl = raw
    ? raw.startsWith('http')
      ? raw
      : `${BACKEND_BASE}${raw}`
    : null;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginBottom: 12,
        overflow: 'hidden',
        elevation: 2
      }}
    >
      {imageUrl && (
        <Image
          source={{ uri: imageUrl }}
          style={{
            width: '100%',
            height: 180,
            backgroundColor: '#E5E7EB'
          }}
          resizeMode="contain"
        />
      )}
      <View style={{ padding: 10 }}>
        <Text
          style={{
            fontFamily: 'Poppins_600SemiBold',
            fontSize: 14,
            color: '#111827'
          }}
          numberOfLines={2}
        >
          {item.title}
        </Text>
        <View
          style={{
            marginTop: 6,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Text
            style={{
              fontFamily: 'Poppins_600SemiBold',
              color: isFree ? '#10B981' : '#111827'
            }}
          >
            {isFree ? 'FREE' : `₹${item.price}`}
          </Text>
          <Chip compact>{item.condition}</Chip>
        </View>
      </View>
    </TouchableOpacity>
  );
}
