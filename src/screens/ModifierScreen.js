import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const INITIAL_COMPONENTS = [
  { id: 'pehd', name: 'ПЭНД', percent: '90', density: '0.95' },
  { id: 'polykom', name: 'Поликом 101', percent: '5', density: '0.91' },
  { id: 'pigment', name: 'Pigment Blue 15.3', percent: '5', density: '1.39' },
];

function parseAmount(value) {
  const normalized = value.trim().replace(',', '.');
  if (!/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(normalized)) return null;

  const amount = Number(normalized);
  return Number.isFinite(amount) ? amount : null;
}

function calculateMixture(components) {
  const parsed = components.map((component) => ({
    ...component,
    parsedPercent: parseAmount(component.percent),
    parsedDensity: parseAmount(component.density),
  }));
  const totalPercent = parsed.reduce((sum, component) => sum + (component.parsedPercent ?? 0), 0);
  const invalidPercent = parsed.some((component) => (
    component.parsedPercent === null || component.parsedPercent < 0 || component.parsedPercent > 100
  ));
  const invalidDensity = parsed.some((component) => (
    component.parsedDensity === null || component.parsedDensity <= 0
  ));
  const percentagesMatch = Math.abs(totalPercent - 100) < 0.000001;
  const valid = !invalidPercent && !invalidDensity && percentagesMatch;

  const density = valid
    ? 1 / parsed.reduce(
      (sum, component) => sum + (component.parsedPercent / 100) / component.parsedDensity,
      0,
    )
    : null;

  return { totalPercent, invalidPercent, invalidDensity, percentagesMatch, density };
}

function NumberField({ label, value, onChangeText, suffix, colors, accessibilityLabel }) {
  return (
    <View style={styles.field}>
      <Text style={[styles.fieldLabel, { color: colors.muted }]}>{label}</Text>
      <View style={[styles.inputShell, { backgroundColor: colors.white, borderColor: colors.line }]}>
        <TextInput
          accessibilityLabel={accessibilityLabel || label}
          style={[styles.input, { color: colors.ink }]}
          value={value}
          onChangeText={onChangeText}
          keyboardType="decimal-pad"
          returnKeyType="done"
          placeholder="0"
          placeholderTextColor={colors.muted}
        />
        <Text style={[styles.suffix, { color: colors.muted }]}>{suffix}</Text>
      </View>
    </View>
  );
}

