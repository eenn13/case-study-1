import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'login-form',
  templateUrl: './login-form.component.html',
  imports: [FormsModule],
  styleUrls: ['./login-form.component.css'],
  standalone: true
})
export class LoginFormComponent {
  username: string = '';
  password: string = '';

  onSubmit() {
    console.log('Form gönderildi:', this.username, this.password);
    // Giriş işlemlerini burada gerçekleştirin
  }
}
