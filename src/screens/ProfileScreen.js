import React from 'react';
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import GradientBrand from '../components/GradientBrand';
import { COLORS } from '../styles/colors';
import { common } from '../styles/common';
import { useTranslation } from 'react-i18next';

const MENU_ITEMS = [
  ['◷', 'profile_menu_history_title', 'profile_menu_history_desc'],
  ['♧', 'profile_menu_contacts_title', 'profile_menu_contacts_desc'],
  ['⚙', 'profile_menu_settings_title', 'profile_menu_settings_desc'],
];

const COMMUNITY_URL = 'https://circle.so';

export default function ProfileScreen() {
  const { t, i18n } = useTranslation();

  async function openCommunity() {
    try {
      await Linking.openURL(COMMUNITY_URL);
    } catch {
      Alert.alert('Не удалось открыть ссылку', 'Попробуйте ещё раз позже.');
    }
  }

  return (
    <ScrollView contentContainerStyle={common.screenContent} showsVerticalScrollIndicator={false}>
      
      <View style={styles.profileCard}>
        <View style={styles.profileAvatar}><Text style={styles.profileAvatarText}>Д</Text></View>
        <Text style={styles.profileName}>Даниэль</Text>
        <Text style={styles.profileRole}>Эксперт VitalPlast · создатель проекта</Text>
        <GradientBrand style={styles.profileBadge}>ПРЕДСТАВИТЕЛЬ VITALPLAST</GradientBrand>
      </View>

      <View style={styles.profileMenu}>
        {MENU_ITEMS.map(([icon, title, detail]) => (
          <Pressable key={title} style={styles.profileMenuRow} onPress={() => Alert.alert(t(title), t(detail))}>
            <Text style={styles.profileMenuIcon}>{icon}</Text>
            <View style={styles.profileMenuCopy}>
              <Text style={styles.profileMenuTitle}>{t(title)}</Text>
              <Text style={styles.profileMenuDetail}>{t(detail)}</Text>
            </View>
            <Text style={common.chevron}>›</Text>
          </Pressable>
        ))}
      </View>

      <Text style={common.footerNoteText}>VitalPlast · MAIN EVENT · мобильная демоверсия</Text>

      {/* БЛОК ЯЗЫКОВ */}
      <View style={styles.langContainer}>
        <Pressable 
          onPress={() => i18n.changeLanguage('ru')} 
          style={[styles.langBtn, i18n.language === 'ru' && styles.langBtnActive]}
        >
          <Text style={[styles.langText, i18n.language === 'ru' && styles.langTextActive]}>RU</Text>
        </Pressable>
        
        <Pressable 
          onPress={() => i18n.changeLanguage('en')} 
          style={[styles.langBtn, i18n.language === 'en' && styles.langBtnActive]}
        >
          <Text style={[styles.langText, i18n.language === 'en' && styles.langTextActive]}>EN</Text>
        </Pressable>
        
        <Pressable 
          onPress={() => i18n.changeLanguage('zh')} 
          style={[styles.langBtn, i18n.language === 'zh' && styles.langBtnActive]}
        >
          <Text style={[styles.langText, i18n.language === 'zh' && styles.langTextActive]}>中文</Text>
        </Pressable>
        
        <Pressable 
          onPress={() => i18n.changeLanguage('tr')} 
          style={[styles.langBtn, i18n.language === 'tr' && styles.langBtnActive]}
        >
          <Text style={[styles.langText, i18n.language === 'tr' && styles.langTextActive]}>TR</Text>
        </Pressable>
        
        <Pressable 
          onPress={() => i18n.changeLanguage('hi')} 
          style={[styles.langBtn, i18n.language === 'hi' && styles.langBtnActive]}
        >
          <Text style={[styles.langText, i18n.language === 'hi' && styles.langTextActive]}>HI</Text>
        </Pressable>
      </View>
      {/* КОНЕЦ БЛОКА ЯЗЫКОВ */}

      <Pressable
        accessibilityRole="link"
        accessibilityLabel="Вступить в клуб"
        onPress={openCommunity}
        style={({ pressed }) => [styles.communityButton, pressed && styles.communityButtonPressed]}
      >
        <Text style={styles.communityIcon}>✦</Text>
        <Text style={styles.communityButtonText}>Вступить в клуб</Text>
        <Text style={styles.communityArrow}>↗</Text>
      </Pressable>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  profileCard: { 
    alignItems: 'center', 
    padding: 25, 
    borderRadius: 22, 
    backgroundColor: '#112f56' 
  },
  profileAvatar: { 
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    backgroundColor: '#fff', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 10 
  },
  profileAvatarText: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#112f56' 
  },
  profileName: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#fff', 
    marginBottom: 4 
  },
  profileRole: { 
    fontSize: 13, 
    color: 'rgba(255,255,255,0.7)', 
    marginBottom: 10 
  },
  profileBadge: { 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 8 
  },
  profileMenu: { 
    marginTop: 20, 
    backgroundColor: '#fff', 
    borderRadius: 16, 
    overflow: 'hidden' 
  },
  profileMenuRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 16, 
    borderBottomWidth: 1, 
    borderBottomColor: '#eef2f6' 
  },
  profileMenuIcon: { 
    fontSize: 20, 
    marginRight: 12, 
    color: '#112f56' 
  },
  profileMenuCopy: { 
    flex: 1 
  },
  profileMenuTitle: { 
    fontSize: 15, 
    fontWeight: '600', 
    color: '#1a202c', 
    marginBottom: 2 
  },
  profileMenuDetail: { 
    fontSize: 12, 
    color: '#718096' 
  },
  
  // СТИЛИ ДЛЯ КНОПОК ЯЗЫКОВ
  langContainer: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    flexWrap: 'wrap', 
    gap: 10, 
    marginTop: 20, 
    marginBottom: 14,
    paddingHorizontal: 20 
  },
  langBtn: { 
    paddingVertical: 10, 
    paddingHorizontal: 16, 
    borderRadius: 20, 
    backgroundColor: '#f0f4f8', 
    borderWidth: 1, 
    borderColor: '#e2e8f0' 
  },
  langBtnActive: { 
    backgroundColor: COLORS.primary, 
    borderColor: COLORS.primary 
  },
  langText: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#64748b' 
  },
  langTextActive: { 
    color: '#ffffff' 
  },
  communityButton: {
    minHeight: 48,
    marginBottom: 20,
    borderRadius: 14,
    backgroundColor: COLORS.blue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },
  communityButtonPressed: {
    opacity: 0.8,
  },
  communityIcon: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  communityButtonText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '800',
  },
  communityArrow: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '800',
  },
});