import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../context/ThemeContext'; // Импортируем хук темы

export default function TopBar({ onNotificationsPress }) {
  // Получаем цвета и функцию переключения из контекста
  const { colors, isDark, toggleTheme } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <View style={styles.topBar}>
      <View style={styles.wordmark}>
        <View style={styles.logoMark}>
          <Text style={styles.logoMarkText}>M</Text>
        </View>
        <View>
          <Text style={styles.brandName}>MAIN EVENT</Text>
          <Text style={styles.brandCaption}>MAIN EVENT</Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {/* Кнопка уведомлений */}
        <Pressable accessibilityRole="button" onPress={onNotificationsPress} style={styles.notificationButton}>
          <Text style={styles.notificationIcon}>🔔</Text>
          <View style={styles.notificationDot} />
        </Pressable>

        {/* Кнопка переключения темы (солнце/луна) */}
        <Pressable accessibilityRole="button" onPress={toggleTheme} style={styles.themeButton}>
          <Text style={styles.themeIcon}>{isDark ? '☀️' : '🌙'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

// Делаем стили динамическими, зависящими от цвета (c)
const makeStyles = (c) => StyleSheet.create({
  topBar: { height: 62, backgroundColor: c.white, borderBottomWidth: 1, borderBottomColor: c.line, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  wordmark: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoMark: { width: 34, height: 34, borderRadius: 11, backgroundColor: c.blue, alignItems: 'center', justifyContent: 'center' },
  logoMarkText: { color: c.white, fontWeight: '900', fontSize: 17 },
  brandName: { color: c.ink, fontSize: 15, fontWeight: '800', letterSpacing: 0.2 },
  brandCaption: { color: c.muted, fontSize: 9, fontWeight: '700', letterSpacing: 1.3, marginTop: 2 },
  notificationButton: { width: 38, height: 38, borderRadius: 14, backgroundColor: c.canvas, alignItems: 'center', justifyContent: 'center' },
  notificationIcon: { color: c.ink, fontSize: 20 },
  notificationDot: { position: 'absolute', right: 7, top: 7, width: 7, height: 7, borderRadius: 4, backgroundColor: '#ff6b6b' },
  themeButton: { width: 38, height: 38, borderRadius: 14, backgroundColor: c.canvas, alignItems: 'center', justifyContent: 'center', marginLeft: 10 },
  themeIcon: { fontSize: 20 },
});
