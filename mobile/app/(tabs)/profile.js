import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { Avatar, Text, Button, RadioButton } from 'react-native-paper';
import { useAuth } from '../../src/hooks/useAuth';
import { apiPatch } from '../../src/utils/api';
import InputField from '../../src/components/InputField';
import { useNavigation } from '@react-navigation/native';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const navigation = useNavigation();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [showPhoneTo, setShowPhoneTo] = useState(user?.showPhoneTo || 'logged_in');
  const [saving, setSaving] = useState(false);

  async function saveProfile() {
    if (!user) {
      navigation.navigate('Login');
      return;
    }
    try {
      setSaving(true);
      const updated = await apiPatch(`/users/${user.id}`, { name, phone, showPhoneTo }, user);
      await logout(); // simple: force re-login to refresh local user
      Alert.alert('Saved', 'Profile updated. Please log in again.');
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setSaving(false);
    }
  }

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
        PROFILE
      </Text>

      {!user ? (
        <Button mode="contained" onPress={() => navigation.navigate('Login')}>
          Login
        </Button>
      ) : (
        <>
          <View style={{ alignItems: 'center', marginBottom: 16 }}>
            <Avatar.Text
              size={64}
              label={(user.name || user.email || '?')[0].toUpperCase()}
              style={{ backgroundColor: '#4BA3FF' }}
            />
            <Text style={{ marginTop: 8 }}>{user.email}</Text>
          </View>

          <InputField label="Name" value={name} onChangeText={setName} />
          <InputField
            label="Phone"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <Text style={{ marginTop: 12, marginBottom: 4 }}>Show phone to</Text>
          <RadioButton.Group
            onValueChange={(v) => setShowPhoneTo(v)}
            value={showPhoneTo}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <RadioButton value="public" />
              <Text>Public</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <RadioButton value="logged_in" />
              <Text>Logged in users</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <RadioButton value="hidden" />
              <Text>Hidden</Text>
            </View>
          </RadioButton.Group>

          <Button mode="contained" loading={saving} style={{ marginTop: 16 }} onPress={saveProfile}>
            Save Profile
          </Button>

          <Button mode="text" style={{ marginTop: 8 }} onPress={logout}>
            Logout
          </Button>
        </>
      )}
    </View>
  );
}
