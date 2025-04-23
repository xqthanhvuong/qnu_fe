import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JsonResponse } from '../dto/response/json-response';
import { PagedResponse } from '../dto/response/paged-response';
import { StudentResponse } from '../dto/response/student-response';
import { StudentRequest } from '../dto/request/student-request';
import { enviroment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private baseUrl = enviroment.apiURL + 'students';

  constructor(private http: HttpClient) { }
  
  uploadCSV(file: File): Observable<JsonResponse<string>> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<JsonResponse<string>>(`${this.baseUrl}/upload`, formData);
  }
  
  searchStudent(request: any): Observable<JsonResponse<PagedResponse<StudentResponse>>> {
    return this.http.post<JsonResponse<PagedResponse<StudentResponse>>>(`${this.baseUrl}/get-students`, request);
  }

  getStudentById(studentId: number): Observable<JsonResponse<StudentResponse>> {
    return this.http.get<JsonResponse<StudentResponse>>(`${this.baseUrl}/${studentId}`);
  }

  createStudent(request: StudentRequest): Observable<JsonResponse<string>> {
    return this.http.post<JsonResponse<string>>(this.baseUrl, request);
  }

  updateStudent(studentId: number, request: StudentRequest): Observable<JsonResponse<string>> {
    return this.http.put<JsonResponse<string>>(`${this.baseUrl}/${studentId}`, request);
  }

  deleteStudent(studentId: number): Observable<JsonResponse<string>> {
    return this.http.delete<JsonResponse<string>>(`${this.baseUrl}/${studentId}`);
  }
}
