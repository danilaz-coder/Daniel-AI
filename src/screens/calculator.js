import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
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

import { useApp } from "@/contexts/AppContext";
import { useColors } from "@/hooks/useColors";
import { useLang } from "@/contexts/LanguageContext";
import { getUnitLabel, localizeProduct } from "@/i18n/productTranslations";

interface LineItem {
  id: string;
  productId: string;
  quantity: string;
}

export default function CalculatorScreen() {
  const colors = useColors();
  const { products } = useApp();
  const { t, lang } = useLang();
  const [items, setItems] = useState<LineItem[]>([
    { id: "1", productId: products[0]?.id ?? "", quantity: "" },
  ]);
  const [discount, setDiscount] = useState("0");
  const [margin, setMargin] = useState("15");

  function addItem() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setItems((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        productId: products[0]?.id ?? "",
        quantity: "",
      },
    ]);
  }

  function removeItem(id: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function updateItem(id: string, field: keyof LineItem, value: string) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  }

  function selectNextProduct(id: string) {
    const currentIdx = items.findIndex((i) => i.id === id);
    const currentProductIdx = products.findIndex(
      (p) => p.id === items[currentIdx].productId
    );
    const nextProduct = products[(currentProductIdx + 1) % products.length];
    updateItem(id, "productId", nextProduct.id);
  }

  const subtotal = items.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId);
    const qty = parseFloat(item.quantity) || 0;
    return sum + (product?.pricePerKg ?? 0) * qty;
  }, 0);

  const discountAmount = subtotal * (parseFloat(discount) / 100 || 0);
  const afterDiscount = subtotal - discountAmount;
  const marginAmount = afterDiscount * (parseFloat(margin) / 100 || 0);
  const total = afterDiscount + marginAmount;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: Platform.OS === "web" ? 67 : 0, paddingBottom: Platform.OS === "web" ? 34 : 90 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.title, { color: colors.foreground }]}>{t.calculatorTitle}</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          {t.orderCalc}
        </Text>

        {items.map((item, idx) => {
          const product = products.find((p) => p.id === item.productId);
          const qty = parseFloat(item.quantity) || 0;
          const lineTotal = (product?.pricePerKg ?? 0) * qty;

          return (
            <View
              key={item.id}
              style={[styles.lineCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <View style={styles.lineHeader}>
                <Text style={[styles.lineNum, { color: colors.mutedForeground }]}>
                  Позиция {idx + 1}
                </Text>
                {items.length > 1 && (
                  <TouchableOpacity onPress={() => removeItem(item.id)}>
                    <Feather name="trash-2" size={16} color={colors.destructive} />
                  </TouchableOpacity>
                )}
              </View>

              <TouchableOpacity
                style={[styles.productPicker, { backgroundColor: colors.secondary, borderColor: colors.border }]}
                onPress={() => selectNextProduct(item.id)}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[styles.productName, { color: colors.foreground }]}>
                  {product ? localizeProduct(product, lang).name : t.selectProduct}
                  </Text>
                  <Text style={[styles.productPrice, { color: colors.mutedForeground }]}>
                    {product?.pricePerKg} ₽/{product ? getUnitLabel(product.unit, lang) : "kg"} · {product?.article}
                  </Text>
                </View>
                <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
              </TouchableOpacity>

              <View style={styles.qtyRow}>
                <View style={[styles.inputWrap, { borderColor: colors.border, backgroundColor: colors.card }]}>
                  <TextInput
                    style={[styles.qtyInput, { color: colors.foreground }]}
                    placeholder="Кол-во (кг)"
                    placeholderTextColor={colors.mutedForeground}
                    keyboardType="decimal-pad"
                    value={item.quantity}
                    onChangeText={(v) => updateItem(item.id, "quantity", v)}
                  />
                  <Text style={[styles.unitLabel, { color: colors.mutedForeground }]}>
                    {product?.unit ?? "кг"}
                  </Text>
                </View>
                <View style={[styles.lineTotalBox, { backgroundColor: colors.primary + "18" }]}>
                  <Text style={[styles.lineTotalLabel, { color: colors.primary }]}>
                    {lineTotal.toFixed(0)} ₽
                  </Text>
                </View>
              </View>
            </View>
          );
        })}

        <TouchableOpacity
          style={[styles.addBtn, { borderColor: colors.primary }]}
          onPress={addItem}
        >
          <Feather name="plus" size={16} color={colors.primary} />
          <Text style={[styles.addBtnText, { color: colors.primary }]}>Добавить позицию</Text>
        </TouchableOpacity>

        <View style={[styles.settingsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.settingsTitle, { color: colors.foreground }]}>Параметры цены</Text>
          <View style={styles.settingsRow}>
            <Text style={[styles.settingsLabel, { color: colors.mutedForeground }]}>Скидка (%)</Text>
            <TextInput
              style={[styles.settingsInput, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.secondary }]}
              keyboardType="decimal-pad"
              value={discount}
              onChangeText={setDiscount}
            />
          </View>
          <View style={styles.settingsRow}>
            <Text style={[styles.settingsLabel, { color: colors.mutedForeground }]}>Наценка (%)</Text>
            <TextInput
              style={[styles.settingsInput, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.secondary }]}
              keyboardType="decimal-pad"
              value={margin}
              onChangeText={setMargin}
            />
          </View>
        </View>

        <View style={[styles.totalCard, { backgroundColor: colors.primary }]}>
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { color: "rgba(255,255,255,0.7)" }]}>Подытог</Text>
            <Text style={[styles.totalValue, { color: "#fff" }]}>{subtotal.toFixed(0)} ₽</Text>
          </View>
          {parseFloat(discount) > 0 && (
            <View style={styles.totalRow}>
              <Text style={[styles.totalLabel, { color: "rgba(255,255,255,0.7)" }]}>
                Скидка {discount}%
              </Text>
              <Text style={[styles.totalValue, { color: "rgba(255,255,255,0.85)" }]}>
                −{discountAmount.toFixed(0)} ₽
              </Text>
            </View>
          )}
          {parseFloat(margin) > 0 && (
            <View style={styles.totalRow}>
              <Text style={[styles.totalLabel, { color: "rgba(255,255,255,0.7)" }]}>
                Наценка {margin}%
              </Text>
              <Text style={[styles.totalValue, { color: "rgba(255,255,255,0.85)" }]}>
                +{marginAmount.toFixed(0)} ₽
              </Text>
            </View>
          )}
          <View style={[styles.totalRow, styles.totalFinalRow]}>
            <Text style={styles.totalFinalLabel}>Итого</Text>
            <Text style={styles.totalFinalValue}>{total.toFixed(0)} ₽</Text>
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
  lineCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    gap: 10,
  },
  lineHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lineNum: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
  productPicker: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  productName: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  productPrice: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  qtyRow: {
    flexDirection: "row",
    gap: 10,
  },
  inputWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  qtyInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Inter_500Medium",
    padding: 0,
  },
  unitLabel: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  lineTotalBox: {
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
  },
  lineTotalLabel: {
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
  settingsCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  settingsTitle: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 4,
  },
  settingsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  settingsLabel: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  settingsInput: {
    width: 80,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    textAlign: "center",
  },
  totalCard: {
    borderRadius: 16,
    padding: 20,
    gap: 12,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  totalValue: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  totalFinalRow: {
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.3)",
    paddingTop: 12,
    marginTop: 4,
  },
  totalFinalLabel: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    color: "#fff",
  },
  totalFinalValue: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
    color: "#fff",
  },
});