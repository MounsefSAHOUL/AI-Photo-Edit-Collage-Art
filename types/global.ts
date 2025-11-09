import {
  ImageSourcePropType,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';
import type {SharedValue} from 'react-native-reanimated';

export type ToastType = 'success' | 'error' | 'info';
export type ToastItem = {id: string; opts: ToastOptions};

export type ToastOptions = {
  message: string;
  type?: ToastType;
  duration?: number; // ms
  actionLabel?: string;
  onAction?: () => void;
};

export type ToastContextType = {
  show: (opts: ToastOptions) => string;
  hide: (id: string) => void;
};

export type languageType =
  | 'fr'
  | 'en'
  | 'ar'
  | 'de'
  | 'es'
  | 'hi'
  | 'it'
  | 'ja'
  | 'nl'
  | 'pt'
  | 'ru'
  | 'zh';

export type Ctx = {
  locale: languageType;
  setLocale: (lng: languageType) => Promise<void>;
  ready: boolean;
};

export type TranslationValue = string | TranslationDictionary;
export type TranslationDictionary = {
  [key: string]: TranslationValue;
};

export type StartSpacingFn = (value: number) => {
  marginLeft?: number;
  marginRight?: number;
};

export type LocaleFonts = {
  heading: string;
  body: string;
  accent: string;
  label: string;
};

export type LocaleAppearance = {
  locale: languageType;
  setLocale: (lng: languageType) => Promise<void>;
  ready: boolean;
  isRTL: boolean;
  textAlign: 'left' | 'right';
  writingDirection: 'ltr' | 'rtl';
  rowDirection: 'row' | 'row-reverse';
  startSpacing: StartSpacingFn;
  fonts: LocaleFonts;
};

export type CarouselImageProps = {
  source: ImageSourcePropType;
  index: number;
  width: number;
  height: number;
  viewportWidth: number;
  viewportHeight: number;
  currentIndex: SharedValue<number>;
  previousIndex: SharedValue<number>;
  transition: SharedValue<number>;
  drift: SharedValue<number>;
};

export type BackgroundCarouselProps = {
  images?: ImageSourcePropType[];
  interval?: number;
  transitionDuration?: number;
  overlayColor?: string | null;
  driftDistance?: number;
};

export type GateButtonVariant = 'primary' | 'success' | 'neutral';
export type GateButtonPalette = {backgroundColor: string; shadow?: string};

export type GateButtonProps = {
  label: string;
  onPress?: () => void | Promise<void>;
  disabled?: boolean;
  variant?: GateButtonVariant;
  backgroundColor?: string;
  shadowColor?: string;
  textColor?: string;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  leftAccessory?: boolean;
  rightAccessory?: boolean;
};

export type Option<T extends string> = {label: string; value: T; flag?: string};

export type Props<T extends string> = {
  label?: string;
  value?: T;
  options: Option<T>[];
  onChange: (v: T) => void;
  onOpen?: () => void;
  onClose?: () => void;
  tone?: 'default' | 'gate';
};

export type MusicToggleButtonProps = {
  muted: boolean;
  onToggle: () => void;
  topOffset?: number;
  rightOffset?: number;
  style?: StyleProp<ViewStyle>;
};

export type TabShineProps = {
  width?: number;
  height?: number;
  duration?: number;
  colors?: string[]; // gradient colors for the shine
  style?: any;
};

export type Particle = {
  size: number;
  duration: number;
  opacity: number;
  color: string;
  left: number;
  top: number;
};

export type GridLayout = {
  id: string;
  name: string;
  shape?:
    | 'rect'
    | 'heart'
    | 'clover'
    | 'hexagon'
    | 'circle'
    | 'pentagon'
    | 'heptagon'
    | 'octagon'
    | 'nonagon'
    | 'decagon';
  rows: number;
  cols: number;
  layout: number[][];
  // optional mask definition (SVG path) to use for non-rectangular shapes
  mask?: {
    type: 'svg';
    // path string suitable for an SVG <Path d="..." /> (coordinates are relative to viewBox you choose)
    path: string;
    // optional viewBox size to interpret the path coordinates (defaults to 100)
    viewBoxSize?: number;
  };
  // optional translation key for the layout name (e.g. 'grids.grid-02.name')
  nameKey?: string;
};
