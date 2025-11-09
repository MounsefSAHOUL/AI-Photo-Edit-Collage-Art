import React from 'react';
import Svg, {Path} from 'react-native-svg';

type Props = {
  size?: number;
  color?: string;
  opacity?: number;
};

export default function Sparkle({
  size = 18,
  color = '#FF9A7A',
  opacity = 0.8,
}: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 2l2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6z"
        fill={color}
        opacity={opacity}
      />
    </Svg>
  );
}
