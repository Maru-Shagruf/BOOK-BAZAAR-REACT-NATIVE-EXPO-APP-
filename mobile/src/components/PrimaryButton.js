import React from 'react';
import { Button } from 'react-native-paper';

export default function PrimaryButton({ children, style, ...props }) {
  return (
    <Button
      mode="contained"
      style={[{ borderRadius: 999, marginVertical: 6 }, style]}
      contentStyle={{ paddingVertical: 8 }}
      {...props}
    >
      {children}
    </Button>
  );
}
