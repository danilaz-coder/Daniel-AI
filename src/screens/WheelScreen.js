import React, { useRef, useState } from 'react';
import { Alert, Animated, Easing, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Svg, { Circle, Path, Text as SvgText } from 'react-native-svg';
import { COLORS } from '../styles/colors';
import { common } from '../styles/common';

const WHEEL_SIZE = 320;
const CENTER = WHEEL_SIZE / 2;
const RADIUS = 153;
const SECTOR_ANGLE = 360 / 7;

const AGENTS = [
  { id: 'jarvis', name: 'JARVIS', color: '#0878f9' },
  { id: 'artemis', name: 'ARTEMIS', color: '#7257d8' },
  { id: 'grok', name: 'GROK', color: '#ed812e' },
  { id: 'daniel', name: 'DANIEL', color: '#159b79' },
  { id: 'kimi', name: 'KIMI', color: '#d35483' },
  { id: 'littlebird', name: 'Little bird', color: '#3284bd' },
  { id: 'openviking', name: 'OPENVIKING', color: '#168c91' },
];

function polarPoint(radius, degrees) {
  const radians = (degrees * Math.PI) / 180;
  return {
    x: CENTER + radius * Math.cos(radians),
    y: CENTER + radius * Math.sin(radians),
  };
}

function sectorPath(index) {
  const startAngle = -90 + index * SECTOR_ANGLE;
  const endAngle = startAngle + SECTOR_ANGLE;
  const start = polarPoint(RADIUS, startAngle);
  const end = polarPoint(RADIUS, endAngle);

  return `M ${CENTER} ${CENTER} L ${start.x} ${start.y} A ${RADIUS} ${RADIUS} 0 0 1 ${end.x} ${end.y} Z`;
}

export default function WheelScreen({ onNavigate, onSelectAgent }) {
  const { width: windowWidth } = useWindowDimensions();
  const wheelSize = Math.min(WHEEL_SIZE, windowWidth - 64);
  const rotation = useRef(new Animated.Value(0)).current;
  const [rotationTarget, setRotationTarget] = useState(360);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const rotate = rotation.interpolate({
    inputRange: [0, rotationTarget],
    outputRange: ['0deg', `${rotationTarget}deg`],
  });

  const spinWheel = () => {
    if (isSpinning) return;

    const winnerIndex = Math.floor(Math.random() * AGENTS.length);
    const winner = AGENTS[winnerIndex];
    const degreesToWinner = (360 - (winnerIndex + 0.5) * SECTOR_ANGLE + 360) % 360;
    const target = 360 * 5 + degreesToWinner;

    setSelectedAgent(null);
    setRotationTarget(target);
    rotation.setValue(0);
    setIsSpinning(true);

    Animated.timing(rotation, {
      toValue: target,
      duration: 4800,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      setIsSpinning(false);
      if (!finished) return;

      setSelectedAgent(winner);
      Alert.alert(
        'Колесо Фортуны',
        `Выпал агент ${winner.name}. Перейти в чат с ним?`,
        [
          { text: 'Остаться', style: 'cancel' },
          {
            text: 'Перейти в чат',
            onPress: () => {
              onSelectAgent(winner.name);
              onNavigate('help');
            },
          },
        ]
      );
    });
  };

  return (
    <ScrollView contentContainerStyle={common.screenContent} showsVerticalScrollIndicator={false}>
      <View style={common.pageIntro}>
        <Text style={common.eyebrow}>СЛУЧАЙНЫЙ ВЫБОР</Text>
        <Text style={common.pageTitle}>Колесо Фортуны</Text>
        <Text style={common.pageSubtitle}>Не знаете, к кому обратиться? Доверьте выбор колесу.</Text>
      </View>

      <View style={styles.wheelCard}>
        <View style={[styles.wheelWrap, { width: wheelSize, height: wheelSize }]}>
          <View style={styles.pointer} />
          <Animated.View style={[styles.wheel, { width: wheelSize, height: wheelSize, transform: [{ rotate }] }]}>
            <Svg width={wheelSize} height={wheelSize} viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`}>
              {AGENTS.map((agent, index) => {
                const labelPosition = polarPoint(101, -90 + (index + 0.5) * SECTOR_ANGLE);
                const fontSize = agent.name === 'OPENVIKING' ? 8 : agent.name === 'Little bird' ? 9 : 10;

                return (
                  <React.Fragment key={agent.id}>
                    <Path d={sectorPath(index)} fill={agent.color} stroke="#ffffff" strokeWidth="2" />
                    <SvgText
                      x={labelPosition.x}
                      y={labelPosition.y}
                      fill="#ffffff"
                      fontSize={fontSize}
                      fontWeight="700"
                      textAnchor="middle"
                      alignmentBaseline="middle"
                    >
                      {agent.name}
                    </SvgText>
                  </React.Fragment>
                );
              })}
              <Circle cx={CENTER} cy={CENTER} r="29" fill="#ffffff" />
              <Circle cx={CENTER} cy={CENTER} r="23" fill={COLORS.ink} />
              <SvgText
                x={CENTER}
                y={CENTER + 1}
                fill="#ffffff"
                fontSize="16"
                fontWeight="800"
                textAnchor="middle"
                alignmentBaseline="middle"
              >
                V
              </SvgText>
            </Svg>
          </Animated.View>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: isSpinning }}
          disabled={isSpinning}
          onPress={spinWheel}
          style={({ pressed }) => [
            styles.spinButton,
            pressed && !isSpinning && styles.spinButtonPressed,
            isSpinning && styles.spinButtonDisabled,
          ]}
        >
          <Text style={styles.spinButtonText}>{isSpinning ? 'Крутим...' : 'Крутить'}</Text>
        </Pressable>

        {selectedAgent ? (
          <View style={styles.result}>
            <View style={[styles.resultDot, { backgroundColor: selectedAgent.color }]} />
            <Text style={styles.resultText}>Выбран агент {selectedAgent.name}</Text>
          </View>
        ) : (
          <Text style={styles.hint}>На колесе — 7 ИИ-агентов MAIN EVENT</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wheelCard: { alignItems: 'center', paddingHorizontal: 10, paddingTop: 16, paddingBottom: 20, borderRadius: 22, backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.line },
  wheelWrap: { width: WHEEL_SIZE, height: WHEEL_SIZE, maxWidth: '100%', alignItems: 'center', justifyContent: 'center', marginTop: 8, marginBottom: 20 },
  wheel: { width: WHEEL_SIZE, height: WHEEL_SIZE, alignItems: 'center', justifyContent: 'center' },
  pointer: { position: 'absolute', top: -1, zIndex: 2, width: 0, height: 0, borderLeftWidth: 13, borderRightWidth: 13, borderTopWidth: 25, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: COLORS.ink },
  spinButton: { minWidth: 180, minHeight: 50, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28, borderRadius: 15, backgroundColor: COLORS.blue, shadowColor: COLORS.blue, shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.22, shadowRadius: 10, elevation: 4 },
  spinButtonPressed: { opacity: 0.82, transform: [{ scale: 0.98 }] },
  spinButtonDisabled: { opacity: 0.72 },
  spinButtonText: { color: COLORS.white, fontSize: 14, fontWeight: '800' },
  hint: { marginTop: 13, color: COLORS.muted, fontSize: 10, textAlign: 'center' },
  result: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 13 },
  resultDot: { width: 8, height: 8, borderRadius: 4 },
  resultText: { color: COLORS.ink, fontSize: 10, fontWeight: '700' },
});
