import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { brandGradient, colors } from '../theme';

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  /** Looping light sweep across the button (welcome CTA). */
  shine?: boolean;
  shineDelayMs?: number;
};

const SHINE_SWEEP_MS = 1200;
const SHINE_PAUSE_MS = 1800;

export function GradientButton({ label, onPress, disabled, shine, shineDelayMs = 2200 }: Props) {
  const x = useSharedValue(-1);

  useEffect(() => {
    if (!shine || disabled) return;
    x.value = -1;
    x.value = withDelay(
      shineDelayMs,
      withRepeat(
        withSequence(
          withTiming(1, { duration: SHINE_SWEEP_MS, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: SHINE_PAUSE_MS }),
          withTiming(-1, { duration: 0 }),
        ),
        -1,
      ),
    );
  }, [shine, disabled, shineDelayMs, x]);

  const shineStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value * 200 }, { skewX: '-20deg' }],
  }));

  return (
    <View style={[styles.shadow, disabled && styles.noShadow]}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: !!disabled }}
        disabled={disabled}
        onPress={onPress}
        style={styles.clip}
      >
        {disabled ? (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.disabled }]} />
        ) : (
          <LinearGradient
            colors={brandGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        )}
        {shine && !disabled && (
          <Animated.View pointerEvents="none" style={[styles.shine, shineStyle]}>
            <LinearGradient
              colors={['rgba(255,255,255,0)', 'rgba(255,255,255,.45)', 'rgba(255,255,255,0)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
        )}
        <Text style={styles.label}>{label}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    borderRadius: 999,
    shadowColor: '#00C8CA',
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
    backgroundColor: 'transparent',
  },
  noShadow: { shadowOpacity: 0, elevation: 0 },
  clip: {
    height: 48,
    borderRadius: 999,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shine: { position: 'absolute', top: 0, bottom: 0, left: '35%', width: '30%' },
  label: { color: '#fff', fontSize: 17, fontWeight: '600' },
});
