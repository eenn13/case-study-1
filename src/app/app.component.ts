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
  companies: any[] = [];
  employees: any[] = [];

  ngOnInit() {
    this.authService.authCode$.subscribe((isAuthenticated) => {
      this.welcomeVisible = !isAuthenticated;
  
      if (isAuthenticated) {
        this.indexedDBService.openDB()
          .then(() => {
            this.getCompanies();
            this.getEmployees();
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

  addCompany() {
    this.indexedDBService.addCompany({ name: 'companyx', address: "izmir buca", tel:"+90538" }).then(() => {
      console.log('Company added');
    });
  }

  getCompanies() {
    this.indexedDBService.getAllCompanies().then((companies) => {
      this.companies = companies;
      console.log('Companies:', companies);
    });
  }

  addEmployee() {
    this.indexedDBService.addEmployee({ name: 'employee1', company_id: 1 }).then(() => {
      console.log('Employee added');
    });
  }

  getEmployees() {
    this.indexedDBService.getAllEmployees().then((employees) => {
      this.employees = employees;
      console.log('Employees:', employees);
    });
  }
}
