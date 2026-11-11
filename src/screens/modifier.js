import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useColors } from "@/hooks/useColors";

interface ComponentRow {
  id: string;
  name: string;
  percent: string;
  density: string;
}

const PRESET_COMPONENTS = [
  { name: "ПЭНД (базовый)", density: "0.95" },
  { name: "ПЭВД (мягкий)", density: "0.92" },
  { name: "Polykom 101", density: "0.91" },
  { name: "Vinavil 2428", density: "1.06" },
  { name: "Pigment Blue 15.3", density: "1.39" },
  { name: "TiO2 пигмент", density: "3.90" },
  { name: "Стабилизатор УФ", density: "1.02" },
  { name: "Антиоксидант", density: "1.05" },
];

const PROPERTY_THRESHOLDS = {
  melt: { good: [160, 210], label: "Температура плавления (°C)" },
  tensile: { good: [15, 40], label: "Прочность на разрыв (МПа)" },
  elongation: { good: [300, 900], label: "Относительное удлинение (%)" },
};

export default function ModifierScreen() {
  const colors = useColors();
  const [components, setComponents] = useState<ComponentRow[]>([
    { id: "1", name: "ПЭНД (базовый)", percent: "90", density: "0.95" },
    { id: "2", name: "Polykom 101", percent: "5", density: "0.91" },
    { id: "3", name: "Pigment Blue 15.3", percent: "5", density: "1.39" },
  ]);
  const [totalMass, setTotalMass] = useState("1000");

  function addComponent() {
    setComponents((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: PRESET_COMPONENTS[prev.length % PRESET_COMPONENTS.length].name,
        percent: "0",
        density: PRESET_COMPONENTS[prev.length % PRESET_COMPONENTS.length].density,
      },
    ]);
  }

  function removeComponent(id: string) {
    setComponents((prev) => prev.filter((c) => c.id !== id));
  }

  function updateComponent(id: string, field: keyof ComponentRow, value: string) {
    setComponents((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  }

  function cyclePreset(id: string) {
    const comp = components.find((c) => c.id === id);
    if (!comp) return;
    const idx = PRESET_COMPONENTS.findIndex((p) => p.name === comp.name);
    const next = PRESET_COMPONENTS[(idx + 1) % PRESET_COMPONENTS.length];
    setComponents((prev) =>
      prev.map((c) => (c.id === id ? { ...c, name: next.name, density: next.density } : c))
    );
  }

  const totalPercent = components.reduce((s, c) => s + (parseFloat(c.percent) || 0), 0);
  const totalMassNum = parseFloat(totalMass) || 1000;

  const avgDensity =
    components.reduce((s, c) => {
      const pct = (parseFloat(c.percent) || 0) / 100;
      const den = parseFloat(c.density) || 1;
      return s + pct / den;
    }, 0);
  const resultDensity = avgDensity > 0 ? (1 / avgDensity).toFixed(3) : "—";

  const meltTemp = (
    components.reduce((s, c) => {
      const pct = (parseFloat(c.percent) || 0) / 100;
      return s + (c.name.includes("ПЭВД") ? 115 : c.name.includes("Polykom") ? 125 : 135) * pct;
    }, 0)
  ).toFixed(1);

  function statusColor(val: number, range: [number, number]) {
    if (val >= range[0] && val <= range[1]) return colors.success;
    if (val < range[0] * 0.8 || val > range[1] * 1.2) return colors.destructive;
    return colors.warning;
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: Platform.OS === "web" ? 67 : 0, paddingBottom: Platform.OS === "web" ? 34 : 90 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.title, { color: colors.foreground }]}>Модификатор</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          Расчёт состава полиэтилена
        </Text>

        <View style={[styles.massCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
            Общая масса партии (кг)
          </Text>
          <TextInput
            style={[styles.massInput, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.secondary }]}
            keyboardType="decimal-pad"
            value={totalMass}
            onChangeText={setTotalMass}
          />
        </View>

        <View style={styles.compHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Компоненты</Text>
          <View
            style={[
              styles.percentTotal,
              {
                backgroundColor: Math.abs(totalPercent - 100) < 0.1 ? colors.success + "22" : colors.warning + "22",
              },
            ]}
          >
            <Text
              style={[
                styles.percentTotalText,
                { color: Math.abs(totalPercent - 100) < 0.1 ? colors.success : colors.warning },
              ]}
            >
              {totalPercent.toFixed(1)}%
            </Text>
          </View>
        </View>

        {components.map((comp, idx) => {
          const pct = parseFloat(comp.percent) || 0;
          const mass = ((pct / 100) * totalMassNum).toFixed(1);

          return (
            <View
              key={comp.id}
              style={[styles.compCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <View style={styles.compRow}>
                <TouchableOpacity
                  style={[styles.compNameBox, { backgroundColor: colors.secondary, borderColor: colors.border }]}
                  onPress={() => cyclePreset(comp.id)}
                >
                  <Text style={[styles.compName, { color: colors.foreground }]} numberOfLines={1}>
                    {comp.name}
                  </Text>
                  <Feather name="chevron-down" size={12} color={colors.mutedForeground} />
                </TouchableOpacity>
                {components.length > 1 && (
                  <TouchableOpacity onPress={() => removeComponent(comp.id)} style={styles.removeBtn}>
                    <Feather name="x" size={14} color={colors.destructive} />
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.compInputRow}>
                <View style={styles.compField}>
                  <Text style={[styles.compFieldLabel, { color: colors.mutedForeground }]}>% масс</Text>
                  <TextInput
                    style={[styles.compInput, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.secondary }]}
                    keyboardType="decimal-pad"
                    value={comp.percent}
                    onChangeText={(v) => updateComponent(comp.id, "percent", v)}
                  />
                </View>
                <View style={styles.compField}>
                  <Text style={[styles.compFieldLabel, { color: colors.mutedForeground }]}>Плотность</Text>
                  <TextInput
                    style={[styles.compInput, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.secondary }]}
                    keyboardType="decimal-pad"
                    value={comp.density}
                    onChangeText={(v) => updateComponent(comp.id, "density", v)}
                  />
                </View>
                <View style={[styles.compMass, { backgroundColor: colors.primary + "18" }]}>
                  <Text style={[styles.compMassLabel, { color: colors.mutedForeground }]}>кг</Text>
                  <Text style={[styles.compMassValue, { color: colors.primary }]}>{mass}</Text>
                </View>
              </View>
            </View>
          );
        })}

        <TouchableOpacity
          style={[styles.addBtn, { borderColor: colors.primary }]}
          onPress={addComponent}
        >
          <Feather name="plus" size={16} color={colors.primary} />
          <Text style={[styles.addBtnText, { color: colors.primary }]}>Добавить компонент</Text>
        </TouchableOpacity>

        <View style={[styles.resultsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.resultsTitle, { color: colors.foreground }]}>Результаты расчёта</Text>

          <View style={styles.resultRow}>
            <Text style={[styles.resultLabel, { color: colors.mutedForeground }]}>
              Плотность смеси
            </Text>
            <Text style={[styles.resultValue, { color: colors.foreground }]}>
              {resultDensity} г/см³
            </Text>
          </View>

          <View style={styles.resultRow}>
            <Text style={[styles.resultLabel, { color: colors.mutedForeground }]}>
              Темп. плавления
            </Text>
            <Text style={[styles.resultValue, { color: colors.foreground }]}>
              ~{meltTemp} °C
            </Text>
          </View>

          <View style={styles.resultRow}>
            <Text style={[styles.resultLabel, { color: colors.mutedForeground }]}>
              Общая масса
            </Text>
            <Text style={[styles.resultValue, { color: colors.foreground }]}>
              {totalMassNum} кг
            </Text>
          </View>

          <View
            style={[
              styles.validRow,
              {
                backgroundColor:
                  Math.abs(totalPercent - 100) < 0.1 ? colors.success + "18" : colors.warning + "18",
              },
            ]}
          >
            <Feather
              name={Math.abs(totalPercent - 100) < 0.1 ? "check-circle" : "alert-triangle"}
              size={16}
              color={Math.abs(totalPercent - 100) < 0.1 ? colors.success : colors.warning}
            />
            <Text
              style={[
                styles.validText,
                { color: Math.abs(totalPercent - 100) < 0.1 ? colors.success : colors.warning },
              ]}
            >
              {Math.abs(totalPercent - 100) < 0.1
                ? "Состав сбалансирован (100%)"
                : `Сумма компонентов: ${totalPercent.toFixed(1)}% (требуется 100%)`}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: {
    paddingHorizontal: 16,
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    marginBottom: 4,
  },
  massCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionLabel: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    flex: 1,
  },
  massInput: {
    width: 100,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    textAlign: "center",
  },
  compHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: "Inter_600SemiBold",
  },
  percentTotal: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  percentTotalText: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
  },
  compCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    gap: 10,
  },
  compRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  compNameBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  compName: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    flex: 1,
  },
  removeBtn: {
    padding: 4,
  },
  compInputRow: {
    flexDirection: "row",
    gap: 8,
  },
  compField: {
    flex: 1,
    gap: 4,
  },
  compFieldLabel: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
  compInput: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    textAlign: "center",
  },
  compMass: {
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    minWidth: 60,
    gap: 2,
  },
  compMassLabel: {
    fontSize: 10,
    fontFamily: "Inter_400Regular",
  },
  compMassValue: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    borderWidth: 1.5,
    borderStyle: "dashed",
    paddingVertical: 14,
    gap: 8,
  },
  addBtnText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  resultsCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  resultsTitle: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 4,
  },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  resultLabel: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  resultValue: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  validRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 8,
    padding: 12,
    marginTop: 4,
  },
  validText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    flex: 1,
  },
});