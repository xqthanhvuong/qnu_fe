import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DepartmentRequest } from '../dto/request/department-request';
import { DepartmentResponse } from '../dto/response/department-response';
import { JsonResponse } from '../dto/response/json-response';
import { PagedResponse } from '../dto/response/paged-response';
import { enviroment } from '../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private baseUrl = enviroment.apiURL + 'departments'; // Địa chỉ base cho API
  private departmentRequest: DepartmentRequest | null = null;

  constructor(private http: HttpClient) {}

  uploadCSV(file: File): Observable<JsonResponse<string>> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<JsonResponse<string>>(`${this.baseUrl}/upload`, formData);
  }

  searchDepartments(request: any): Observable<JsonResponse<PagedResponse<DepartmentResponse>>> {
    return this.http.post<JsonResponse<PagedResponse<DepartmentResponse>>>(`${this.baseUrl}/get-departments`, request);
  }

  getDepartmentById(departmentId: number): Observable<JsonResponse<DepartmentResponse>> {
    return this.http.get<JsonResponse<DepartmentResponse>>(`${this.baseUrl}/${departmentId}`);
  }

  updateDepartment(departmentId: number, request: DepartmentRequest): Observable<JsonResponse<string>> {
    return this.http.put<JsonResponse<string>>(`${this.baseUrl}/${departmentId}`, request);
  }

  createDepartment(request: DepartmentRequest): Observable<JsonResponse<string>> {
    return this.http.post<JsonResponse<string>>(this.baseUrl, request);
  }

  deleteDepartment(departmentId: number): Observable<JsonResponse<string>> {
    return this.http.delete<JsonResponse<string>>(`${this.baseUrl}/${departmentId}`);
  }

  getDepartmentSummary(): Observable<JsonResponse<DepartmentResponse[]>> {
    return this.http.get<JsonResponse<DepartmentResponse[]>>(this.baseUrl);
  }

  setDepartmentRequest(request: DepartmentRequest) {
    this.departmentRequest = request;
  }

  getDepartmentRequest(): DepartmentRequest | null {
    return this.departmentRequest;
  }
}
