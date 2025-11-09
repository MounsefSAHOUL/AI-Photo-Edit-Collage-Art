import {ImageItem, ImageStore} from '@/types/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';

const DEFAULT_IMAGE: ImageItem = {
  id: undefined,
  name: '',
  type: '',
  uri: '',
  createdAt: undefined,
  favorite: false,
  tags: [],
};

export const useImageStore = create<ImageStore>()(
  persist(
    set => ({
      img: DEFAULT_IMAGE,
      allImages: [],
      hydrate: false,
      setImage: (img: Partial<ImageItem>) =>
        set(state => ({img: {...state.img, ...img}})),
      resetImage: () => set(() => ({img: DEFAULT_IMAGE})),
      setAllImages: (imgs: ImageItem[] | ImageItem) =>
        set(state => ({
          allImages: Array.isArray(imgs) ? imgs : [...state.allImages, imgs],
        })),
      toggleFavorite: (id: string) =>
        set(state => {
          const updatedImages = state.allImages.map(img =>
            img.id === id ? {...img, favorite: !img.favorite} : img,
          );

          return {allImages: updatedImages};
        }),
      deleteImage: (id: string) =>
        set(state => ({
          allImages: state.allImages.filter(img => img.id !== id),
        })),
      // append a single image (convenience method)
      addImage: (img: Partial<ImageItem> | ImageItem) =>
        set(state => {
          const newItem: ImageItem = {
            id: (img as ImageItem).id ?? Date.now().toString(),
            name: (img as ImageItem).name ?? '',
            type: (img as ImageItem).type ?? 'free',
            uri: (img as ImageItem).uri ?? '',
            createdAt: (img as ImageItem).createdAt ?? new Date().toISOString(),
            favorite: (img as ImageItem).favorite ?? false,
            tags: (img as ImageItem).tags ?? [],
          };

          return {allImages: [...state.allImages, newItem]};
        }),
      resetAllImages: () => set(() => ({allImages: []})),
      setHydrate: h => set(() => ({hydrate: h})),
    }),
    {
      name: 'image-storage', // clé AsyncStorage
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => () => {
        // Indicate that hydration finished so UI can react if needed
        useImageStore.setState({hydrate: true});
      },
    },
  ),
);
