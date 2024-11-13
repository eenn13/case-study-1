import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(private authService: AuthService) {}
  title = 'case-study-1';
  welcomeVisible: boolean = false;

  ngOnInit() {
    // authCode durumunu dinleyerek welcomeVisible değişkenini güncelleyin
    this.authService.authCode$.subscribe(
      (isAuthenticated) => (this.welcomeVisible = !isAuthenticated)
    );
  }

  async getAuth() {
    let myCookie = Cookie.get('authProvided');
    if (myCookie == 'true') {
      this.welcomeVisible = false;
      return
    }
    await this.authService.loginWithGoogle();
  }
}
