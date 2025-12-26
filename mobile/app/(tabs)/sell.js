import React, { useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { Text, Chip, Switch } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../src/hooks/useAuth';
import { apiPost } from '../../src/utils/api';
import InputField from '../../src/components/InputField';
import PrimaryButton from '../../src/components/PrimaryButton';
import ImageUploader from '../../src/components/ImageUploader';

const CONDITIONS = ['new', 'like_new', 'good', 'fair'];

export default function SellScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [condition, setCondition] = useState('good');
  const [price, setPrice] = useState('');
  const [isFree, setIsFree] = useState(false);
  const [allowSwap, setAllowSwap] = useState(false);
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  function ensureLoggedIn() {
    if (!user) {
      Alert.alert('Login required', 'Please log in to create a listing', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Login', onPress: () => navigation.navigate('Login') }
      ]);
      return false;
    }
    return true;
  }

  async function onSubmit() {
    if (!ensureLoggedIn()) return;

    if (!title.trim() || !desc.trim()) {
      Alert.alert('Error', 'Title and description are required');
      return;
    }
    if (desc.length > 200) {
      Alert.alert('Error', 'Description must be 200 characters or less');
      return;
    }
    if (!isFree && (price === '' || Number(price) < 0)) {
      Alert.alert('Error', 'Price must be a non-negative number');
      return;
    }

    const body = {
      title: title.trim(),
      condition,
      description: desc.trim(),
      priceType: isFree ? 'free' : 'sale',
      price: isFree ? 0 : Number(price),
      images,
      allowSwap
    };

    try {
      setSubmitting(true);
      await apiPost('/listings', body, user);
      Alert.alert('Success', 'Listing published');
      navigation.navigate('MyListings');
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setSubmitting(false);
    }
  }

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
        SELL A BOOK
      </Text>

      <InputField label="Title" value={title} onChangeText={setTitle} maxLength={80} />
      <InputField
        label="Description"
        value={desc}
        onChangeText={setDesc}
        maxLength={200}
        multiline
        numberOfLines={3}
      />

      <Text style={{ marginTop: 8, marginBottom: 4, fontFamily: 'Poppins_600SemiBold' }}>
        Condition
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 }}>
        {CONDITIONS.map((c) => (
          <Chip
            key={c}
            style={{ marginRight: 8, marginBottom: 8 }}
            selected={condition === c}
            onPress={() => setCondition(c)}
          >
            {c}
          </Chip>
        ))}
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: 8,
          justifyContent: 'space-between'
        }}
      >
        <View style={{ flex: 1, marginRight: 8 }}>
          <InputField
            label="Price"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            disabled={isFree}
          />
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={{ marginBottom: 4 }}>Mark as Free</Text>
          <Switch value={isFree} onValueChange={setIsFree} color="#10B981" />
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginVertical: 8
        }}
      >
        <Text>Allow Swap</Text>
        <Switch value={allowSwap} onValueChange={setAllowSwap} color="#4BA3FF" />
      </View>

      <ImageUploader value={images} onChange={setImages} />

      <PrimaryButton loading={submitting} onPress={onSubmit}>
        Publish Listing
      </PrimaryButton>
    </ScrollView>
  );
}
