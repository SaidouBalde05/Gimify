export interface Music {
  id?: number;
  title: string | any;
  description: string;
  imageUrl: string;
  audioFiles: string[];
  artist: string;
  sales?: number; // Nombre de ventes
}


// export interface Music {
//   id?: number;
//   title: string;
//   description: string;
//   imageUrl: string;
//   audioFiles: string[]; // Un tableau de fichiers audio
//   artist: string;
//   salesCount?: number; // Nouveau champ pour compter les ventes
// }
  