export interface LecturerRequest {
    name: string;
    gender: string; // GenderEnum ('MALE', 'FEMALE', etc.)
    degree: string;
    birthDate: Date; // ISO format string
    phoneNumber: string;
    email: string;
    departmentId: number;
  }
  