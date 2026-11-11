import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../styles/colors';
import { common } from '../styles/common';

export default function SectionHeading({ title, action, onAction }) {
  return (
    <View style={styles.sectionHeading}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action ? <Pressable onPress={onAction}><Text style={common.link}>{action}</Text></Pressable> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeading: { marginBottom: 11, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { color: COLORS.ink, fontSize: 16, fontWeight: '800', letterSpacing: -0.2 },
});
