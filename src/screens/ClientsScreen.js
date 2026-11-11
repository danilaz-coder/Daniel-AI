import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Avatar from '../components/Avatar';
import SectionHeading from '../components/SectionHeading';
import { COLORS } from '../styles/colors';
import { common } from '../styles/common';

function ClientRow({ client, onPress }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.clientRow, pressed && styles.pressed]}>
      <Avatar name={client.name} color={client.color} online={client.online} />
      <View style={styles.clientCopy}>
        <Text style={styles.clientName}>{client.name}</Text>
        <Text style={styles.clientCompany}>{client.company}</Text>
      </View>
      {client.unread > 0 ? <View style={styles.unreadBadge}><Text style={styles.unreadText}>{client.unread}</Text></View> : null}
    </Pressable>
  );
}

export default function ClientsScreen({ clients, onAddClient, onAddParsedClients, onOpenChat }) {
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const searchTimer = useRef(null);

  useEffect(() => () => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
  }, []);

  const closeAddModal = () => {
    setIsAddModalVisible(false);
    setName('');
    setCompany('');
    setPhone('');
  };

  const saveClient = () => {
    const clientName = name.trim();
    if (!clientName) {
      Alert.alert('Укажите имя', 'Введите имя клиента перед сохранением.');
      return;
    }

    onAddClient({
      name: clientName,
      company: company.trim(),
      phone: phone.trim(),
    });
    closeAddModal();
  };

  const findNewClients = () => {
    if (isSearching) return;
    setIsSearching(true);

    /*
    // Replace the demo timer with this request when the Python API is ready:
    const response = await fetch('http://твой_ip:8000/api/parse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    */

    searchTimer.current = setTimeout(() => {
      searchTimer.current = null;
      setIsSearching(false);
      Alert.alert(
        'Поиск завершён',
        'Найдено 3 новых клиента. Добавить в CRM?',
        [
          { text: 'Не сейчас', style: 'cancel' },
          {
            text: 'Добавить',
            onPress: () => {
              const companies = ['ООО Химпром', 'Завод Пластик', 'ТехноПолимер'];
              const newClients = companies.map((clientName) => ({
                name: clientName,
                company: clientName,
                phone: `+7 9${Math.floor(10 + Math.random() * 90)} ${Math.floor(100 + Math.random() * 900)}-${Math.floor(10 + Math.random() * 90)}-${Math.floor(10 + Math.random() * 90)}`,
                online: false,
                unread: 0,
                color: '#dcecff',
              }));
              onAddParsedClients(newClients);
              Alert.alert('Готово', '3 клиента добавлены в CRM.');
            },
          },
        ]
      );
    }, 2000);
  };

  return (
    <>
      <ScrollView contentContainerStyle={common.screenContent} showsVerticalScrollIndicator={false}>
        <View style={common.pageIntro}>
          <Text style={common.eyebrow}>ВАШИ КОНТАКТЫ</Text>
          <Text style={common.pageTitle}>Клиенты</Text>
          <Text style={common.pageSubtitle}>{clients.filter((client) => client.online).length} онлайн · {clients.length + 107} участников в сети</Text>
        </View>
        <Pressable accessibilityRole="button" onPress={() => setIsAddModalVisible(true)} style={styles.addClientButton}>
          <Text style={styles.addClientPlus}>＋</Text><Text style={styles.addClientText}>Добавить клиента</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: isSearching }}
          disabled={isSearching}
          onPress={findNewClients}
          style={[styles.findClientsButton, isSearching && styles.findClientsButtonBusy]}
        >
          {isSearching ? (
            <ActivityIndicator size="small" color={COLORS.blue} />
          ) : (
            <Text style={styles.findClientsIcon}>⌕</Text>
          )}
          <Text style={styles.findClientsText}>
            {isSearching ? 'ИИ ищет контакты по всей России...' : 'Найти новых клиентов'}
          </Text>
        </Pressable>
        <View style={styles.searchBar}><Text style={styles.searchIcon}>⌕</Text><TextInput placeholder="Поиск клиентов" placeholderTextColor="#91a0b2" style={styles.searchInput} /></View>
        <SectionHeading title="Недавние чаты" />
        {clients.map((client) => <ClientRow key={client.id} client={client} onPress={() => onOpenChat(client)} />)}
        <View style={styles.inviteCard}>
          <Text style={styles.inviteIcon}>♧</Text>
          <Text style={styles.inviteTitle}>Пригласите коллегу</Text>
          <Text style={styles.inviteCaption}>Клиенты могут приглашать других участников в общий чат.</Text>
          <Pressable onPress={() => Alert.alert('Приглашение', 'Функция приглашений доступна в полной версии.')}><Text style={common.link}>Пригласить участника →</Text></Pressable>
        </View>
      </ScrollView>

      <Modal
        animationType="fade"
        transparent
        visible={isAddModalVisible}
        onRequestClose={closeAddModal}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}
        >
          <Pressable accessibilityRole="button" accessibilityLabel="Закрыть форму" onPress={closeAddModal} style={StyleSheet.absoluteFill} />
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleCopy}>
                <Text style={styles.modalEyebrow}>НОВЫЙ КОНТАКТ</Text>
                <Text style={styles.modalTitle}>Добавить клиента</Text>
              </View>
              <Pressable accessibilityRole="button" accessibilityLabel="Закрыть" onPress={closeAddModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>×</Text>
              </Pressable>
            </View>

            <Text style={styles.fieldLabel}>Имя</Text>
            <TextInput
              accessibilityLabel="Имя клиента"
              autoCapitalize="words"
              autoFocus
              onChangeText={setName}
              placeholder="Например, Анна Петрова"
              placeholderTextColor="#91a0b2"
              returnKeyType="next"
              style={styles.modalInput}
              value={name}
            />
            <Text style={styles.fieldLabel}>Компания</Text>
            <TextInput
              accessibilityLabel="Компания клиента"
              autoCapitalize="words"
              onChangeText={setCompany}
              placeholder="Название компании"
              placeholderTextColor="#91a0b2"
              returnKeyType="next"
              style={styles.modalInput}
              value={company}
            />
            <Text style={styles.fieldLabel}>Телефон</Text>
            <TextInput
              accessibilityLabel="Телефон клиента"
              keyboardType="phone-pad"
              onChangeText={setPhone}
              placeholder="+7 (___) ___-__-__"
              placeholderTextColor="#91a0b2"
              returnKeyType="done"
              style={styles.modalInput}
              value={phone}
            />

            <Pressable accessibilityRole="button" onPress={saveClient} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Сохранить</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  addClientButton: { minHeight: 48, borderRadius: 14, backgroundColor: COLORS.blue, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, marginBottom: 12 },
  addClientPlus: { color: COLORS.white, fontSize: 20, fontWeight: '500', marginTop: -2 },
  addClientText: { color: COLORS.white, fontSize: 12, fontWeight: '800' },
  findClientsButton: { minHeight: 46, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12, borderRadius: 14, borderWidth: 1, borderColor: '#b8d8ff', backgroundColor: '#f0f7ff' },
  findClientsButtonBusy: { opacity: 0.8 },
  findClientsIcon: { color: COLORS.blue, fontSize: 22, fontWeight: '700' },
  findClientsText: { color: COLORS.blue, fontSize: 11, fontWeight: '800' },
  searchBar: { height: 44, paddingHorizontal: 12, borderRadius: 13, backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.line, flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 22 },
  searchIcon: { color: COLORS.muted, fontSize: 22 },
  searchInput: { flex: 1, color: COLORS.ink, fontSize: 12 },
  clientRow: { minHeight: 70, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 11, borderRadius: 14, backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: '#f1f4f8' },
  pressed: { opacity: 0.72 },
  clientCopy: { flex: 1, marginLeft: 11 },
  clientName: { color: COLORS.ink, fontSize: 12, fontWeight: '800' },
  clientCompany: { marginTop: 4, color: COLORS.muted, fontSize: 10 },
  unreadBadge: { minWidth: 19, height: 19, paddingHorizontal: 5, borderRadius: 10, backgroundColor: COLORS.blue, alignItems: 'center', justifyContent: 'center' },
  unreadText: { color: COLORS.white, fontSize: 9, fontWeight: '800' },
  inviteCard: { alignItems: 'center', marginTop: 17, padding: 17, borderRadius: 17, backgroundColor: '#eef8ff' },
  inviteIcon: { color: COLORS.blue, fontSize: 24 },
  inviteTitle: { marginTop: 8, color: COLORS.ink, fontSize: 13, fontWeight: '800' },
  inviteCaption: { marginTop: 5, marginBottom: 11, color: COLORS.muted, fontSize: 10, lineHeight: 15, textAlign: 'center' },
  modalOverlay: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: 'rgba(11, 28, 48, 0.48)' },
  modalCard: { padding: 19, borderRadius: 22, backgroundColor: COLORS.white, shadowColor: '#0b1c30', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.18, shadowRadius: 24, elevation: 10 },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 },
  modalTitleCopy: { flex: 1 },
  modalEyebrow: { color: COLORS.blue, fontSize: 9, fontWeight: '800', letterSpacing: 1 },
  modalTitle: { marginTop: 5, color: COLORS.ink, fontSize: 20, fontWeight: '800' },
  closeButton: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center', borderRadius: 12, backgroundColor: COLORS.canvas },
  closeButtonText: { marginTop: -2, color: COLORS.muted, fontSize: 25, lineHeight: 29 },
  fieldLabel: { marginTop: 10, marginBottom: 6, color: COLORS.ink, fontSize: 10, fontWeight: '700' },
  modalInput: { minHeight: 45, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1, borderColor: COLORS.line, backgroundColor: COLORS.canvas, color: COLORS.ink, fontSize: 12 },
  saveButton: { minHeight: 48, alignItems: 'center', justifyContent: 'center', marginTop: 20, borderRadius: 14, backgroundColor: COLORS.blue },
  saveButtonText: { color: COLORS.white, fontSize: 12, fontWeight: '800' },
});
