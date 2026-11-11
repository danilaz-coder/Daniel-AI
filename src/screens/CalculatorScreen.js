import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

function parseAmount(value) {
  const normalized = value.trim().replace(',', '.');
  if (!normalized) return null;

  const amount = Number(normalized);
  return Number.isFinite(amount) ? amount : null;
}

function formatCurrency(value) {
  return `${value.toLocaleString('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ₽`;
}

function NumberField({ label, value, onChangeText, placeholder, suffix, colors, error, accessibilityLabel }) {
  return (
    <View style={styles.field}>
      <Text style={[styles.fieldLabel, { color: colors.muted }]}>{label}</Text>
      <View
        style={[
          styles.inputShell,
          { backgroundColor: colors.white, borderColor: error ? '#dc2626' : colors.line },
        ]}
      >
        <TextInput
          accessibilityLabel={accessibilityLabel || label}
          style={[styles.input, { color: colors.ink }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.muted}
          keyboardType="decimal-pad"
          returnKeyType="done"
        />
        {suffix ? <Text style={[styles.suffix, { color: colors.muted }]}>{suffix}</Text> : null}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

export default function CalculatorScreen() {
  const { colors } = useTheme();
  const [weight, setWeight] = useState('');
  const [pricePerKg, setPricePerKg] = useState('');
  const [discount, setDiscount] = useState('0');

  const calculation = useMemo(() => {
    const parsedWeight = parseAmount(weight);
    const parsedPrice = parseAmount(pricePerKg);
    const parsedDiscount = parseAmount(discount);

    const weightError = parsedWeight !== null && parsedWeight < 0
      ? 'Вес не может быть отрицательным.'
      : null;
    const priceError = parsedPrice !== null && parsedPrice < 0
      ? 'Цена не может быть отрицательной.'
      : null;
    const discountError = parsedDiscount !== null && (parsedDiscount < 0 || parsedDiscount > 100)
      ? 'Укажите скидку от 0 до 100%.'
      : null;

    const hasErrors = Boolean(weightError || priceError || discountError);
    const canCalculate = parsedWeight !== null
      && parsedPrice !== null
      && parsedDiscount !== null
      && !hasErrors;
    const subtotal = canCalculate ? parsedWeight * parsedPrice : null;
    const discountAmount = subtotal === null ? null : subtotal * parsedDiscount / 100;
    const total = subtotal === null ? null : subtotal - discountAmount;

    return {
      weightError,
      priceError,
      discountError,
      subtotal,
      discountAmount,
      total,
    };
  }, [discount, pricePerKg, weight]);

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: colors.canvas }}
    >
      <View style={styles.heading}>
        <Text style={[styles.eyebrow, { color: colors.blue }]}>РАСЧЁТ ЗАКАЗА</Text>
        <Text style={[styles.title, { color: colors.ink }]}>Калькулятор</Text>
        <Text style={[styles.subtitle, { color: colors.muted }]}>
          Рассчитайте стоимость Vinavil 2428 с учётом скидки.
        </Text>
      </View>

      <View style={[styles.productCard, { backgroundColor: colors.white, borderColor: colors.line }]}>
        <View style={[styles.productIcon, { backgroundColor: colors.pale }]}>
          <Text style={[styles.productIconText, { color: colors.blue }]}>V</Text>
        </View>
        <View style={styles.productCopy}>
          <Text style={[styles.productLabel, { color: colors.muted }]}>ПРОДУКТ</Text>
          <Text style={[styles.productName, { color: colors.ink }]}>Vinavil 2428</Text>
          <Text style={[styles.productDescription, { color: colors.muted }]}>
            Цена за кг указывается вручную
          </Text>
        </View>
      </View>

      <View style={[styles.formCard, { backgroundColor: colors.white, borderColor: colors.line }]}>
        <Text style={[styles.sectionTitle, { color: colors.ink }]}>Параметры заказа</Text>
        <NumberField
          label="Вес"
          value={weight}
          onChangeText={setWeight}
          placeholder="Например, 250"
          suffix="кг"
          colors={colors}
          error={calculation.weightError}
          accessibilityLabel="Вес Vinavil 2428 в килограммах"
        />
        <NumberField
          label="Цена за килограмм"
          value={pricePerKg}
          onChangeText={setPricePerKg}
          placeholder="Введите цену"
          suffix="₽/кг"
          colors={colors}
          error={calculation.priceError}
        />
        <NumberField
          label="Скидка"
          value={discount}
          onChangeText={setDiscount}
          placeholder="0"
          suffix="%"
          colors={colors}
          error={calculation.discountError}
        />
      </View>

      <View style={[styles.totalCard, { backgroundColor: colors.white, borderColor: colors.line }]}>
        <Text style={[styles.sectionTitle, { color: colors.ink }]}>Стоимость заказа</Text>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.muted }]}>Вес</Text>
          <Text style={[styles.summaryValue, { color: colors.ink }]}>
            {calculation.subtotal === null ? '—' : `${weight} кг`}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.muted }]}>Стоимость до скидки</Text>
          <Text style={[styles.summaryValue, { color: colors.ink }]}>
            {calculation.subtotal === null ? '—' : formatCurrency(calculation.subtotal)}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.muted }]}>Скидка</Text>
          <Text style={[styles.discountValue, { color: colors.green }]}>
            {calculation.discountAmount === null ? '—' : `−${formatCurrency(calculation.discountAmount)}`}
          </Text>
        </View>
        <View style={[styles.totalDivider, { borderColor: colors.line }]} />
        <View style={styles.finalRow}>
          <Text style={[styles.finalLabel, { color: colors.ink }]}>Итого</Text>
          <Text style={[styles.finalValue, { color: colors.blue }]}>
            {calculation.total === null ? '—' : formatCurrency(calculation.total)}
          </Text>
        </View>
        {calculation.total === null ? (
          <Text style={[styles.hint, { color: colors.muted }]}>
            Введите вес и цену за килограмм, чтобы увидеть расчёт.
          </Text>
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
  productCard: { flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 18, borderWidth: 1 },
  productIcon: { width: 46, height: 46, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  productIconText: { fontSize: 22, fontWeight: '900' },
  productCopy: { flex: 1, marginLeft: 12 },
  productLabel: { fontSize: 8, fontWeight: '800', letterSpacing: 1.1 },
  productName: { marginTop: 4, fontSize: 15, fontWeight: '800' },
  productDescription: { marginTop: 3, fontSize: 10 },
  formCard: { padding: 16, borderRadius: 18, borderWidth: 1, gap: 14 },
  sectionTitle: { marginBottom: 2, fontSize: 14, fontWeight: '800' },
  field: { gap: 6 },
  fieldLabel: { fontSize: 10, fontWeight: '700' },
  inputShell: { minHeight: 48, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1, flexDirection: 'row', alignItems: 'center' },
  input: { flex: 1, paddingVertical: 10, fontSize: 14, fontWeight: '600' },
  suffix: { marginLeft: 8, fontSize: 11, fontWeight: '600' },
  errorText: { color: '#dc2626', fontSize: 10 },
  totalCard: { padding: 16, borderRadius: 18, borderWidth: 1, gap: 14 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  summaryLabel: { flex: 1, fontSize: 11 },
  summaryValue: { fontSize: 11, fontWeight: '700', textAlign: 'right' },
  discountValue: { fontSize: 11, fontWeight: '700', textAlign: 'right' },
  totalDivider: { borderTopWidth: 1, marginTop: 2 },
  finalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  finalLabel: { fontSize: 14, fontWeight: '800' },
  finalValue: { fontSize: 19, fontWeight: '900' },
  hint: { fontSize: 10, lineHeight: 15 },
});
