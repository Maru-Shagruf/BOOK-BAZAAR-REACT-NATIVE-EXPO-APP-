import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import InputField from '../../src/components/InputField';
import PrimaryButton from '../../src/components/PrimaryButton';
import { apiPost } from '../../src/utils/api';
import { useAuth } from '../../src/hooks/useAuth';

export default function LoginScreen() {
  const navigation = useNavigation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    try {
      setLoading(true);
      const data = await apiPost('/auth/login', { email, password });
      await login({
        id: data.id,
        email: data.email,
        name: data.name,
        phone: data.phone,
        showPhoneTo: data.showPhoneTo
      });
      navigation.replace('MainTabs');
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 80, backgroundColor: '#F9FAFB' }}>
      <Text
        style={{
          fontFamily: 'Poppins_600SemiBold',
          fontSize: 22,
          textAlign: 'center',
          marginBottom: 16
        }}
      >
        Login
      </Text>

      <InputField label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
      <InputField
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <PrimaryButton loading={loading} onPress={onSubmit}>
        Login
      </PrimaryButton>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={{ marginTop: 16, textAlign: 'center', color: '#4BA3FF' }}>
          New here? Register
        </Text>
      </TouchableOpacity>
    </View>
  );
}
