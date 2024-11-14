import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { IndexedDBService } from './indexeddb.service';
import { Company } from './models/company.model';
import { Employee } from './models/employee.model';
import { FormsModule } from '@angular/forms'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule],
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
  isModalOpen = false;
  selectedCompany: any = null;

  isCompanyFormVisible = false;
  companyForm: Company = {
    name: '',
    address: '',
    phoneNumber: '',
    email: '',
    website: '',
    industry: '',
    employeeCount: 0,
  } as Company;

  isEmployeeFormVisible = false;
  employeeForm: Employee = {
    name: '',
    company_id: 0,
    age: 0,
    title: '',
    email: '',
    phone: '',
    salary: 0,
    department: '',
    position: '',
    hireDate: '',
    isWorking: false,
  } as Employee;


  isCompanyEditModalOpen = false;

  

  toggleCompanyForm() {
    this.isCompanyFormVisible = !this.isCompanyFormVisible;
  }

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
    const companyObj = {
      name: this.companyForm.name,
      address: this.companyForm.address,
      phoneNumber: this.companyForm.phoneNumber,
      email: this.companyForm.email,
      website: this.companyForm.website,
      industry: this.companyForm.industry,
      employeeCount: this.companyForm.employeeCount,
    };
    if(!companyObj.name || !companyObj.phoneNumber || !companyObj.email) {
      return;
    }
    this.indexedDBService.addCompany(companyObj).then(() => {
      console.log('Company added');
      this.getCompanies();
    });
  }

  deleteCompany(companyId: number) {
    this.indexedDBService.deleteCompany(companyId).then(() => {
      console.log('Company deleted');
      this.getCompanies();
    });
  }

  openCompanyEditModal(company: any) {
    this.selectedCompany = { ...company }; // Make a copy to avoid directly modifying the list
    this.isCompanyEditModalOpen = true;
  }

  closeCompanyEditModal() {
    this.isCompanyEditModalOpen = false;
    this.selectedCompany = null;
  }

  saveCompanyEdits() {
    this.indexedDBService.updateCompany(this.selectedCompany).then(() => {
      console.log('Company updated');
      this.getCompanies();
      this.closeCompanyEditModal();
    }).catch(() => {
      console.error('Failed to update company');
    });
  }

  getCompanies() {
    this.indexedDBService.getAllCompanies().then((companies) => {
      this.companies = companies;
      console.log('Companies:', companies);
    });
  }

  toggleEmployeeForm() {
    this.isEmployeeFormVisible = !this.isEmployeeFormVisible;
  }

  addEmployee() {
    const employeeObj = {
      name: this.employeeForm.name,
      company_id: this.employeeForm.company_id,
      title: this.employeeForm.title,
      email: this.employeeForm.email,
      age: this.employeeForm.age,
      phone: this.employeeForm.phone,
      salary: this.employeeForm.salary,
      department: this.employeeForm.department,
      position: this.employeeForm.position,
      hireDate: this.employeeForm.hireDate,
      isWorking: this.employeeForm.isWorking,
    }
    if(!employeeObj.name || !employeeObj.email || !employeeObj.company_id) {
      return;
    }
    this.indexedDBService.addEmployee(employeeObj).then(() => {
      console.log('Employee added');
      this.getEmployees();
    });
  }

  deleteEmployee(employeeId: number) {
    this.indexedDBService.deleteEmployee(employeeId).then(() => {
      console.log('Employee deleted');
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
    const selectedEmployees = this.employees.filter(employee => employee.company_id === companyId);
    return selectedEmployees;
  }

  openCompanyModal(company: Company) {
    this.selectedCompany = company;
    this.isModalOpen = true;
  }

  closeCompanyModal() {
    this.isModalOpen = false;
    this.selectedCompany = null;
  }

  isEmployeeModalOpen = false;
  selectedEmployee: any = null;

  openEmployeeDetails(employee: any) {
    this.selectedEmployee = employee;
    this.isEmployeeModalOpen = true;
  }

  closeEmployeeModal() {
    this.isEmployeeModalOpen = false;
    this.selectedEmployee = null;
  }
}
