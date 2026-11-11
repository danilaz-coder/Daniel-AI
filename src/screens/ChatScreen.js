import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Avatar from '../components/Avatar';
import { COLORS } from '../styles/colors';
import { common } from '../styles/common';

export default function ChatScreen({ client, messages, text, onChangeText, onSend, onBack }) {
  return (
    <View style={styles.chatScreen}>
      <View style={styles.chatHeader}>
        <Pressable accessibilityRole="button" onPress={onBack} style={styles.backButton}><Text style={styles.backText}>‹</Text></Pressable>
        <Avatar name={client.name} color={client.color} online={client.online} size={40} />
        <View style={styles.chatHeaderCopy}><Text style={styles.chatName}>{client.name}</Text><Text style={styles.chatStatus}>{client.online ? 'онлайн' : client.company}</Text></View>
        <Pressable onPress={() => Alert.alert(client.name, client.company)}><Text style={styles.chatMore}>•••</Text></Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.chatMessages}>
        <Text style={styles.dateSeparator}>СЕГОДНЯ</Text>
        <View style={common.messageOther}><Text style={common.messageText}>Здравствуйте! Хотели бы обсудить подбор сырья для производства.</Text><Text style={styles.chatTime}>10:42</Text></View>
        <View style={[common.messageBubble, common.messageMine]}><Text style={[common.messageText, common.messageMineText]}>Добрый день! Конечно, помогу. Напишите, пожалуйста, какие материалы вас интересуют.</Text><Text style={[styles.chatTime, styles.chatTimeMine]}>10:45 · ✓✓</Text></View>
        {messages.map((message) => (
          <View key={message.id} style={[common.messageBubble, message.mine ? common.messageMine : common.messageOther]}>
            <Text style={[common.messageText, message.mine && common.messageMineText]}>{message.text}</Text>
            <Text style={[styles.chatTime, message.mine && styles.chatTimeMine]}>{new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}{message.mine ? ' · ✓✓' : ''}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.chatComposer}>
        <TextInput value={text} onChangeText={onChangeText} placeholder="Сообщение..." placeholderTextColor="#91a0b2" style={styles.chatInput} onSubmitEditing={onSend} returnKeyType="send" />
        <Pressable accessibilityRole="button" onPress={onSend} style={common.sendButton}><Text style={common.sendButtonText}>↑</Text></Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chatScreen: { flex: 1, backgroundColor: '#f4f7fb' },
  chatHeader: { height: 64, paddingHorizontal: 13, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.line },
  backButton: { width: 28 },
  backText: { color: COLORS.blue, fontSize: 32, lineHeight: 35 },
  chatHeaderCopy: { flex: 1 },
  chatName: { color: COLORS.ink, fontSize: 12, fontWeight: '800' },
  chatStatus: { marginTop: 3, color: COLORS.green, fontSize: 9 },
  chatMore: { color: COLORS.muted, fontSize: 17, fontWeight: '800' },
  chatMessages: { flexGrow: 1, paddingHorizontal: 14, paddingVertical: 19, justifyContent: 'flex-end' },
  dateSeparator: { alignSelf: 'center', marginBottom: 17, color: '#9aa7b7', fontSize: 8, fontWeight: '800', letterSpacing: 1 },
  chatTime: { marginTop: 5, color: COLORS.muted, fontSize: 8, textAlign: 'right' },
  chatTimeMine: { color: '#dbeaff' },
  chatComposer: { paddingHorizontal: 12, paddingVertical: 9, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: COLORS.line },
  chatInput: { flex: 1, height: 42, paddingHorizontal: 13, borderRadius: 13, backgroundColor: COLORS.canvas, color: COLORS.ink, fontSize: 11 },
});
