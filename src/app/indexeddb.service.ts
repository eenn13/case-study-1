// indexeddb.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class IndexedDBService {
  private dbName = 'MyDatabase';
  private db: IDBDatabase | null = null;

  constructor() {
    this.openDB();
  }

  openDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
  
      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = request.result;
        if (!db.objectStoreNames.contains('users')) {
          db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
        }
      };
  
      request.onsuccess = () => {
        this.db = request.result;
        console.log('Database opened successfully');
        resolve(); // Başarılı durum için resolve() çağrısı
      };
  
      request.onerror = () => {
        console.error('Error opening database');
        reject(); // Hata durumunda reject() çağrısı
      };
    });
  }
  

  // Utility method to get a transaction
  private getObjectStore(storeName: string, mode: IDBTransactionMode): IDBObjectStore {
    const transaction = this.db!.transaction(storeName, mode);
    return transaction.objectStore(storeName);
  }

  addUser(user: { name: string; age: number }): Promise<void> {
    return new Promise((resolve, reject) => {
      const store = this.getObjectStore('users', 'readwrite');
      const request = store.add(user);
  
      request.onsuccess = () => {
        console.log('User added to IndexedDB');
        resolve();
      };
  
      request.onerror = () => {
        console.error('Error adding user to IndexedDB');
        reject();
      };
    });
  }

  getAllUsers(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const store = this.getObjectStore('users', 'readonly');
      const request = store.getAll();
  
      request.onsuccess = () => {
        resolve(request.result);
      };
  
      request.onerror = () => {
        console.error('Error fetching users from IndexedDB');
        reject();
      };
    });
  }
  
  updateUser(user: { id: number; name: string; age: number }): Promise<void> {
    return new Promise((resolve, reject) => {
      const store = this.getObjectStore('users', 'readwrite');
      const request = store.put(user);
  
      request.onsuccess = () => {
        console.log('User updated in IndexedDB');
        resolve();
      };
  
      request.onerror = () => {
        console.error('Error updating user in IndexedDB');
        reject();
      };
    });
  }

  deleteUser(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const store = this.getObjectStore('users', 'readwrite');
      const request = store.delete(id);
  
      request.onsuccess = () => {
        console.log('User deleted from IndexedDB');
        resolve();
      };
  
      request.onerror = () => {
        console.error('Error deleting user from IndexedDB');
        reject();
      };
    });
  }
  
  
  
}
