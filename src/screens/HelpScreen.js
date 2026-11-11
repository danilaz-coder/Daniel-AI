import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { COLORS } from '../styles/colors';
import { common } from '../styles/common';

const AGENTS = [
  { id: 'jarvis', name: 'JARVIS', icon: '✦', detail: 'Главный помощник', tint: '#e8f2ff', accent: '#0878f9' },
  { id: 'artemis', name: 'ARTEMIS', icon: '⟡', detail: 'Координация команды агентов', tint: '#eee9ff', accent: '#7656d6' },
  { id: 'openviking', name: 'OPENVIKING', icon: '◇', detail: 'Помощник в разделе помощи', tint: '#e5f7f2', accent: '#139b78' },
  { id: 'daniel', name: 'DANIEL', icon: '◈', detail: 'Помощь по задачам и проекту', tint: '#e5f7f2', accent: '#139b78' },
  { id: 'chatgpt', name: 'ChatGPT', icon: '✳', detail: 'Универсальный ИИ-помощник', tint: '#e5f7f2', accent: '#139b78' },
  { id: 'claude', name: 'Claude', icon: '◉', detail: 'Помощь с анализом и текстами', tint: '#fff2e7', accent: '#b66b3c' },
  { id: 'grok', name: 'GROK', icon: '⌁', detail: 'Идеи и быстрый разбор вопросов', tint: '#fff2e7', accent: '#e77b28' },
  { id: 'kimi', name: 'KIMI', icon: '☾', detail: 'Помощь с информацией и текстами', tint: '#fceaf0', accent: '#d35483' },
  { id: 'littlebird', name: 'Little bird', icon: '⌕', detail: 'Короткие подсказки и ответы', tint: '#e9f4ff', accent: '#3e83bb' },
];

