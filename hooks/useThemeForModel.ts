import {Colors} from '@/constants/theme';
import {ModelId} from '@/types/models';

export function useThemeForModel(id: ModelId | string) {
  const key = id as keyof typeof Colors;
  return Colors[key] ?? Colors.default;
}
