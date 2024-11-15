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

  //REGION: Properties
  //Home page visibility
  welcomeVisible: boolean = false;

  //Company data
  companies: Company[] = []; //List of companies
  expandedCompany: number | null = null; //View company employees
  isCompanyFormVisible = false; //Company form visibility
  companyForm: Company = {
    name: '',
    address: '',
    phoneNumber: '',
    email: '',
    website: '',
    industry: '',
    employeeCount: 0,
  } as Company; //Company form data to add company
  
  //Company modal openers
  isCompanyEditModalOpen = false; //Company edit modal visibility
  isCompanyModalOpen = false; //Modal opener for read or edit company
  selectedCompany: any = null; //Selected company for modal

  employees: Employee[] = []; //List of employees
  isEmployeeFormVisible = false; //Employee form visibility
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
  } as Employee; //Employee form data to add employee

  //Employee modal openers
  isEmployeeEditModalOpen = false; //Employee edit modal visibility
  isEmployeeModalOpen = false;    //Modal opener for read or edit employee
  selectedEmployee: any = null;   //Selected employee for modal
  //ENDREGION
  
  async getAuth() { //Get authentication
    // Comment out if you don't want to use cookies

    /* Check if authentication is already provided */
    // let myCookie = Cookie.get('authProvided');
    // if (myCookie == 'true') {
    //   this.welcomeVisible = false;
    //   this.authService.setAuthCode("already provided");
    //   return
    // }
    await this.authService.loginWithGoogle();
  }

  ngOnInit() { //Listen for authentication
    this.authService.authCode$.subscribe((isAuthenticated) => {
      this.welcomeVisible = !isAuthenticated;

      if (isAuthenticated) {
         //Authentication provided, open IndexedDB and get data if authenticated
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

  //Region: Company
  getCompanies() {
    this.indexedDBService.getAllCompanies().then((companies) => {
      this.companies = companies;
    });
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
  toggleCompanyForm() { //Toggle company form visibility for adding company
    this.isCompanyFormVisible = !this.isCompanyFormVisible;
  }

  deleteCompany(companyId: number) {
    this.indexedDBService.deleteCompany(companyId).then(() => {
      console.log('Company deleted');
      this.getCompanies();
    });
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
  openCompanyEditModal(company: any) {
    this.selectedCompany = { ...company };
    this.isCompanyEditModalOpen = true;
  }
  closeCompanyEditModal() {
    this.isCompanyEditModalOpen = false;
    this.selectedCompany = null;
  }

  openCompanyModal(company: Company) { //Open company modal for read
    this.selectedCompany = company;
    this.isCompanyModalOpen = true;
  }
  closeCompanyModal() {
    this.isCompanyModalOpen = false;
    this.selectedCompany = null;
  }

  toggleCompany(companyId: number) { //Toggle company employees visibility
    this.expandedCompany = this.expandedCompany === companyId ? null : companyId;
  }
  //EndRegion


  //Region: Employee
  getEmployees() {
    this.indexedDBService.getAllEmployees().then((employees) => {
      this.employees = employees;
    });
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
  toggleEmployeeForm() { //Toggle employee form visibility for adding employee
    this.isEmployeeFormVisible = !this.isEmployeeFormVisible;
  }

  deleteEmployee(employeeId: number) {
    this.indexedDBService.deleteEmployee(employeeId).then(() => {
      console.log('Employee deleted');
      this.getEmployees();
    });
  }

  saveEmployeeEdits() {
    this.indexedDBService.updateEmployee(this.selectedEmployee).then(() => {
      console.log('Employee updated');
      this.getEmployees();
      this.closeEditEmployeeModal();
    }).catch(() => {
      console.error('Failed to update employee');
    });
  }
  openEditEmployeeModal(employee: any) {
    this.selectedEmployee = { ...employee }; // Make a copy to avoid directly modifying the list
    this.isEmployeeEditModalOpen = true;
  }
  closeEditEmployeeModal() {
    this.isEmployeeEditModalOpen = false;
    this.selectedEmployee = null;
  }

  getEmployeesByCompany(companyId: number) { //Get employees by company for display
    const selectedEmployees = this.employees.filter(employee => employee.company_id === companyId);
    return selectedEmployees;
  }
  openEmployeeDetails(employee: any) {
    this.selectedEmployee = employee;
    this.isEmployeeModalOpen = true;
  }
  closeEmployeeModal() {
    this.isEmployeeModalOpen = false;
    this.selectedEmployee = null;
  }
  //EndRegion
}
