import React from 'react';
import { TextInput } from 'react-native-paper';

export default function InputField({ label, ...props }) {
  return (
    <TextInput
      mode="outlined"
      label={label}
      style={{ marginVertical: 6 }}
      outlineColor="#E5E7EB"
      activeOutlineColor="#4BA3FF"
      {...props}
    />
  );
}
