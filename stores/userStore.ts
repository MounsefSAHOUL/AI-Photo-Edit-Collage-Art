import {UserState} from '@/types/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';

export const useUser = create<UserState>()(
  persist(
    set => ({
      user: {
        points: 5,
        lastPointsRefreshAt: new Date().toISOString(),
        membership: 'freemium',
      },
      hydrate: false,
      syncMembership: () =>
        set(state => {
          const pts = state.user.points ?? 0;
          const membership = pts > 5 ? 'premium' : 'freemium';
          return {user: {...state.user, membership}};
        }),
      setUser: u => set(state => ({user: {...state.user, ...u}})),
      resetUser: () =>
        set({
          user: {
            points: 5,
            lastPointsRefreshAt: new Date().toISOString(),
            membership: 'freemium',
          },
        }),
      setHydrate: h => set({hydrate: h}),
      refreshDailyPoints: () =>
        set(state => {
          // Daily refill logic:
          // - If membership === 'premium' -> do not change points, but mark the day as checked.
          // - If membership === 'freemium' -> each day, if points < 5, reset to 5; otherwise just mark the day as checked.
          const now = new Date();
          const last = state.user.lastPointsRefreshAt
            ? new Date(state.user.lastPointsRefreshAt)
            : null;
          const dayKey = (d: Date) =>
            `${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}`;
          const needsRefill = !last || dayKey(now) !== dayKey(last);

          // Nothing to do if already processed today
          if (!needsRefill) return state as any;

          const membership = state.user.membership ?? 'freemium';

          // For premium users:
          // - if points < 5 -> reset to 5 and downgrade to 'freemium'
          // - otherwise don't modify points, but mark the day processed
          if (membership === 'premium') {
            const currentPremium = state.user.points ?? 0;
            if (currentPremium < 5) {
              return {
                user: {
                  ...state.user,
                  points: 5,
                  membership: 'freemium',
                  lastPointsRefreshAt: now.toISOString(),
                },
              };
            }

            return {
              user: {
                ...state.user,
                lastPointsRefreshAt: now.toISOString(),
              },
            };
          }

          // For freemium users: ensure points are at least 5 each day
          const current = state.user.points ?? 0;
          if (current < 5) {
            return {
              user: {
                ...state.user,
                points: 5,
                lastPointsRefreshAt: now.toISOString(),
              },
            };
          }

          // If points >= 5, just mark the day as processed
          return {
            user: {
              ...state.user,
              lastPointsRefreshAt: now.toISOString(),
            },
          } as any;
        }),
    }),
    {
      name: 'user-storage', // clé AsyncStorage
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => () => {
        // Daily refill check after hydration
        useUser.getState().refreshDailyPoints();
        // Sync membership with points after refill
        try {
          useUser.getState().syncMembership();
        } catch {}
        // Mark hydration as completed
        useUser.setState({hydrate: true});
      },
    },
  ),
);