export default function HelpScreen({ helpAgent, onSelectAgent, helpText, onChangeHelpText, helpMessages, isLoading, onSend }) {
  const selectedAgent = AGENTS.find((agent) => agent.name === helpAgent) || AGENTS[0];
  const sendSelectedAgentMessage = () => onSend(selectedAgent.id);

  return (
    <ScrollView contentContainerStyle={common.screenContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
      <View style={common.pageIntro}>
        <Text style={common.eyebrow}>КОМАНДА ПОМОЩНИКОВ</Text>
        <Text style={common.pageTitle}>Помощь</Text>
        <Text style={common.pageSubtitle}>Выберите агента и задайте вопрос команде MAIN EVENT.</Text>
      </View>
      <View style={styles.agentList}>
        <View style={styles.sectionHeading}>
          <Text style={styles.sectionTitle}>Ваши агенты</Text>
          <Text style={styles.agentCount}>{AGENTS.length} помощников</Text>
        </View>
        {AGENTS.map((agent) => (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: helpAgent === agent.name }}
            key={agent.name}
            onPress={() => onSelectAgent(agent.name)}
            style={[styles.agentCard, helpAgent === agent.name && styles.agentCardActive]}
          >
            <View style={[styles.agentIcon, { backgroundColor: agent.tint }]}>
              <Text style={[styles.agentIconText, { color: agent.accent }]}>{agent.icon}</Text>
            </View>
            <View style={styles.agentCopy}>
              <View style={styles.agentNameRow}>
                <Text style={styles.agentName}>{agent.name}</Text>
                <View style={[styles.agentStatusDot, { backgroundColor: agent.accent }]} />
              </View>
              <Text style={styles.agentDetail}>{agent.detail}</Text>
            </View>
            {helpAgent === agent.name
              ? <Text style={styles.selectedLabel}>Выбран</Text>
              : <Text style={common.chevron}>›</Text>}
          </Pressable>
        ))}
      </View>
      <View style={styles.helpChat}>
        <View style={styles.chatHeading}>
          <View style={[styles.chatAgentIcon, { backgroundColor: selectedAgent.tint }]}>
            <Text style={[styles.chatAgentIconText, { color: selectedAgent.accent }]}>{selectedAgent.icon}</Text>
          </View>
          <View style={styles.chatHeadingCopy}>
            <Text style={styles.helpChatTitle}>Чат с {selectedAgent.name}</Text>
            <Text style={styles.helpRoute}>Команда MAIN EVENT · на связи</Text>
          </View>
        </View>
        <View style={styles.messageList}>
        {helpMessages.map((message) => (
          <View key={message.id} style={[common.messageBubble, message.mine ? common.messageMine : common.messageOther]}>
            <Text style={[common.messageText, message.mine && common.messageMineText]}>{message.text}</Text>
            {message.time ? (
              <Text style={[styles.messageTime, message.mine && styles.messageTimeMine]}>{message.time}</Text>
            ) : null}
          </View>
        ))}
        </View>
        {isLoading ? (
          <View style={styles.typingIndicator}>
            <ActivityIndicator size="small" color={COLORS.blue} />
            <Text style={styles.typingText}>{selectedAgent.name} печатает...</Text>
          </View>
        ) : null}
        <View style={styles.helpComposer}>
          <TextInput
            accessibilityLabel="Сообщение помощнику"
            value={helpText}
            onChangeText={onChangeHelpText}
            editable={!isLoading}
            placeholder="Сообщение..."
            placeholderTextColor="#91a0b2"
            style={styles.composerInput}
            multiline
            onSubmitEditing={sendSelectedAgentMessage}
            returnKeyType="send"
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Отправить сообщение"
            accessibilityState={{ disabled: isLoading }}
            disabled={isLoading}
            onPress={sendSelectedAgentMessage}
            style={common.sendButton}
          >
            <Text style={common.sendButtonText}>↑</Text>
          </Pressable>
        </View>
        <Text style={styles.demoNotice}>Отправляя сообщение, вы обращаетесь к выбранному агенту.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  agentList: { gap: 9, marginBottom: 17 },
  sectionHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 },
  sectionTitle: { color: COLORS.ink, fontSize: 13, fontWeight: '800' },
  agentCount: { color: COLORS.muted, fontSize: 9, fontWeight: '600' },
  agentCard: { minHeight: 66, flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 16, borderWidth: 1, borderColor: COLORS.line, backgroundColor: COLORS.white },
  agentCardActive: { borderColor: COLORS.blue, backgroundColor: '#f6faff', shadowColor: COLORS.blue, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 2 },
  agentIcon: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center', borderRadius: 14 },
  agentIconText: { fontSize: 20, fontWeight: '800' },
  agentCopy: { flex: 1, marginLeft: 11 },
  agentNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  agentName: { color: COLORS.ink, fontSize: 11, fontWeight: '800' },
  agentStatusDot: { width: 6, height: 6, borderRadius: 3 },
  agentDetail: { marginTop: 4, color: COLORS.muted, fontSize: 9 },
  selectedLabel: { paddingHorizontal: 8, paddingVertical: 5, borderRadius: 8, backgroundColor: COLORS.pale, color: COLORS.blue, fontSize: 8, fontWeight: '800' },
  helpChat: { padding: 14, borderRadius: 18, backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.line, shadowColor: '#18324f', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 1 },
  chatHeading: { flexDirection: 'row', alignItems: 'center', paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: COLORS.line },
  chatAgentIcon: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 12 },
  chatAgentIconText: { fontSize: 18, fontWeight: '800' },
  chatHeadingCopy: { flex: 1, marginLeft: 10 },
  helpChatTitle: { color: COLORS.ink, fontSize: 12, fontWeight: '800' },
  helpRoute: { marginTop: 4, color: COLORS.muted, fontSize: 9 },
  messageList: { paddingTop: 12 },
  typingIndicator: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 8 },
  typingText: { color: COLORS.muted, fontSize: 9 },
  helpComposer: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, marginTop: 5, padding: 5, borderRadius: 15, borderWidth: 1, borderColor: COLORS.line, backgroundColor: COLORS.canvas },
  composerInput: { flex: 1, minHeight: 38, maxHeight: 96, paddingHorizontal: 8, paddingVertical: 9, color: COLORS.ink, fontSize: 11 },
  messageTime: { marginTop: 5, color: COLORS.muted, fontSize: 8, textAlign: 'right' },
  messageTimeMine: { color: '#dbeaff' },
  demoNotice: { marginTop: 9, color: COLORS.muted, fontSize: 8, lineHeight: 12, textAlign: 'center' },
});
