import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { COLORS } from '../styles/colors';

export default function CommunityScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.webViewContainer}>
        <WebView
          source={{ uri: 'https://main-event-community.circle.so' }}
          style={styles.webView}
          startInLoadingState
        />
        <TouchableOpacity
          style={styles.askButton}
          onPress={() => Alert.alert('AI-ассистент', 'AI-ассистент доступен в приложении Main Event')}
          accessibilityRole="button"
          accessibilityLabel="Спросить ИИ"
        >
          <Text style={styles.askButtonText}>Спросить ИИ</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  webViewContainer: { flex: 1 },
  webView: { flex: 1 },
  askButton: {
    position: 'absolute',
    right: 16,
    bottom: 20,
    backgroundColor: COLORS.blue,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 13,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  askButtonText: { color: COLORS.white, fontSize: 14, fontWeight: '700' },
});