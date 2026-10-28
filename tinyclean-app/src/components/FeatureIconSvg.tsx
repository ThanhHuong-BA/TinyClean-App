import Svg, { Circle, Path } from 'react-native-svg';
import { filledIcons } from './iconData';
import type { FeatureIcon } from '../onboarding';

type Props = { name: FeatureIcon; size?: number; color: string };

export function FeatureIconSvg({ name, size = 20, color }: Props) {
  if (name === 'camera') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M4 8h3l1.5-2h7L17 8h3v11H4z" />
        <Circle cx={12} cy={13} r={3.5} />
      </Svg>
    );
  }
  if (name === 'bell') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z" />
        <Path d="M10 21h4" />
      </Svg>
    );
  }
  const icon = filledIcons[name];
  return (
    <Svg width={size} height={size} viewBox={icon.viewBox} fill="none">
      {icon.paths.map((p, i) => (
        <Path key={i} d={p.d} fill={color} fillRule={p.evenOdd ? 'evenodd' : 'nonzero'} />
      ))}
    </Svg>
  );
}
