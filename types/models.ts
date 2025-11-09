export type ModelId =
  | 'actionFigure'
  | 'funkoPop'
  | 'lego'
  | 'barbieDoll'
  | 'tradingCard'
  | 'sportsCard'
  | 'gameCover'
  | 'magazineCover'
  | 'diorama'
  | 'plush'
  | 'claymation'
  | 'pixelSprite'
  | 'lowpolyToy'
  | 'mascot'
  | 'albumCover'
  | 'idolPhotocard'
  | 'lookbook'
  | 'petFigure'
  | 'wantedPatch'
  | 'acrylic';

export type ModelConfig = {
  id: ModelId;
  name: string;
  description: string;
  image?: any;
  // options simples pour l’UI
  variants?: string[]; // ex: super-héros / gamer / ninja…
  outputs?: string[]; // ex: PNG, JPEG, carré, A4…
};
