import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Confetti } from '../components/Confetti';
import { FeatureRow } from '../components/FeatureRow';
import { GradientButton } from '../components/GradientButton';
import { OnboardingSheet } from '../components/OnboardingSheet';
import { Reveal } from '../components/Reveal';
import { features, type OnboardingResult } from '../onboarding';
import { colors } from '../theme';

// Timings from the final design (option E), in seconds.
const FIRST_ROW_AT = 0.9;
const ROW_STEP = 0.4;
const CTA_AT = 3.4;
const HEADER_HEIGHT = 176;

/** Logo pop: scale .4 → 1 with overshoot, 700ms. */
function PopLogo() {
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withTiming(1, { duration: 700, easing: Easing.bezier(0.3, 1.5, 0.5, 1) });
  }, [t]);
  const style = useAnimatedStyle(() => ({
    opacity: Math.min(1, t.value * 4),
    transform: [{ scale: 0.4 + 0.6 * t.value }],
  }));
  return (
    <Animated.View style={[styles.logo, style]}>
      <Image source={require('../../assets/tinyclean-logo.png')} style={styles.logoImg} resizeMode="contain" />
    </Animated.View>
  );
}

type Props = { onStart: (result: OnboardingResult) => void };

export function WelcomeScreen({ onStart }: Props) {
  const insets = useSafeAreaInsets();
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      {/* Brand gradient fades to teal, then plain white behind the sheet. */}
      <LinearGradient
        colors={[colors.cyan, colors.aqua, colors.teal, colors.teal]}
        locations={[0, 0.4, 0.755, 1]}
        style={[styles.bg, { height: insets.top + 365 }]}
      />

      <View style={[styles.top, { paddingTop: insets.top, height: insets.top + HEADER_HEIGHT }]}>
        <Confetti />
        <PopLogo />
        <Reveal delayMs={300} style={styles.textBlock}>
          <Text style={styles.h1}>Chào mừng đến với TinyClean</Text>
        </Reveal>
        <Reveal delayMs={400} style={styles.textBlock}>
          <Text style={styles.sub}>Phần mềm quản lý chuyên biệt cho tiệm giặt</Text>
        </Reveal>
      </View>

      <Reveal
        delayMs={200}
        durationMs={700}
        fromY={600}
        fade={false}
        easing={Easing.bezier(0.2, 0.9, 0.3, 1)}
        style={styles.sheet}
      >
        <Text style={styles.sheetTitle}>Mọi thứ đã sẵn sàng cho tiệm của bạn</Text>
        <ScrollView style={styles.list} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
          {features.map((f, i) => (
            <FeatureRow
              key={f.key}
              icon={f.key}
              text={f.text}
              revealAt={FIRST_ROW_AT + i * ROW_STEP}
              last={i === features.length - 1}
            />
          ))}
        </ScrollView>

        <Reveal
          delayMs={CTA_AT * 1000}
          style={[styles.foot, { paddingBottom: Math.max(insets.bottom, 12) }]}
        >
          <GradientButton shine label="Bắt đầu quản lý" onPress={() => setSheetOpen(true)} />
        </Reveal>
      </Reveal>

      <OnboardingSheet
        visible={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onDone={(r) => {
          setSheetOpen(false);
          onStart(r);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  bg: { position: 'absolute', top: 0, left: 0, right: 0 },
  top: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 18,
    overflow: 'hidden',
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    flexShrink: 0,
    shadowColor: '#005A64',
    shadowOpacity: 0.22,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  logoImg: { width: 42, height: 42 },
  textBlock: { alignSelf: 'stretch', flexShrink: 0 },
  h1: { fontSize: 24, lineHeight: 30, fontWeight: '700', color: '#fff', textAlign: 'center' },
  sub: { fontSize: 15, color: '#fff', marginTop: 6, textAlign: 'center' },
  sheet: {
    flex: 1,
    minHeight: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
  },
  sheetTitle: {
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 4,
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  list: { flex: 1, minHeight: 0 },
  listContent: { paddingHorizontal: 20 },
  foot: { paddingTop: 10, paddingHorizontal: 16, backgroundColor: '#fff' },
});
