import React, { useState } from 'react';
import { View, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { useAuth } from '../hooks/useAuth';
import { API_BASE_URL, BACKEND_BASE } from '../utils/config';

export default function ImageUploader({ value = [], onChange }) {
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();

  async function pickImage() {
    if (value.length >= 5) {
      Alert.alert('Limit reached', 'Maximum 5 images allowed');
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Permission to access photos is required');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: false,
        aspect: [4, 3]
      });

      if (result.canceled) return;

      const asset = result.assets[0];

      const manipulated = await ImageManipulator.manipulateAsync(
        asset.uri,
        [{ resize: { width: 1200 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );

      const formData = new FormData();
      formData.append('image', {
        uri: manipulated.uri,
        name: `image-${Date.now()}.jpg`,
        type: 'image/jpeg'
      });

      try {
        setUploading(true);
        const res = await fetch(`${API_BASE_URL}/uploads`, {
          method: 'POST',
          body: formData
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          throw new Error(data.message || 'Upload failed');
        }

        const fullImageUrl = data.url?.startsWith('http')
          ? data.url
          : `${BACKEND_BASE}${data.url}`;

        onChange([...value, fullImageUrl]);
      } catch (e) {
        Alert.alert('Upload failed', e.message || 'Upload failed');
      } finally {
        setUploading(false);
      }
    } catch (err) {
      Alert.alert('Gallery error', err?.message || 'Failed to open gallery');
    }
  }

  function removeAt(index) {
    const next = value.filter((_, i) => i !== index);
    onChange(next);
  }

  return (
    <View style={{ marginVertical: 8 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
        <Text variant="titleMedium">Images (max 5)</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {value.map((uri, idx) => (
          <View key={uri} style={{ marginRight: 8 }}>
            <Image
              source={{ uri }}
              style={{ width: 110, height: 75, borderRadius: 8, backgroundColor: '#E5E7EB' }}
            />
            <IconButton
              icon="close"
              size={16}
              style={{
                position: 'absolute',
                top: -8,
                right: -8,
                backgroundColor: '#111827',
                borderRadius: 12
              }}
              iconColor="#FFFFFF"
              onPress={() => removeAt(idx)}
            />
          </View>
        ))}
        {value.length < 5 && (
          <TouchableOpacity
            onPress={pickImage}
            style={{
              width: 110,
              height: 75,
              borderRadius: 8,
              borderWidth: 2,
              borderStyle: 'dashed',
              borderColor: '#9CA3AF',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#F9FAFB'
            }}
          >
            <Text style={{ color: '#6B7280', fontSize: 12 }}>
              {uploading ? 'Uploading...' : '+ Add'}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}
