import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import InputField from '../../src/components/InputField';
import PrimaryButton from '../../src/components/PrimaryButton';
import { apiPost } from '../../src/utils/api';
import { useAuth } from '../../src/hooks/useAuth';

export default function RegisterScreen() {
  const navigation = useNavigation();
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    try {
      setLoading(true);
      const data = await apiPost('/auth/register', { email, password, name });
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
        Register
      </Text>

      <InputField label="Name (optional)" value={name} onChangeText={setName} />
      <InputField label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
      <InputField
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <PrimaryButton loading={loading} onPress={onSubmit}>
        Create Account
      </PrimaryButton>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={{ marginTop: 16, textAlign: 'center', color: '#4BA3FF' }}>
          Already have an account? Login
        </Text>
      </TouchableOpacity>
    </View>
  );
}
