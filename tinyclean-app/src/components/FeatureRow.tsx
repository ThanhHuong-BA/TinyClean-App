import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { useEffect } from 'react';
import { FeatureIconSvg } from './FeatureIconSvg';
import { colors } from '../theme';
import type { FeatureIcon } from '../onboarding';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const CHECK_LEN = 16;
const ease = Easing.out(Easing.cubic);

type Props = {
  icon: FeatureIcon;
  text: string;
  /** Seconds after mount at which this row's check completes its reveal. */
  revealAt: number;
  last: boolean;
};

export function FeatureRow({ icon, text, revealAt, last }: Props) {
  const rowIn = useSharedValue(0);
  const ckFill = useSharedValue(0);
  const ckDraw = useSharedValue(0);

  useEffect(() => {
    const ms = revealAt * 1000;
    rowIn.value = withDelay(ms - 100, withTiming(1, { duration: 550, easing: ease }));
    ckFill.value = withDelay(ms + 250, withTiming(1, { duration: 400 }));
    ckDraw.value = withDelay(ms + 400, withTiming(1, { duration: 450 }));
  }, [revealAt, rowIn, ckFill, ckDraw]);

  const rowStyle = useAnimatedStyle(() => ({
    opacity: rowIn.value,
    transform: [{ translateY: 16 * (1 - rowIn.value) }],
  }));
  const ckStyle = useAnimatedStyle(() => ({
    backgroundColor: `rgba(0,200,150,${ckFill.value})`,
    borderColor: ckFill.value > 0.5 ? colors.teal : 'rgb(214,240,240)',
  }));
  const pathProps = useAnimatedProps(() => ({
    strokeDashoffset: CHECK_LEN * (1 - ckDraw.value),
  }));

  return (
    <Animated.View style={[styles.row, !last && styles.divider, rowStyle]}>
      <View style={styles.icon}>
        <FeatureIconSvg name={icon} size={20} color={colors.aqua} />
      </View>
      <Text style={styles.text}>{text}</Text>
      <Animated.View style={[styles.check, ckStyle]}>
        <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
          <AnimatedPath
            d="M3 7.2l2.6 2.6L11 4.4"
            stroke="#fff"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={CHECK_LEN}
            animatedProps={pathProps}
          />
        </Svg>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 13 },
  divider: { borderBottomWidth: 1, borderBottomColor: colors.divider },
  icon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(0,200,202,.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flex: 1, minWidth: 0, fontSize: 14, lineHeight: 19.6, color: colors.text },
  check: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgb(214,240,240)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
