import React from 'react';
import Svg, {Circle, G, Path, Rect} from 'react-native-svg';

type Props = {
  size?: number;
  color?: string;
};

export default function MagicWand({size = 56, color = '#FF8A65'}: Props) {
  const handle = '#2E2A28';
  const accent = color;
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* Handle */}
      <G transform="rotate(35 24 44)">
        <Rect x={22} y={32} width={8} height={24} rx={3} fill={handle} />
        <Rect x={22.5} y={32.5} width={7} height={7} rx={2.5} fill={accent} />
      </G>
      {/* Star at the tip */}
      <Path
        d="M44 16l2.2 4.6L51 22l-4 3.8.9 5.2-4.9-2.6-4.9 2.6.9-5.2L35 22l4.8-1.4L42 16h2z"
        fill={accent}
        opacity={0.95}
      />
      {/* Spark */}
      <Circle cx={52} cy={14} r={2} fill={accent} opacity={0.6} />
      <Circle cx={38} cy={10} r={1.6} fill={accent} opacity={0.5} />
    </Svg>
  );
}
