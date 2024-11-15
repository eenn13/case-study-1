import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
//import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  selector: 'app-auth-callback',
  template: `<p>Giriş yapılıyor...</p>`,
  /*
  templateUrl: './auth-callback.component.html',
  styleUrl: './auth-callback.component.css'
  */
})
export class AuthCallbackComponent implements OnInit {
  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    console.log('AuthCallbackComponent initialized');
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      this.authService.setAuthCode(code);
      //Cookie.set('authProvided', 'true', 1 /*days from now*/);
    } else {
      this.authService.setAuthCode("");
    }

    this.router.navigate(['/']);
  }
}