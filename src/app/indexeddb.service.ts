// indexeddb.service.ts
import { Injectable } from '@angular/core';
import { Company, CompanyCreateDto } from './models/company.model';
import { Employee, EmployeeCreateDto } from './models/employee.model';

@Injectable({
  providedIn: 'root',
})
export class IndexedDBService {
  private dbName = 'CaseStudyDB';
  private db: IDBDatabase | null = null;

  constructor() {
    this.openDB();
  }

  openDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
  
      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = request.result;
  
        // Companies tablosunu oluştur
        if (!db.objectStoreNames.contains('companies')) {
          db.createObjectStore('companies', { keyPath: 'id', autoIncrement: true });
        }
  
        // Employees tablosunu oluştur ve company_id alanı ekle
        if (!db.objectStoreNames.contains('employees')) {
          const employeeStore = db.createObjectStore('employees', { keyPath: 'id', autoIncrement: true });
          employeeStore.createIndex('company_id', 'company_id', { unique: false });
          employeeStore.createIndex('name', 'name', { unique: false }); // İsim alanı üzerinde indeks
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

  addCompany(company: CompanyCreateDto): Promise<void> {
    return new Promise((resolve, reject) => {
      const store = this.getObjectStore('companies', 'readwrite');
      const request = store.add(company);
  
      request.onsuccess = () => {
        console.log('Company added to IndexedDB');
        resolve();
      };
  
      request.onerror = () => {
        console.error('Error adding company to IndexedDB');
        reject();
      };
    });
  }

  getAllCompanies(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const store = this.getObjectStore('companies', 'readonly');
      const request = store.getAll();
  
      request.onsuccess = () => {
        resolve(request.result);
      };
  
      request.onerror = () => {
        console.error('Error fetching companies from IndexedDB');
        reject();
      };
    });
  }
  
  updateCompany(company: { id: number; name: string; address: string, tel: string }): Promise<void> {
    return new Promise((resolve, reject) => {
      const store = this.getObjectStore('companies', 'readwrite');
      const request = store.put(company);
  
      request.onsuccess = () => {
        console.log('Company updated in IndexedDB');
        resolve();
      };
  
      request.onerror = () => {
        console.error('Error updating company in IndexedDB');
        reject();
      };
    });
  }

  deleteCompany(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const store = this.getObjectStore('companies', 'readwrite');
      const request = store.delete(id);
  
      request.onsuccess = () => {
        console.log('Company deleted from IndexedDB');
        resolve();
      };
  
      request.onerror = () => {
        console.error('Error deleting company from IndexedDB');
        reject();
      };
    });
  }

  addEmployee(employee: EmployeeCreateDto): Promise<void> {
    return new Promise((resolve, reject) => {
      const store = this.getObjectStore('employees', 'readwrite');
      const request = store.add(employee);
  
      request.onsuccess = () => {
        console.log('Employee added to IndexedDB');
        resolve();
      };
  
      request.onerror = () => {
        console.error('Error adding employee to IndexedDB');
        reject();
      };
    });
  }

  getAllEmployees(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const store = this.getObjectStore('employees', 'readonly');
      const request = store.getAll();
  
      request.onsuccess = () => {
        resolve(request.result);
      };
  
      request.onerror = () => {
        console.error('Error fetching employees from IndexedDB');
        reject();
      };
    });
  }

  updateEmployee(employee: { id: number; name: string; company_id: number }): Promise<void> {
    return new Promise((resolve, reject) => {
      const store = this.getObjectStore('employees', 'readwrite');
      const request = store.put(employee);
  
      request.onsuccess = () => {
        console.log('Employee updated in IndexedDB');
        resolve();
      };
  
      request.onerror = () => {
        console.error('Error updating employee in IndexedDB');
        reject();
      };
    });
  }

  deleteEmployee(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const store = this.getObjectStore('employees', 'readwrite');
      const request = store.delete(id);
  
      request.onsuccess = () => {
        console.log('Employee deleted from IndexedDB');
        resolve();
      };
  
      request.onerror = () => {
        console.error('Error deleting employee from IndexedDB');
        reject();
      };
    });
  }
}
