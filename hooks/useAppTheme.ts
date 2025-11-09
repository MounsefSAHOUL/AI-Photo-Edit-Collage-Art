import {useUser} from '@/stores/userStore';
import {useColorScheme} from 'react-native';

export type AppTheme = 'light' | 'dark';

export function useAppTheme() {
  const systemScheme = useColorScheme();
  const {user, setUser} = useUser();

  const resolved: AppTheme =
    (user.theme as AppTheme) ?? systemScheme ?? 'light';

  const setTheme = (theme: AppTheme | 'system') => {
    if (theme === 'system') {
      setUser({theme: 'light'});
    } else {
      setUser({theme});
    }
  };

  const toggleTheme = () => setTheme(resolved === 'dark' ? 'light' : 'dark');

  return {
    theme: resolved,
    isDark: resolved === 'dark',
    setTheme,
    toggleTheme,
  } as const;
}
