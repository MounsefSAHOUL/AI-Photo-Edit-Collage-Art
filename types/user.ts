import {languageType} from './global';

export type User = {
  displayName?: string;
  avatar?: string; // URL ou chemin vers l'image de profil
  lang?: languageType;
  theme?: string;
  notification?: boolean;
  vibration?: boolean;
  sound?: boolean;
  points?: number; // compte de points/générations
  lastPointsRefreshAt?: string; // ISO date de la dernière recharge mensuelle
  membership?: 'premium' | 'freemium';
};

export type UserState = {
  user: User;
  hydrate: boolean;
  setUser: (u: Partial<User>) => void;
  resetUser: () => void;
  setHydrate: (h: boolean) => void;
  refreshDailyPoints: () => void;
  /** Recompute membership based on points (>5 => premium; otherwise freemium) */
  syncMembership: () => void;
};

// Minimal image item shape used in the store (keeps it independent from user types)
export type ImageItem = {
  id?: string;
  name?: string;
  type?: string;
  uri: string;
  createdAt?: string;
  favorite?: boolean;
  tags?: string[];
};

export type ImageStore = {
  img: ImageItem;
  allImages: ImageItem[];
  hydrate: boolean;
  setImage: (img: Partial<ImageItem>) => void;
  resetImage: () => void;
  toggleFavorite: (id: string) => void;
  deleteImage: (id: string) => void;
  /**
   * Set all images or append a single image. If passed a single ImageItem, it will be appended
   * to the existing list. If passed an array, it will replace the list.
   */
  setAllImages: (imgs: ImageItem[] | ImageItem) => void;
  resetAllImages: () => void;
  /** Append a single image safely */
  addImage: (img: ImageItem | Partial<ImageItem>) => void;
  setHydrate: (h: boolean) => void;
};
