export interface Company {
  id: number;
  name: string,
  address: string
  phoneNumber: string,
  email: string,
  website: string,
  industry: string,
  employeeCount: number,
}

export interface CompanyCreateDto {
  name: string,
  address: string
  phoneNumber: string,
  email: string,
  website: string,
  industry: string,
  employeeCount: number,
}
