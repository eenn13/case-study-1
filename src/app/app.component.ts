import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { IndexedDBService } from './indexeddb.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(private authService: AuthService, private indexedDBService: IndexedDBService) {}
  title = 'case-study-1';
  welcomeVisible: boolean = false;
  users: any[] = [];

  ngOnInit() {
    // authCode durumunu dinleyerek welcomeVisible değişkenini güncelle ve yetkilendirme sağlanınca getUsers çağır
    this.authService.authCode$.subscribe((isAuthenticated) => {
      this.welcomeVisible = !isAuthenticated;
  
      if (isAuthenticated) {
        // Yetkilendirme sağlanınca veritabanını aç ve kullanıcıları getir
        this.indexedDBService.openDB()
          .then(() => {
            this.getUsers();
          })
          .catch(() => {
            console.error('Failed to open database');
          });
      }
    });
  }
  

  async getAuth() {
    let myCookie = Cookie.get('authProvided');
    if (myCookie == 'true') {
      this.welcomeVisible = false;
      this.authService.setAuthCode("already provided");
      return
    }
    await this.authService.loginWithGoogle();
  }

  addUser() {
    this.indexedDBService.addUser({ name: 'Alice', age: 25 }).then(() => {
      console.log('User added');
    });
  }

  getUsers() {
    this.indexedDBService.getAllUsers().then((users) => {
      this.users = users;
      console.log('Users:', users);
    });
  }
}
