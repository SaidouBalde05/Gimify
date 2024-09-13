// export interface Purchase {
//   musicId: number;
//   purchaseDate: string; // ou utilisez `Date` selon vos préférences
// }


// export interface User {
//   firstName: string;
//   lastName: string;
//   id: any |number;
//   username: string;
//   password: string;
//   role: 'admin' | 'user';
//   purchasedMusicIds: number[]; // Ajoutez cette ligne
//   purchases?: Purchase[];
// }
export interface Purchase {
  musicId: number;
  purchaseDate: string; // ou utilisez `Date` selon vos préférences
}

export interface User {
  firstName: string;
  lastName: string;
  id: any | number;
  username: string;
  password: string;
  role: 'admin' | 'user';
  phoneNumber: string; // Ajoutez ce champ pour le numéro de téléphone
  purchasedMusicIds: number[];
  purchases?: Purchase[];
  profileImageUrl?: any[];
}
