import { useEffect, type ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated, {
  type EasingFunction,
  type EasingFunctionFactory,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

type Props = {
  children: ReactNode;
  delayMs?: number;
  durationMs?: number;
  /** Starting vertical offset; animates to 0. */
  fromY?: number;
  fade?: boolean;
  easing?: EasingFunction | EasingFunctionFactory;
  style?: StyleProp<ViewStyle>;
  pointerEventsWhenHidden?: boolean;
};

// Own animation instead of Reanimated's `entering`: on web, `entering` leaves the
// element out of the flex flow once it finishes, which shifts its siblings.
export function Reveal({
  children,
  delayMs = 0,
  durationMs = 600,
  fromY = 16,
  fade = true,
  easing = Easing.out(Easing.cubic),
  style,
}: Props) {
  const t = useSharedValue(0);

  useEffect(() => {
    t.value = withDelay(delayMs, withTiming(1, { duration: durationMs, easing }));
  }, [delayMs, durationMs, easing, t]);

  const anim = useAnimatedStyle(() => ({
    opacity: fade ? t.value : 1,
    transform: [{ translateY: fromY * (1 - t.value) }],
  }));

  return <Animated.View style={[style, anim]}>{children}</Animated.View>;
}
