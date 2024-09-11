export interface Music {
  id: string | any;  // Changez ici pour `string`
  title: string;
  description: string;
  imageUrl: string;
  audioFiles: string[];
  artist: string;
  releaseDate: Date;
  sales?: number; 
  price: number; 
  personalRevenue: number; 
  totalPersonalRevenue?: number; // Ajoutez cette propriété pour suivre le revenu total
}

export interface Purchase {
  id: number | any;
  userId: string;  // Changez ici pour `string`
  musicId: string; // Changez ici pour `string`
  musicTitle: string;
  date: string;
  price: number; 
  personalRevenue: number; 
}




// export interface Music {
//   id: string | any;
//   title: string | any;
//   description: string;
//   imageUrl: string;
//   audioFiles: string[];
//   artist: string;
//   releaseDate: Date;
//   sales?: number; 
//   price: number; 
//   personalRevenue: number; 
//   totalPersonalRevenue: number; // Ajoutez cette propriété pour suivre le revenu total
// };

// export interface Purchase {
//   id: number;
//   userId: number;
//   musicId: number;
//   musicTitle: string;
//   date: string;
// }


  