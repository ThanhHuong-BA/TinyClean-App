import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GradientButton } from './GradientButton';
import { colors } from '../theme';
import {
  DEMO_OPTION,
  questions,
  type OnboardingResult,
} from '../onboarding';

type Props = {
  visible: boolean;
  onClose: () => void;
  onDone: (result: OnboardingResult) => void;
};

const SHEET_MS = 350;
const slideEase = Easing.bezier(0.2, 0.9, 0.3, 1);

function Icon({ d }: { d: string }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path d={d} stroke={colors.textSubtle} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function OnboardingSheet({ visible, onClose, onDone }: Props) {
  const insets = useSafeAreaInsets();
  const [mounted, setMounted] = useState(visible);
  const [step, setStep] = useState<0 | 1>(0);
  const [answers, setAnswers] = useState<[number | null, number | null]>([null, null]);
  const progress = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      setStep(0);
      progress.value = withTiming(1, { duration: SHEET_MS, easing: slideEase });
    } else {
      progress.value = withTiming(0, { duration: 250 });
      const id = setTimeout(() => setMounted(false), 260);
      return () => clearTimeout(id);
    }
  }, [visible, progress]);

  const backdrop = useAnimatedStyle(() => ({ opacity: progress.value }));
  const sheet = useAnimatedStyle(() => ({
    transform: [{ translateY: (1 - progress.value) * 600 }],
  }));

  const q = questions[step];
  const selected = answers[step];

  const select = (i: number) =>
    setAnswers((a) => (step === 0 ? [i, a[1]] : [a[0], i]));

  const next = () => {
    if (step === 0) {
      setStep(1);
      return;
    }
    if (answers[0] == null || answers[1] == null) return;
    onDone({
      stage: answers[0],
      mode: answers[1] === DEMO_OPTION ? 'demo' : 'onboard',
    });
  };

  return (
    <Modal visible={mounted} transparent animationType="none" onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.fill}>
        <Animated.View style={[styles.backdrop, backdrop]}>
          <Pressable style={styles.fill} onPress={onClose} accessibilityLabel="Đóng" />
        </Animated.View>
        <Animated.View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 12) }, sheet]}>
          <View style={styles.grab} />
          <Animated.View
            key={step}
            entering={() => {
              'worklet';
              return {
                initialValues: { opacity: 0, transform: [{ translateX: step === 1 ? 24 : 0 }] },
                animations: {
                  opacity: withTiming(1, { duration: 300 }),
                  transform: [{ translateX: withTiming(0, { duration: 300 }) }],
                },
              };
            }}
          >
            <View style={styles.header}>
              {step === 1 && (
                <Pressable style={[styles.iconBtn, { marginLeft: -8, marginRight: 0 }]} onPress={() => setStep(0)} accessibilityLabel="Quay lại">
                  <Icon d="M15 6l-6 6 6 6" />
                </Pressable>
              )}
              <Text style={styles.title}>{q.title}</Text>
              <Pressable style={[styles.iconBtn, { marginRight: -6 }]} onPress={onClose} accessibilityLabel="Đóng">
                <Icon d="M6 6l12 12M18 6L6 18" />
              </Pressable>
            </View>
            <Text style={styles.desc}>{q.description}</Text>
            <View style={styles.options}>
              {q.options.map((o, i) => {
                const on = selected === i;
                return (
                  <Pressable
                    key={o.title}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: on }}
                    onPress={() => select(i)}
                    style={[styles.option, on && styles.optionOn]}
                  >
                    <View style={[styles.radio, on && styles.radioOn]} />
                    <View style={styles.optionText}>
                      <Text style={styles.optionTitle}>{o.title}</Text>
                      <Text style={styles.optionHint}>{o.hint}</Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
            <GradientButton label={q.cta} disabled={selected == null} onPress={next} />
          </Animated.View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  backdrop: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(24,24,27,.45)' },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 8,
    paddingHorizontal: 16,
  },
  grab: {
    width: 40,
    height: 4,
    borderRadius: 4,
    backgroundColor: 'rgb(228,228,231)',
    alignSelf: 'center',
    marginBottom: 16,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { flex: 1, fontSize: 18, fontWeight: '700', lineHeight: 24, color: colors.text },
  iconBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  desc: { fontSize: 14, lineHeight: 21, color: colors.textMuted, marginTop: 6, marginBottom: 20 },
  options: { gap: 10, marginBottom: 24 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 14,
    backgroundColor: '#fff',
  },
  optionOn: { borderColor: colors.aqua, backgroundColor: 'rgba(0,200,202,.06)' },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: 'rgb(212,212,216)' },
  radioOn: { borderWidth: 6, borderColor: colors.aqua },
  optionText: { flex: 1, minWidth: 0 },
  optionTitle: { fontSize: 15, lineHeight: 20, fontWeight: '600', color: colors.text },
  optionHint: { fontSize: 13, lineHeight: 18, color: colors.textSubtle, marginTop: 4 },
});
