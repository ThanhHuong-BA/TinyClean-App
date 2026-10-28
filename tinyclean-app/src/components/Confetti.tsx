import { useEffect, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const PIECE_COUNT = 28;
const FALL_FROM = -30;
const FALL_TO = 300;
const COLORS = ['#FFFFFF', 'rgba(255,255,255,.7)', '#BFF6FF', '#C9FFEC', '#007F80'];

type Piece = { left: string; color: string; width: number; durationMs: number; phase: number };

function Confetto({ piece }: { piece: Piece }) {
  const t = useSharedValue(piece.phase);

  useEffect(() => {
    // Start part-way through the fall (the design uses a negative animation-delay).
    t.value = withRepeat(
      withTiming(1, {
        duration: piece.durationMs * (1 - piece.phase),
        easing: Easing.linear,
      }),
      1,
      false,
      (finished) => {
        'worklet';
        if (finished) {
          t.value = 0;
          t.value = withRepeat(
            withTiming(1, { duration: piece.durationMs, easing: Easing.linear }),
            -1,
            false,
          );
        }
      },
    );
    return () => cancelAnimation(t);
  }, [piece, t]);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: FALL_FROM + (FALL_TO - FALL_FROM) * t.value },
      { rotate: `${540 * t.value}deg` },
    ],
  }));

  return (
    <Animated.View
      style={[
        styles.piece,
        { left: piece.left as `${number}%`, width: piece.width, backgroundColor: piece.color },
        style,
      ]}
    />
  );
}

export function Confetti() {
  const pieces = useMemo<Piece[]>(
    () =>
      Array.from({ length: PIECE_COUNT }, (_, i) => ({
        left: `${Math.random() * 100}%`,
        color: COLORS[i % COLORS.length],
        width: 5 + Math.random() * 6,
        durationMs: (2.6 + Math.random() * 2.4) * 1000,
        phase: Math.random() * 0.8,
      })),
    [],
  );

  return (
    <>
      {pieces.map((p, i) => (
        <Confetto key={i} piece={p} />
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  piece: { position: 'absolute', top: -20, height: 12, borderRadius: 2, opacity: 0.95 },
});
