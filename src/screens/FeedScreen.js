import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Avatar from '../components/Avatar';
import GradientBrand from '../components/GradientBrand';
import SectionHeading from '../components/SectionHeading';
import { COLORS } from '../styles/colors';
import { common } from '../styles/common';

const FILTERS = ['Все', 'PR', 'Продажи', 'Технический'];

function PostCard({ post, onLike }) {
  return (
    <View style={styles.card}>
      <View style={styles.postTop}>
        <Avatar name={post.author} color="#dcecff" size={38} />
        <View style={styles.postAuthorCopy}>
          <Text style={styles.postAuthor}>{post.author}</Text>
          <Text style={styles.postTime}>{post.time}</Text>
        </View>
        <Text style={styles.postMenu}>•••</Text>
      </View>
      <View style={styles.tag}><Text style={styles.tagText}>{post.tag}</Text></View>
      <Text style={styles.postBody}>{post.body}</Text>
      <View style={styles.postActions}>
        <Pressable accessibilityRole="button" onPress={onLike} style={styles.postAction}>
          <Text style={styles.actionIcon}>♡</Text><Text style={styles.actionLabel}>{post.likes}</Text>
        </Pressable>
        <Text style={styles.actionLabel}>▢  Ответить</Text>
        <Text style={styles.actionLabel}>↗</Text>
      </View>
    </View>
  );
}

export default function FeedScreen({ clients, posts, filter, onChangeFilter, onToggleLike, onNavigate }) {
  const visiblePosts = filter === 'Все' ? posts : posts.filter((post) => post.tag === filter);
  return (
    <ScrollView contentContainerStyle={common.screenContent} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <View style={styles.heroTop}>
          <GradientBrand>MAIN EVENT</GradientBrand>
          <Text style={styles.heroOnline}><Text style={styles.heroDot}>●</Text> {clients.filter((client) => client.online).length} онлайн</Text>
        </View>
        <Text style={styles.heroTitle}>Ваша B2B-сеть{'\n'}для новых возможностей</Text>
        <Text style={styles.heroSubtitle}>Клиенты, эксперты и сделки — в одном месте.</Text>
        <View style={styles.heroStats}>
          <View><Text style={styles.statValue}>{clients.length + 107}</Text><Text style={styles.statLabel}>участников</Text></View>
          <View style={styles.statDivider} />
          <View><Text style={styles.statValue}>24/7</Text><Text style={styles.statLabel}>на связи</Text></View>
          <View style={styles.heroMark}><Text style={styles.heroMarkText}>V</Text></View>
        </View>
      </View>

      <View style={styles.quickActions}>
        <Pressable style={styles.quickCard} onPress={() => onNavigate('clients')}>
          <Text style={styles.quickIcon}>♙</Text><Text style={styles.quickTitle}>Клиенты</Text><Text style={styles.quickCaption}>Найти и написать</Text>
        </Pressable>
        <Pressable style={styles.quickCard} onPress={() => onNavigate('help')}>
          <Text style={[styles.quickIcon, { color: '#735fe8' }]}>✦</Text><Text style={styles.quickTitle}>Помощь</Text><Text style={styles.quickCaption}>Связаться с агентом</Text>
        </Pressable>
      </View>

      <SectionHeading title="Общий поток" action="Все публикации" onAction={() => onChangeFilter('Все')} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterList}>
        {FILTERS.map((item) => (
          <Pressable key={item} onPress={() => onChangeFilter(item)} style={[styles.filterChip, filter === item && styles.filterChipActive]}>
            <Text style={[styles.filterText, filter === item && styles.filterTextActive]}>{item}</Text>
          </Pressable>
        ))}
      </ScrollView>
      {visiblePosts.map((post) => <PostCard key={post.id} post={post} onLike={() => onToggleLike(post.id)} />)}
      <View style={styles.footerNote}><Text style={common.footerNoteText}>Закрытая B2B-сеть · бесплатно для участников</Text></View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  hero: { borderRadius: 24, backgroundColor: '#112f56', padding: 20, overflow: 'hidden', marginBottom: 15 },
  heroTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  heroOnline: { color: '#c8d8eb', fontSize: 11, fontWeight: '600' },
  heroDot: { color: '#4fe0a1', fontSize: 9 },
  heroTitle: { marginTop: 20, color: COLORS.white, fontSize: 25, lineHeight: 31, fontWeight: '800', letterSpacing: -0.5 },
  heroSubtitle: { marginTop: 7, color: '#bbcee3', fontSize: 12, lineHeight: 18 },
  heroStats: { marginTop: 21, paddingTop: 15, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.12)', flexDirection: 'row', alignItems: 'center', gap: 22 },
  statValue: { color: COLORS.white, fontSize: 18, fontWeight: '800' },
  statLabel: { marginTop: 3, color: '#bbcee3', fontSize: 10 },
  statDivider: { width: 1, height: 29, backgroundColor: 'rgba(255,255,255,0.16)' },
  heroMark: { marginLeft: 'auto', width: 40, height: 40, borderRadius: 15, backgroundColor: 'rgba(39,199,235,0.14)', alignItems: 'center', justifyContent: 'center' },
  heroMarkText: { color: '#7de1f3', fontSize: 21, fontWeight: '900' },
  quickActions: { flexDirection: 'row', gap: 10, marginBottom: 23 },
  quickCard: { flex: 1, minHeight: 97, padding: 13, borderRadius: 17, backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.line },
  quickIcon: { color: COLORS.blue, fontSize: 20, fontWeight: '700' },
  quickTitle: { marginTop: 6, color: COLORS.ink, fontSize: 12, fontWeight: '800' },
  quickCaption: { marginTop: 3, color: COLORS.muted, fontSize: 10 },
  filterList: { gap: 7, paddingBottom: 13 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.line },
  filterChipActive: { borderColor: COLORS.blue, backgroundColor: COLORS.pale },
  filterText: { color: COLORS.muted, fontSize: 11, fontWeight: '600' },
  filterTextActive: { color: COLORS.blue, fontWeight: '800' },
  card: { marginBottom: 11, padding: 15, borderRadius: 18, backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.line },
  postTop: { flexDirection: 'row', alignItems: 'center' },
  postAuthorCopy: { flex: 1, marginLeft: 10 },
  postAuthor: { color: COLORS.ink, fontSize: 11, fontWeight: '800' },
  postTime: { marginTop: 3, color: COLORS.muted, fontSize: 10 },
  postMenu: { alignSelf: 'flex-start', color: COLORS.muted, fontWeight: '800', letterSpacing: 1 },
  tag: { alignSelf: 'flex-start', marginTop: 13, paddingHorizontal: 9, paddingVertical: 5, borderRadius: 7, backgroundColor: COLORS.pale },
  tagText: { color: COLORS.blue, fontSize: 9, fontWeight: '800' },
  postBody: { marginTop: 10, color: '#40536b', fontSize: 12, lineHeight: 18 },
  postActions: { flexDirection: 'row', alignItems: 'center', gap: 20, marginTop: 13, paddingTop: 11, borderTopWidth: 1, borderTopColor: '#f0f3f8' },
  postAction: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  actionIcon: { color: COLORS.blue, fontSize: 17 },
  actionLabel: { color: COLORS.muted, fontSize: 10, fontWeight: '600' },
  footerNote: { alignItems: 'center', paddingTop: 4, paddingBottom: 8 },
});