export default function ModifierScreen() {
  const { colors } = useTheme();
  const [components, setComponents] = useState(INITIAL_COMPONENTS);

  const calculation = useMemo(() => calculateMixture(components), [components]);

  function updateComponent(id, field, value) {
    setComponents((current) => current.map((component) => (
      component.id === id ? { ...component, [field]: value } : component
    )));
  }

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: colors.canvas }}
    >
      <View style={styles.heading}>
        <Text style={[styles.eyebrow, { color: colors.blue }]}>СОСТАВ МАТЕРИАЛА</Text>
        <Text style={[styles.title, { color: colors.ink }]}>Модификатор</Text>
        <Text style={[styles.subtitle, { color: colors.muted }]}>
          Укажите массовую долю и плотность каждого компонента.
        </Text>
      </View>

      <View style={styles.componentList}>
        {components.map((component, index) => (
          <View
            key={component.id}
            style={[styles.componentCard, { backgroundColor: colors.white, borderColor: colors.line }]}
          >
            <View style={styles.componentHeader}>
              <View style={[styles.componentIndex, { backgroundColor: colors.pale }]}>
                <Text style={[styles.componentIndexText, { color: colors.blue }]}>{index + 1}</Text>
              </View>
              <Text style={[styles.componentName, { color: colors.ink }]}>{component.name}</Text>
            </View>
            <View style={styles.componentFields}>
              <NumberField
                label="Доля"
                value={component.percent}
                onChangeText={(value) => updateComponent(component.id, 'percent', value)}
                suffix="%"
                colors={colors}
                accessibilityLabel={`${component.name}: процент в смеси`}
              />
              <NumberField
                label="Плотность"
                value={component.density}
                onChangeText={(value) => updateComponent(component.id, 'density', value)}
                suffix="г/см³"
                colors={colors}
                accessibilityLabel={`${component.name}: плотность`}
              />
            </View>
          </View>
        ))}
      </View>

      <View style={[styles.totalCard, { backgroundColor: colors.white, borderColor: colors.line }]}>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.muted }]}>Сумма долей</Text>
          <Text
            style={[
              styles.summaryValue,
              { color: calculation.percentagesMatch && !calculation.invalidPercent ? colors.green : colors.ink },
            ]}
          >
            {calculation.totalPercent.toLocaleString('ru-RU', { maximumFractionDigits: 2 })}%
          </Text>
        </View>

        <View style={[styles.totalDivider, { borderColor: colors.line }]} />

        <Text style={[styles.resultLabel, { color: colors.muted }]}>Итоговая плотность смеси</Text>
        <View style={styles.resultRow}>
          <Text style={[styles.resultValue, { color: colors.blue }]}>
            {calculation.density === null
              ? '—'
              : calculation.density.toLocaleString('ru-RU', { minimumFractionDigits: 3, maximumFractionDigits: 3 })}
          </Text>
          <Text style={[styles.resultUnit, { color: colors.ink }]}>г/см³</Text>
        </View>

        {calculation.invalidPercent ? (
          <Text style={styles.errorText}>Для каждого компонента укажите долю от 0 до 100%.</Text>
        ) : !calculation.percentagesMatch ? (
          <Text style={[styles.hint, { color: colors.muted }]}>
            Сумма массовых долей должна составлять 100%.
          </Text>
        ) : calculation.invalidDensity ? (
          <Text style={styles.errorText}>Плотность каждого компонента должна быть больше нуля.</Text>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 18, paddingBottom: 30, gap: 14 },
  heading: { marginTop: 8, marginBottom: 2 },
  eyebrow: { fontSize: 9, fontWeight: '800', letterSpacing: 1.25 },
  title: { marginTop: 6, fontSize: 27, fontWeight: '800', letterSpacing: -0.6 },
  subtitle: { marginTop: 5, fontSize: 11, lineHeight: 16 },
  componentList: { gap: 10 },
  componentCard: { padding: 14, borderRadius: 18, borderWidth: 1, gap: 14 },
  componentHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  componentIndex: { width: 30, height: 30, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  componentIndexText: { fontSize: 12, fontWeight: '800' },
  componentName: { fontSize: 13, fontWeight: '800' },
  componentFields: { flexDirection: 'row', gap: 10 },
  field: { flex: 1, gap: 6 },
  fieldLabel: { fontSize: 10, fontWeight: '700' },
  inputShell: { minHeight: 44, paddingHorizontal: 10, borderRadius: 11, borderWidth: 1, flexDirection: 'row', alignItems: 'center' },
  input: { flex: 1, minWidth: 0, paddingVertical: 8, fontSize: 13, fontWeight: '600' },
  suffix: { marginLeft: 5, fontSize: 9, fontWeight: '600' },
  totalCard: { padding: 16, borderRadius: 18, borderWidth: 1, gap: 12 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { fontSize: 11 },
  summaryValue: { fontSize: 12, fontWeight: '800' },
  totalDivider: { borderTopWidth: 1, marginTop: 2 },
  resultLabel: { fontSize: 11, fontWeight: '600' },
  resultRow: { flexDirection: 'row', alignItems: 'baseline', gap: 7 },
  resultValue: { fontSize: 30, fontWeight: '900', letterSpacing: -0.7 },
  resultUnit: { fontSize: 12, fontWeight: '700' },
  hint: { fontSize: 10, lineHeight: 15 },
  errorText: { color: '#dc2626', fontSize: 10, lineHeight: 15 },
});
