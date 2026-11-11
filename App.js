import './src/i18n'; // <--- ДОБАВИЛИ ЭТО (подключение языков)
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Text strings must be rendered']);

import React, { useRef, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import BottomNav from './src/components/BottomNav';
import TopBar from './src/components/TopBar';
import { INITIAL_CLIENTS } from './src/data/clients';
import { INITIAL_POSTS } from './src/data/posts';
import AnalyticsScreen from './src/screens/AnalyticsScreen';
import CalculatorScreen from './src/screens/CalculatorScreen';
import ChatScreen from './src/screens/ChatScreen';
import ClientsScreen from './src/screens/ClientsScreen';
import CommunityScreen from './src/screens/CommunityScreen';
import FeedScreen from './src/screens/FeedScreen';
import HelpScreen from './src/screens/HelpScreen';
import ModifierScreen from './src/screens/ModifierScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SyncScreen from './src/screens/SyncScreen';
import WheelScreen from './src/screens/WheelScreen';
import { COLORS } from './src/styles/colors';
import { ThemeProvider } from './src/context/ThemeContext';

export default function App() {
  const [activeTab, setActiveTab] = useState('feed');
  const [clients, setClients] = useState(INITIAL_CLIENTS);
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [chatClient, setChatClient] = useState(null);
  const [chatText, setChatText] = useState('');
  const [messages, setMessages] = useState({});
  const [helpAgent, setHelpAgent] = useState('JARVIS');
  const [helpText, setHelpText] = useState('');
  const [helpMessages, setHelpMessages] = useState([]);
  const [isHelpLoading, setIsHelpLoading] = useState(false);
  const helpRequestInFlight = useRef(false);
  const [filter, setFilter] = useState('Все');

  const openChat = (client) => {
    setChatClient(client);
    setActiveTab('clients');
  };

  const sendChatMessage = () => {
    const text = chatText.trim();
    if (!text || !chatClient) return;
    setMessages((current) => ({
      ...current,
      [chatClient.id]: [...(current[chatClient.id] || []), { id: `${Date.now()}`, text, mine: true }],
    }));
    setChatText('');
  };

  const addClient = ({ name, company, phone }) => {
    const client = {
      id: `${Date.now()}`,
      name,
      company: company || 'Компания не указана',
      phone,
      online: true,
      unread: 0,
      color: '#dcecff',
    };
    setClients((current) => [client, ...current]);
  };

  const addParsedClients = (parsedClients) => {
    const timestamp = Date.now();
    const clientsToAdd = parsedClients.map((client, index) => ({
      ...client,
      id: `${timestamp}-${index}`,
    }));
    setClients((current) => [...clientsToAdd, ...current]);
  };

  const sendHelpMessage = async (agent) => {
    const text = helpText.trim();
    if (!text || helpRequestInFlight.current) return;

    const apiBaseUrl = process.env.EXPO_PUBLIC_API_URL;
    if (typeof apiBaseUrl !== 'string' || !apiBaseUrl.trim()) {
      Alert.alert('Ошибка сети');
      return;
    }

    helpRequestInFlight.current = true;
    const time = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    setHelpMessages((current) => [
      ...current,
      { id: `${Date.now()}`, text, mine: true, time },
    ]);
    setHelpText('');
    setIsHelpLoading(true);

    try {
      const response = await fetch(`${apiBaseUrl.trim().replace(/\/+$/, '')}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, agent }),
      });

      const data = await response.json().catch(() => null);
      const errorCode = data?.error?.code
        ?? data?.code
        ?? data?.detail?.code
        ?? data?.detail?.error?.code;
      const errorMessage = [
        data?.error?.message,
        data?.detail?.message,
        data?.detail?.error?.message,
        typeof data?.detail === 'string' ? data.detail : null,
        data?.message,
      ].filter((value) => typeof value === 'string').join(' ');
      const isChatGptQuotaError = agent.toLowerCase() === 'chatgpt'
        && (
          response.status === 429
          || Number(errorCode) === 429
          || String(errorCode).toLowerCase() === 'insufficient_quota'
          || /insufficient[_ ]quota/i.test(errorMessage)
        );

      if (isChatGptQuotaError) {
        const responseTime = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
        setHelpMessages((current) => [
          ...current,
          {
            id: `${Date.now()}`,
            text: 'ChatGPT временно недоступен. Ожидается пополнение баланса от Виталия. Пожалуйста, выберите другого агента или попробуйте позже.',
            mine: false,
            time: responseTime,
          },
        ]);
        return;
      }

      if (!response.ok) {
        throw new Error(`Chat API returned HTTP ${response.status}`);
      }

      const answer = typeof data === 'string'
        ? data
        : data?.answer ?? data?.reply ?? data?.response ?? data?.message;

      if (typeof answer !== 'string' || !answer.trim()) {
        throw new Error('Chat API response did not contain an answer.');
      }

      const responseTime = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
      setHelpMessages((current) => [
        ...current,
        { id: `${Date.now()}`, text: answer.trim(), mine: false, time: responseTime },
      ]);
    } catch (error) {
      console.error('Failed to send help message:', error);
      Alert.alert('Ошибка сети');
    } finally {
      helpRequestInFlight.current = false;
      setIsHelpLoading(false);
    }
  };

  const toggleLike = (postId) => {
    setPosts((current) => current.map((post) => post.id === postId ? { ...post, likes: post.likes + 1 } : post));
  };

  let content;
  if (chatClient) {
    content = (
      <ChatScreen
        client={chatClient}
        messages={messages[chatClient.id] || []}
        text={chatText}
        onChangeText={setChatText}
        onSend={sendChatMessage}
        onBack={() => setChatClient(null)}
      />
    );
  } else if (activeTab === 'clients') {
    content = (
      <ClientsScreen
        clients={clients}
        onAddClient={addClient}
        onAddParsedClients={addParsedClients}
        onOpenChat={openChat}
      />
    );
  } else if (activeTab === 'community') {
    content = <CommunityScreen />;
  } else if (activeTab === 'help') {
    content = (
      <HelpScreen
        helpAgent={helpAgent}
        onSelectAgent={setHelpAgent}
        helpText={helpText}
        onChangeHelpText={setHelpText}
        helpMessages={helpMessages}
        isLoading={isHelpLoading}
        onSend={sendHelpMessage}
      />
    );
  } else if (activeTab === 'analytics') {
    content = <AnalyticsScreen onNavigate={setActiveTab} />;
  } else if (activeTab === 'wheel') {
    content = <WheelScreen onNavigate={setActiveTab} onSelectAgent={setHelpAgent} />;
  } else if (activeTab === 'calculator') {
    content = <CalculatorScreen />;
  } else if (activeTab === 'modifier') {
    content = <ModifierScreen />;
  } else if (activeTab === 'sync') {
    content = <SyncScreen />;
  } else if (activeTab === 'profile') {
    content = <ProfileScreen />;
  } else {
    content = (
      <FeedScreen
        clients={clients}
        posts={posts}
        filter={filter}
        onChangeFilter={setFilter}
        onToggleLike={toggleLike}
        onNavigate={setActiveTab}
      />
    );
  }

  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <SafeAreaView style={styles.safeArea}>
          <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
          <KeyboardAvoidingView style={styles.app} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <TopBar onNotificationsPress={() => Alert.alert('Уведомления', 'Новых уведомлений нет.')} />
            <View style={styles.content}>{content}</View>
            {!chatClient ? <BottomNav activeTab={activeTab} onSelect={setActiveTab} /> : null}
          </KeyboardAvoidingView>
        </SafeAreaView>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.white },
  app: { flex: 1, backgroundColor: COLORS.canvas },
  content: { flex: 1 },
});