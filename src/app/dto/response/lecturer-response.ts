export interface LecturerResponse {
    id: number;
    name: string;
    gender: string; // GenderEnum
    phoneNumber: string;
    email: string;
    birthDate: string; // ISO format string
    degree: string;
    departmentId: number;
    departmentName: string;
    createdAt: string; // Timestamp
    updatedAt: string; // Timestamp
  }
  