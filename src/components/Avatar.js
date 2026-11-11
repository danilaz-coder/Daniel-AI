import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../styles/colors';

export default function Avatar({ name, color, online, size = 44 }) {
  const initials = name.split(' ').slice(0, 2).map((part) => part[0]).join('');
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2, backgroundColor: color || COLORS.pale }]}>
      <Text style={[styles.avatarText, { fontSize: size * 0.31 }]}>{initials}</Text>
      {online ? <View style={[styles.onlineDot, { width: size * 0.23, height: size * 0.23, borderRadius: size * 0.12 }]} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: { alignItems: 'center', justifyContent: 'center', position: 'relative' },
  avatarText: { color: '#26415e', fontWeight: '800' },
  onlineDot: { position: 'absolute', right: -1, bottom: 0, backgroundColor: COLORS.green, borderWidth: 2, borderColor: COLORS.white },
});
