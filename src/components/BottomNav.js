import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../styles/colors';

const TABS = [
  { id: 'feed', icon: '◫', title: 'Поток' },
  { id: 'clients', icon: '♙', title: 'Клиенты' },
  { id: 'community', icon: '👥', title: 'Сообщество' },
  { id: 'analytics', icon: '▥', title: 'Аналитика' },
  { id: 'wheel', icon: '🎡', title: 'Рулетка' },
  { id: 'calculator', icon: '▤', title: 'Расчёт' },
  { id: 'modifier', icon: '⚗', title: 'Смесь' },
  { id: 'profile', icon: '◉', title: 'Профиль' },
];

export default function BottomNav({ activeTab, onSelect }) {
  return (
    <View style={styles.bottomNav}>
      {TABS.map((tab) => {
        const active = activeTab === tab.id;
        return (
          <Pressable accessibilityRole="tab" accessibilityState={{ selected: active }} key={tab.id} onPress={() => onSelect(tab.id)} style={styles.navItem}>
            <Text style={[styles.navIcon, active && styles.navActive]}>{tab.icon}</Text>
            <Text style={[styles.navText, active && styles.navActive]}>{tab.title}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: { minHeight: 65, paddingBottom: Platform.OS === 'ios' ? 2 : 5, paddingTop: 7, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: COLORS.line },
  navItem: { flex: 1, minWidth: 0, alignItems: 'center', gap: 3 },
  navIcon: { color: '#95a4b7', fontSize: 17, fontWeight: '700' },
  navText: { color: '#95a4b7', fontSize: 8, fontWeight: '600' },
  navActive: { color: COLORS.blue },
});
