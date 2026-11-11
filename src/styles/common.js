import { StyleSheet } from 'react-native';
import { COLORS } from './colors';

// Стили, которые используются сразу в нескольких экранах/компонентах.
export const common = StyleSheet.create({
  screenContent: { padding: 18, paddingBottom: 30 },
  link: { color: COLORS.blue, fontSize: 11, fontWeight: '700' },
  pageIntro: { marginTop: 8, marginBottom: 18 },
  eyebrow: { color: COLORS.blue, fontSize: 9, fontWeight: '800', letterSpacing: 1.25 },
  pageTitle: { marginTop: 6, color: COLORS.ink, fontSize: 27, fontWeight: '800', letterSpacing: -0.6 },
  pageSubtitle: { marginTop: 5, color: COLORS.muted, fontSize: 11, lineHeight: 16 },
  footerNoteText: { color: '#8a99ab', fontSize: 10, textAlign: 'center', lineHeight: 15 },
  chevron: { color: COLORS.blue, fontSize: 18, fontWeight: '700', paddingHorizontal: 5 },
  messageBubble: { maxWidth: '88%', paddingHorizontal: 12, paddingVertical: 9, borderRadius: 15, marginBottom: 8 },
  messageMine: { alignSelf: 'flex-end', backgroundColor: COLORS.blue, borderBottomRightRadius: 4 },
  messageOther: { alignSelf: 'flex-start', backgroundColor: '#eef2f7', borderBottomLeftRadius: 4 },
  messageText: { color: COLORS.ink, fontSize: 11, lineHeight: 16 },
  messageMineText: { color: COLORS.white },
  sendButton: { width: 38, height: 38, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.blue },
  sendButtonText: { color: COLORS.white, fontSize: 20, fontWeight: '700' },
});
