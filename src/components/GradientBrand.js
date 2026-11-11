import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function GradientBrand({ children, style }) {
  return (
    <View style={[styles.brandPill, style]}>
      <Text style={styles.brandPillText}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  brandPill: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 9, backgroundColor: 'rgba(39,199,235,0.16)', borderWidth: 1, borderColor: 'rgba(39,199,235,0.28)' },
  brandPillText: { color: '#8ce7fb', fontSize: 9, fontWeight: '800', letterSpacing: 1.1 },
});
