import React from 'react';
import { View } from 'react-native';
import { Modal, Portal, Text, TextInput, Button } from 'react-native-paper';

export default function SwapOfferModal({
  visible,
  onDismiss,
  value,
  onChangeText,
  onSubmit,
  loading
}) {
  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={{
          marginHorizontal: 24,
          padding: 16,
          borderRadius: 12,
          backgroundColor: '#FFFFFF'
        }}
      >
        <Text
          style={{
            fontFamily: 'Poppins_600SemiBold',
            fontSize: 16,
            marginBottom: 8
          }}
        >
          Your swap offer
        </Text>
        <TextInput
          mode="outlined"
          multiline
          numberOfLines={3}
          value={value}
          onChangeText={onChangeText}
          placeholder="Describe what you will swap..."
          style={{ marginBottom: 12 }}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          <Button onPress={onDismiss} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button mode="contained" loading={loading} onPress={onSubmit}>
            Send
          </Button>
        </View>
      </Modal>
    </Portal>
  );
}
