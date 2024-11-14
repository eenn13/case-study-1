import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { IndexedDBService } from './indexeddb.service';
import { Company } from './models/company.model';
import { Employee } from './models/employee.model';

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
  companies: Company[] = [];
  employees: Employee[] = [];
  expandedCompany: number | null = null;

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
    this.indexedDBService.addCompany({
      id: 0,
      name: '',
      address: ''
    }).then(() => {
      console.log('Company added');
      this.getCompanies();
    });
  }

  getCompanies() {
    this.indexedDBService.getAllCompanies().then((companies) => {
      this.companies = companies;
      console.log('Companies:', companies);
    });
  }

  addEmployee() {
    this.indexedDBService.addEmployee({
      id: 0,
      name: '',
      company_id: 0
    }).then(() => {
      console.log('Employee added');
      this.getEmployees();
    });
  }

  getEmployees() {
    this.indexedDBService.getAllEmployees().then((employees) => {
      this.employees = employees;
      console.log('Employees:', employees);
    });
  }

  toggleCompany(companyId: number) {
    this.expandedCompany = this.expandedCompany === companyId ? null : companyId;
  }

  getEmployeesByCompany(companyId: number) {
    return this.employees.filter(employee => employee.company_id === companyId);
  }
}
