import { Injectable } from '@angular/core';

export interface Publication {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  audioFiles: string[];
  artist: string;
}

@Injectable({
  providedIn: 'root'
})
export class PublicationService {

  private publicationsKey = 'publications';
  private publications: Publication[] = [];

  constructor() {}

  getPublications(): Publication[] {
    return this.publications;
  }

  addPublication(publication: Publication): void {
    this.publications.push(publication);
  }

  private savePublications() {
    try {
      localStorage.setItem(this.publicationsKey, JSON.stringify(this.publications));
    } catch (e: any) {
      if (e.name === 'QuotaExceededError') {
        this.savePublicationsToIndexedDB();
      } else {
        console.error('Could not save publications:', e);
      }
    }
  }

  private loadPublications() {
    const storedPublications = localStorage.getItem(this.publicationsKey);
    if (storedPublications) {
      this.publications = JSON.parse(storedPublications);
    } else {
      this.loadPublicationsFromIndexedDB();
    }
  }

  private savePublicationsToIndexedDB() {
    const dbRequest = indexedDB.open('PublicationsDB', 1);

    dbRequest.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('publications')) {
        db.createObjectStore('publications', { keyPath: 'id', autoIncrement: true });
      }
    };

    dbRequest.onsuccess = () => {
      const db = dbRequest.result;
      const transaction = db.transaction('publications', 'readwrite');
      const store = transaction.objectStore('publications');
      store.clear();
      this.publications.forEach(pub => store.add(pub));
    };

    dbRequest.onerror = (event) => {
      console.error('IndexedDB error:', event);
    };
  }

  private loadPublicationsFromIndexedDB() {
    const dbRequest = indexedDB.open('PublicationsDB', 1);

    dbRequest.onsuccess = () => {
      const db = dbRequest.result;
      const transaction = db.transaction('publications', 'readonly');
      const store = transaction.objectStore('publications');
      const request = store.getAll();

      request.onsuccess = () => {
        this.publications = request.result || [];
      };
    };

    dbRequest.onerror = (event) => {
      console.error('IndexedDB error:', event);
    };
  }

    // private publicationsKey = 'publications';

    // constructor() {
    //   this.loadPublications();
    // }
  
    // private publications: any[] = [];
  
    // addPublication(publication: any) {
    //   this.publications.push(publication);
    //   this.savePublications();
    // }
  
    // getPublications() {
    //   return this.publications;
    // }
  
    // private savePublications() {
    //   localStorage.setItem(this.publicationsKey, JSON.stringify(this.publications));
    // }
  
    // private loadPublications() {
    //   const storedPublications = localStorage.getItem(this.publicationsKey);
    //   if (storedPublications) {
    //     this.publications = JSON.parse(storedPublications);
    //   }
    // }

}
