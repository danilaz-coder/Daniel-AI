import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const EXPORT_ACTIONS = [
  {
    id: 'request',
    title: 'Отправить заявку в 1С',
    description: 'Передать данные заказа и создать новую заявку.',
    icon: 'file-text',
    buttonTitle: 'Отправить в 1С',
  },
  {
    id: 'invoice',
    title: 'Отправить счёт в Бухгалтерию',
    description: 'Подготовить счёт и передать его в бухгалтерию.',
    icon: 'dollar-sign',
    buttonTitle: 'Отправить счёт',
  },
  {
    id: 'report',
    title: 'Выгрузить отчёт по КП в Excel',
    description: 'Сформировать таблицу коммерческих предложений.',
    icon: 'grid',
    buttonTitle: 'Выгрузить отчёт',
  },
];

export default function SyncScreen() {
  const { colors } = useTheme();
  const [isSendingRequest, setIsSendingRequest] = useState(false);
  const requestTimer = useRef(null);

  useEffect(() => () => {
    if (requestTimer.current) clearTimeout(requestTimer.current);
  }, []);

  function sendRequestToOneC() {
    if (isSendingRequest) return;

    setIsSendingRequest(true);
    requestTimer.current = setTimeout(() => {
      requestTimer.current = null;
      setIsSendingRequest(false);
      Alert.alert('Готово', 'Заявка успешно отправлена в 1С. Номер заявки: 1024');
    }, 1000);
  }

  function showDemoNotice(title) {
    Alert.alert(title, 'Действие показано в деморежиме. Подключение к системе пока не настроено.');
  }

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: colors.canvas }}
    >
      <View style={styles.heading}>
        <Text style={[styles.eyebrow, { color: colors.blue }]}>ОБМЕН ДАННЫМИ</Text>
        <Text style={[styles.title, { color: colors.ink }]}>Выгрузка данных</Text>
        <Text style={[styles.subtitle, { color: colors.muted }]}>
          Отправляйте заявки и документы в рабочие системы.
        </Text>
      </View>

      <View style={styles.cards}>
        {EXPORT_ACTIONS.map((action) => {
          const isRequest = action.id === 'request';
          const busy = isRequest && isSendingRequest;

          return (
            <View
              key={action.id}
              style={[styles.card, { backgroundColor: colors.white, borderColor: colors.line }]}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.iconBox, { backgroundColor: colors.pale }]}>
                  <Feather name={action.icon} size={21} color={colors.blue} />
                </View>
                <View style={styles.cardCopy}>
                  <Text style={[styles.cardTitle, { color: colors.ink }]}>{action.title}</Text>
                  <Text style={[styles.cardDescription, { color: colors.muted }]}>{action.description}</Text>
                </View>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ disabled: busy }}
                disabled={busy}
                onPress={isRequest ? sendRequestToOneC : () => showDemoNotice(action.title)}
                style={({ pressed }) => [
                  styles.actionButton,
                  { backgroundColor: colors.blue },
                  pressed && !busy && styles.buttonPressed,
                  busy && styles.buttonBusy,
                ]}
              >
                {busy ? (
                  <ActivityIndicator size="small" color={colors.white} />
                ) : (
                  <Feather name={isRequest ? 'send' : action.icon} size={15} color={colors.white} />
                )}
                <Text style={styles.actionButtonText}>
                  {busy ? 'Отправляем…' : action.buttonTitle}
                </Text>
              </Pressable>
            </View>
          );
        })}
      </View>

      <View style={[styles.notice, { backgroundColor: colors.pale }]}>
        <Feather name="info" size={16} color={colors.blue} />
        <Text style={[styles.noticeText, { color: colors.muted }]}>
          Демо-режим: действия не отправляют реальные данные в 1С или бухгалтерию.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 18, paddingBottom: 30, gap: 16 },
  heading: { marginTop: 8, marginBottom: 2 },
  eyebrow: { fontSize: 9, fontWeight: '800', letterSpacing: 1.25 },
  title: { marginTop: 6, fontSize: 27, fontWeight: '800', letterSpacing: -0.6 },
  subtitle: { marginTop: 5, fontSize: 11, lineHeight: 16 },
  cards: { gap: 12 },
  card: { padding: 15, borderRadius: 18, borderWidth: 1 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 15 },
  iconBox: { width: 46, height: 46, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  cardCopy: { flex: 1 },
  cardTitle: { fontSize: 13, fontWeight: '800', lineHeight: 18 },
  cardDescription: { marginTop: 4, fontSize: 10, lineHeight: 15 },
  actionButton: { minHeight: 46, borderRadius: 13, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  buttonPressed: { opacity: 0.82 },
  buttonBusy: { opacity: 0.8 },
  actionButtonText: { color: '#ffffff', fontSize: 11, fontWeight: '800' },
  notice: { flexDirection: 'row', alignItems: 'flex-start', gap: 9, padding: 12, borderRadius: 13 },
  noticeText: { flex: 1, fontSize: 10, lineHeight: 15 },
});
