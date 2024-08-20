import { Injectable } from '@angular/core';
import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Music } from '../models/music.model';

interface MyDB extends DBSchema {
  publications: {
    key: number;
    value: Music;
    indexes: { 'by-id': number };
  };
}

@Injectable({
  providedIn: 'root'
})
export class IndexedDbService {
  private dbPromise: Promise<IDBPDatabase<MyDB>>;

  constructor() {
    this.dbPromise = openDB<MyDB>('MyDatabase', 2, { // Assurez-vous que la version est correcte
      upgrade(db) {
        if (!db.objectStoreNames.contains('publications')) {
          const store = db.createObjectStore('publications', {
            keyPath: 'id',
            autoIncrement: true
          });
          store.createIndex('by-id', 'id');
        }
      }
    });
  }

  // Méthode pour ajouter une nouvelle publication
  async addPublication(publication: Omit<Music, 'id'>): Promise<number> {
    const db = await this.dbPromise;
    const id = await db.add('publications', publication);
    return id;
  }

  // Méthode pour récupérer toutes les publications
  async getPublications(): Promise<Music[]> {
    const db = await this.dbPromise;
    return await db.getAll('publications');
  }

  // Nouvelle méthode pour récupérer une publication par ID
  async getPublicationById(id: number): Promise<Music | undefined> {
    const db = await this.dbPromise;
    return await db.get('publications', id);
  }
}


// import { Injectable } from '@angular/core';
// import { openDB, DBSchema, IDBPDatabase } from 'idb';
// import { Music } from '../models/music.model';

// interface MyDB extends DBSchema {
//   publications: {
//     key: number;
//     value: Music;
//     indexes: { 'by-id': number };
//   };
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class IndexedDbService {
//   private dbPromise: Promise<IDBPDatabase<MyDB>>;

//   constructor() {
//     this.dbPromise = openDB<MyDB>('MyDatabase', 1, {
//       upgrade(db) {
//         const store = db.createObjectStore('publications', {
//           keyPath: 'id',
//           autoIncrement: true
//         });
//         store.createIndex('by-id', 'id');
//       }
//     });
//   }

//   // Méthode pour ajouter une nouvelle publication
//   async addPublication(publication: Omit<Music, 'id'>): Promise<number> {
//     const db = await this.dbPromise;
//     const id = await db.add('publications', publication);
//     return id;
//   }

//   // Méthode pour récupérer toutes les publications
//   async getPublications(): Promise<Music[]> {
//     const db = await this.dbPromise;
//     return await db.getAll('publications');
//   }

//   // Nouvelle méthode pour récupérer une publication par ID
//   async getPublicationById(id: number): Promise<Music | undefined> {
//     const db = await this.dbPromise;
//     return await db.get('publications', id);
//   }
// }