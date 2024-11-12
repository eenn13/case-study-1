import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginFormComponent } from './login-form/login-form.component'
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, LoginFormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'case-study-1';
  showLoginForm: boolean = false;
  username: string = '';
  password: string = '';

  // onSubmit fonksiyonunu tanımlayın
  onSubmit() {
    console.log('Form gönderildi:', this.username, this.password);
    // Form gönderildikten sonra yapılacak işlemler
  }

  toggleLoginForm() {
    this.showLoginForm = !this.showLoginForm;
  }
}
