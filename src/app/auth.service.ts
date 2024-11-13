import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authCode = new BehaviorSubject<string>("");
  authCode$ = this.authCode.asObservable();
  // Getter
  getAuthCode(): string {
    return this.authCode.getValue();
  }

  // Setter
  setAuthCode(value: string): void {
    this.authCode.next(value);
  }

  loginWithGoogle() {
    const googleAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    const params = new URLSearchParams({
      client_id: environment.googleOAuth.clientId,
      redirect_uri: environment.googleOAuth.redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
    });

    // Route to Google OAuth2 URL
    window.location.href = `${googleAuthUrl}?${params.toString()}`;
  }
}