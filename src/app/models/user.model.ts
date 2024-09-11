export interface Purchase {
  musicId: number;
  purchaseDate: string; // ou utilisez `Date` selon vos préférences
}


export interface User {
  firstName: string;
  lastName: string;
  id: any |number;
  username: string;
  password: string;
  role: 'admin' | 'user';
  purchasedMusicIds: number[]; // Ajoutez cette ligne
  purchases?: Purchase[];
}
  