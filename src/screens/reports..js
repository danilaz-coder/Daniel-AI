import { Feather } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system/legacy";
import * as Haptics from "expo-haptics";
import * as Sharing from "expo-sharing";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Proposal } from "@/contexts/AppContext";
import { useApp } from "@/contexts/AppContext";
import { useColors } from "@/hooks/useColors";

const CHANNEL_COLORS: Record<Proposal["channel"], string> = {
  email: "#1a4fbe",
  whatsapp: "#25d366",
  telegram: "#0088cc",
  wechat: "#07c160",
  max: "#0077ff",
  phone: "#f59e0b",
  other: "#6b7280",
};

const CHANNEL_LABELS: Record<Proposal["channel"], string> = {
  email: "Email",
  whatsapp: "WhatsApp",
  telegram: "Telegram",
  wechat: "WeChat",
  max: "Макс",
  phone: "Звонок",
  other: "Другое",
};

const STATUS_COLORS: Record<Proposal["status"], string> = {
  sent: "#3b82f6",
  viewed: "#8b5cf6",
  rejected: "#ef4444",
  accepted: "#16a34a",
};

const STATUS_LABELS: Record<Proposal["status"], string> = {
  sent: "Отправлено",
  viewed: "Просмотрено",
  rejected: "Отказ",
  accepted: "Принято",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function escapeCSV(val: string | number): string {
  const str = String(val);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function buildCSV(proposals: Proposal[]): string {
  const BOM = "\uFEFF";
  const headers = [
    "Дата отправки",
    "Клиент",
    "Компания",
    "Канал",
    "Тема",
    "Продукты",
    "Сумма (руб)",
    "Статус",
    "Примечание",
  ];

  const rows = proposals.map((p) => {
    const productsStr = p.products
      .map((pp) => `${pp.productName} x${pp.quantity}кг`)
      .join("; ");
    return [
      formatDate(p.sentAt),
      p.clientName,
      p.clientCompany,
      CHANNEL_LABELS[p.channel],
      p.subject ?? "",
      productsStr,
      p.totalValue.toFixed(0),
      STATUS_LABELS[p.status],
      p.notes ?? "",
    ].map(escapeCSV).join(",");
  });

  return BOM + [headers.join(","), ...rows].join("\n");
}

export default function ReportsScreen() {
  const colors = useColors();
  const { proposals, updateProposal, deleteProposal } = useApp();
  const [exporting, setExporting] = useState(false);
  const [filterChannel, setFilterChannel] = useState<Proposal["channel"] | "all">("all");

  const filtered = filterChannel === "all"
    ? proposals
    : proposals.filter((p) => p.channel === filterChannel);

  const sorted = [...filtered].sort(
    (a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
  );

  // Stats
  const totalValue = proposals.reduce((s, p) => s + p.totalValue, 0);
  const accepted = proposals.filter((p) => p.status === "accepted").length;
  const channels = Object.keys(CHANNEL_LABELS) as Proposal["channel"][];
  const channelCounts: Record<string, number> = {};
  for (const p of proposals) {
    channelCounts[p.channel] = (channelCounts[p.channel] || 0) + 1;
  }

  async function handleExport() {
    if (proposals.length === 0) {
      Alert.alert("Нет данных", "Добавьте хотя бы одно КП перед экспортом.");
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setExporting(true);

    try {
      const csv = buildCSV(proposals);
      const fileName = `VITALPLAST_КП_${new Date().toISOString().slice(0, 10)}.csv`;

      if (Platform.OS === "web") {
        // Web: trigger browser download
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        const fileUri = FileSystem.documentDirectory + fileName;
        await FileSystem.writeAsStringAsync(fileUri, csv, {
          encoding: FileSystem.EncodingType.UTF8,
        });
        const canShare = await Sharing.isAvailableAsync();
        if (canShare) {
          await Sharing.shareAsync(fileUri, {
            mimeType: "text/csv",
            dialogTitle: "Экспорт отчёта КП",
            UTI: "public.comma-separated-values-text",
          });
        } else {
          Alert.alert("Готово", `Файл сохранён: ${fileUri}`);
        }
      }
    } catch (e) {
      Alert.alert("Ошибка", "Не удалось экспортировать файл.");
    } finally {
      setExporting(false);
    }
  }

  function handleStatusChange(id: string, status: Proposal["status"]) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    updateProposal(id, { status });
  }

  function handleDelete(id: string, clientName: string) {
    Alert.alert("Удалить КП?", `Запись о предложении для ${clientName} будет удалена.`, [
      { text: "Отмена", style: "cancel" },
      {
        text: "Удалить",
        style: "destructive",
        onPress: () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          deleteProposal(id);
        },
      },
    ]);
  }

  const channelFilters: { key: Proposal["channel"] | "all"; label: string }[] = [
    { key: "all", label: "Все" },
    ...channels.map((c) => ({ key: c, label: CHANNEL_LABELS[c] })),
  ];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: Platform.OS === "web" ? 67 : 0 }]}>
        <View>
          <Text style={[styles.title, { color: colors.foreground }]}>Отчёт КП</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            {proposals.length} предложений
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.exportBtn, { backgroundColor: exporting ? colors.muted : "#16a34a" }]}
          onPress={handleExport}
          disabled={exporting}
        >
          <Feather name="download" size={18} color="#fff" />
          <Text style={styles.exportBtnText}>
            {exporting ? "..." : "Excel"}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.horizontalReports}
        contentContainerStyle={styles.reportsContent}
      >
        <View style={styles.reportCanvas}>
          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.statNum, { color: colors.primary }]}>{proposals.length}</Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Всего КП</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.statNum, { color: "#16a34a" }]}>{accepted}</Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Принято</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.statNum, { color: colors.primary }]}>
                {(totalValue / 1000).toFixed(0)}к
              </Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>₽ сумма</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.statNum, { color: "#8b5cf6" }]}>
                {proposals.length > 0 ? Math.round((accepted / proposals.length) * 100) : 0}%
              </Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Конверсия</Text>
            </View>
          </View>

          {/* Channel breakdown */}
          {proposals.length > 0 && (
            <View style={[styles.channelBreakdown, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.breakdownTitle, { color: colors.foreground }]}>По каналам</Text>
              <View style={styles.channelRow}>
                {channels
                  .filter((ch) => (channelCounts[ch] || 0) > 0)
                  .map((ch) => (
                    <View key={ch} style={[styles.channelItem, { backgroundColor: CHANNEL_COLORS[ch] + "18" }]}>
                      <Text style={[styles.channelCount, { color: CHANNEL_COLORS[ch] }]}>
                        {channelCounts[ch] || 0}
                      </Text>
                      <Text style={[styles.channelName, { color: CHANNEL_COLORS[ch] }]}>
                        {CHANNEL_LABELS[ch]}
                      </Text>
                    </View>
                  ))}
              </View>
            </View>
          )}

          {/* Filter */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator
            indicatorStyle="black"
            style={styles.filterList}
            contentContainerStyle={styles.filterContent}
          >
            {channelFilters.map((item) => (
              <TouchableOpacity
                key={item.key}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: filterChannel === item.key ? colors.primary : colors.secondary,
                    borderColor: filterChannel === item.key ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => setFilterChannel(item.key as any)}
              >
                <Text
                  style={[
                    styles.filterLabel,
                    { color: filterChannel === item.key ? "#fff" : colors.mutedForeground },
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View
            style={[
              styles.proposalList,
              styles.list,
              { paddingBottom: Platform.OS === "web" ? 34 : 90 },
            ]}
          >
            {sorted.length > 0 ? sorted.map((item) => (
              <View key={item.id} style={[styles.proposalCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.cardTop}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.clientName, { color: colors.foreground }]}>{item.clientName}</Text>
                    <Text style={[styles.company, { color: colors.mutedForeground }]}>{item.clientCompany}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleDelete(item.id, item.clientName)}
                    style={styles.deleteBtn}
                  >
                    <Feather name="trash-2" size={14} color={colors.destructive} />
                  </TouchableOpacity>
                </View>

                <View style={styles.cardMeta}>
                  <View style={[styles.channelBadge, { backgroundColor: CHANNEL_COLORS[item.channel] + "20" }]}>
                    <Feather name="send" size={11} color={CHANNEL_COLORS[item.channel]} />
                    <Text style={[styles.channelBadgeText, { color: CHANNEL_COLORS[item.channel] }]}>
                      {CHANNEL_LABELS[item.channel]}
                    </Text>
                  </View>
                  <Text style={[styles.date, { color: colors.mutedForeground }]}>
                    {formatDate(item.sentAt)}
                  </Text>
                </View>

                {item.subject ? (
                  <Text style={[styles.subject, { color: colors.foreground }]} numberOfLines={1}>
                    {item.subject}
                  </Text>
                ) : null}

                <Text style={[styles.products, { color: colors.mutedForeground }]} numberOfLines={2}>
                  {item.products.map((p) => `${p.productName} ×${p.quantity}кг`).join(", ")}
                </Text>

                <View style={styles.cardBottom}>
                  <Text style={[styles.amount, { color: colors.primary }]}>
                    {item.totalValue.toFixed(0)} ₽
                  </Text>
                  <View style={styles.statusBtns}>
                    {(["sent", "viewed", "accepted", "rejected"] as Proposal["status"][]).map((s) => (
                      <TouchableOpacity
                        key={s}
                        style={[
                          styles.statusBtn,
                          {
                            backgroundColor: item.status === s ? STATUS_COLORS[s] : STATUS_COLORS[s] + "18",
                            borderColor: STATUS_COLORS[s],
                          },
                        ]}
                        onPress={() => handleStatusChange(item.id, s)}
                      >
                        <Text
                          style={[
                            styles.statusBtnText,
                            { color: item.status === s ? "#fff" : STATUS_COLORS[s] },
                          ]}
                        >
                          {STATUS_LABELS[s]}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            )) : (
              <View style={styles.empty}>
                <Feather name="file-text" size={40} color={colors.mutedForeground} />
                <Text style={[styles.emptyTitle, { color: colors.foreground }]}>Нет КП</Text>
                <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                  Отправляйте предложения из карточек клиентов — они появятся здесь
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  horizontalReports: { flex: 1 },
  reportsContent: { paddingBottom: 100 },
  reportCanvas: { width: "100%" },
  header: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  title: { fontSize: 28, fontFamily: "Inter_700Bold" },
  subtitle: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 2 },
  exportBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  exportBtnText: { color: "#fff", fontSize: 14, fontFamily: "Inter_700Bold" },
  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 8,
  },
  statCard: {
    width: "48%",
    flexGrow: 0,
    flexShrink: 0,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    gap: 4,
  },
  statNum: { fontSize: 20, fontFamily: "Inter_700Bold" },
  statLabel: { fontSize: 10, fontFamily: "Inter_400Regular", textAlign: "center" },
  channelBreakdown: {
    marginHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginBottom: 8,
    gap: 10,
  },
  breakdownTitle: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  channelRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  channelItem: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: "center",
  },
  channelCount: { fontSize: 18, fontFamily: "Inter_700Bold" },
  channelName: { fontSize: 11, fontFamily: "Inter_500Medium" },
  filterList: { flexGrow: 0, marginBottom: 8 },
  filterContent: { paddingHorizontal: 16, gap: 8 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1 },
  filterLabel: { fontSize: 13, fontFamily: "Inter_500Medium" },
  proposalList: { width: "100%" },
  list: { paddingHorizontal: 16, gap: 10 },
  proposalCard: { borderRadius: 14, borderWidth: 1, padding: 14, gap: 10 },
  cardTop: { flexDirection: "row", alignItems: "flex-start" },
  clientName: { fontSize: 15, fontFamily: "Inter_700Bold" },
  company: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  deleteBtn: { padding: 4 },
  cardMeta: { flexDirection: "row", alignItems: "center", gap: 10 },
  channelBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  channelBadgeText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  date: { fontSize: 12, fontFamily: "Inter_400Regular" },
  subject: { fontSize: 13, fontFamily: "Inter_500Medium" },
  products: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18 },
  cardBottom: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 },
  amount: { fontSize: 18, fontFamily: "Inter_700Bold" },
  statusBtns: { flexDirection: "row", gap: 4, flexWrap: "wrap" },
  statusBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  statusBtnText: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
  empty: { alignItems: "center", marginTop: 60, gap: 10, paddingHorizontal: 30 },
  emptyTitle: { fontSize: 18, fontFamily: "Inter_600SemiBold", marginTop: 8 },
  emptyText: { fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 22 },
});