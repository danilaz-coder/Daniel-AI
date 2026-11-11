import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../styles/colors';
import { common } from '../styles/common';

const METRICS = [
  { label: 'Клиентов', value: '112', icon: '♙', tint: '#e8f2ff' },
  { label: 'Отправлено КП', value: '45', icon: '▤', tint: '#e5f7f2' },
  { label: 'Конверсия', value: '12%', icon: '↗', tint: '#fff2e7' },
];

const WEEKLY_SALES = [
  { day: 'Пн', value: 42 },
  { day: 'Вт', value: 68 },
  { day: 'Ср', value: 52 },
  { day: 'Чт', value: 86 },
  { day: 'Пт', value: 61 },
  { day: 'Сб', value: 35 },
  { day: 'Вс', value: 74 },
];

export default function AnalyticsScreen({ onNavigate }) {
  return (
    <ScrollView contentContainerStyle={common.screenContent} showsVerticalScrollIndicator={false}>
      <View style={common.pageIntro}>
        <Text style={common.eyebrow}>ПОКАЗАТЕЛИ MAIN EVENT</Text>
        <Text style={common.pageTitle}>Аналитика</Text>
        <Text style={common.pageSubtitle}>Ключевые результаты вашей B2B-сети.</Text>
      </View>

      <View style={styles.metrics}>
        {METRICS.map((metric) => (
          <View key={metric.label} style={styles.metricCard}>
            <View style={[styles.metricIcon, { backgroundColor: metric.tint }]}>
              <Text style={styles.metricIconText}>{metric.icon}</Text>
            </View>
            <Text style={styles.metricValue}>{metric.value}</Text>
            <Text style={styles.metricLabel}>{metric.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.chartCard}>
        <View style={styles.chartHeading}>
          <View>
            <Text style={styles.chartTitle}>Продажи за неделю</Text>
            <Text style={styles.chartSubtitle}>Динамика активности</Text>
          </View>
          <View style={styles.periodBadge}>
            <Text style={styles.periodText}>7 дней</Text>
          </View>
        </View>
        <View style={styles.chart}>
          {WEEKLY_SALES.map((item, index) => (
            <View key={item.day} style={styles.barColumn}>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.bar,
                    { height: `${item.value}%` },
                    index === 3 && styles.barHighlight,
                  ]}
                />
              </View>
              <Text style={[styles.dayLabel, index === 3 && styles.dayLabelActive]}>{item.day}</Text>
            </View>
          ))}
        </View>
        <View style={styles.chartLegend}>
          <View style={styles.legendDot} />
          <Text style={styles.legendText}>Объём продаж</Text>
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={() => onNavigate('sync')}
        style={({ pressed }) => [styles.syncLink, pressed && styles.syncLinkPressed]}
      >
        <View style={styles.syncLinkIcon}><Text style={styles.syncLinkIconText}>⇧</Text></View>
        <View style={styles.syncLinkCopy}>
          <Text style={styles.syncLinkTitle}>Выгрузка данных</Text>
          <Text style={styles.syncLinkCaption}>Заявки, счета и отчёты</Text>
        </View>
        <Text style={styles.syncLinkArrow}>›</Text>
      </Pressable>
    </ScrollView>
  );
}

// СТИЛИ (их не хватало в твоем файле)
const styles = StyleSheet.create({
  metrics: { flexDirection: 'row', gap: 10, marginBottom: 20, marginTop: 10 },
  metricCard: { flex: 1, backgroundColor: '#fff', padding: 12, borderRadius: 16, borderWidth: 1, borderColor: '#e6edf5', alignItems: 'center' },
  metricIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  metricIconText: { fontSize: 16 },
  metricValue: { fontSize: 20, fontWeight: 'bold', color: '#102238' },
  metricLabel: { fontSize: 10, color: '#718198', textAlign: 'center', marginTop: 4 },
  chartCard: { backgroundColor: '#fff', padding: 16, borderRadius: 20, borderWidth: 1, borderColor: '#e6edf5', marginBottom: 20 },
  chartHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  chartTitle: { fontSize: 16, fontWeight: 'bold', color: '#102238' },
  chartSubtitle: { fontSize: 12, color: '#718198' },
  periodBadge: { backgroundColor: '#f0f4f8', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  periodText: { fontSize: 11, fontWeight: '600', color: '#718198' },
  chart: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 120, marginBottom: 10 },
  barColumn: { alignItems: 'center', flex: 1 },
  barTrack: { width: 12, height: 100, backgroundColor: '#f0f4f8', borderRadius: 6, justifyContent: 'flex-end', overflow: 'hidden' },
  bar: { width: '100%', backgroundColor: '#a0c4ff', borderRadius: 6 },
  barHighlight: { backgroundColor: '#0878f9' },
  dayLabel: { fontSize: 10, color: '#718198', marginTop: 6 },
  dayLabelActive: { color: '#0878f9', fontWeight: 'bold' },
  chartLegend: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#0878f9' },
  legendText: { fontSize: 11, color: '#718198' },
  syncLink: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#e6edf5', marginBottom: 20 },
  syncLinkPressed: { opacity: 0.7 },
  syncLinkIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#e8f2ff', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  syncLinkIconText: { fontSize: 20, color: '#0878f9', fontWeight: 'bold' },
  syncLinkCopy: { flex: 1 },
  syncLinkTitle: { fontSize: 15, fontWeight: 'bold', color: '#102238' },
  syncLinkCaption: { fontSize: 12, color: '#718198' },
  syncLinkArrow: { fontSize: 20, color: '#718198' },
});

