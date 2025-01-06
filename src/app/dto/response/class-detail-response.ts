export interface ClassDetailResponse {
    studentOfClass: StudentOfClass[];
    id: number;
    name: string;
    total: number;
  }
  
  export interface StudentOfClass {
    id: number;
    studentCode: string;
    name: string;
    gender: string;
    email: string;
    birthDate: Date;
    studentPosition: string;
  }
  