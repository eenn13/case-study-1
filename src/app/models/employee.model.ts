export interface Employee {
  id: number;
  name: string;
  phone: string;
  company_id: number;
  title: string;
  email: string;
  age: number;
  salary: number;
  department: string;
  position: string;
  hireDate: string;
  isWorking: boolean;
}

export interface EmployeeCreateDto {
  name: string;
  company_id: number;
  phone: string;
  title: string;
  email: string;
  age: number;
  salary: number;
  department: string;
  position: string;
  hireDate: string;
  isWorking: boolean;
}