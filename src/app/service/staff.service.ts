import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JsonResponse } from '../dto/response/json-response';
import { Observable } from 'rxjs';
import { PagedResponse } from '../dto/response/paged-response';
import { StaffRequest } from '../dto/request/staff-request';
import { StaffResponse } from '../dto/response/staff-response';

@Injectable({
  providedIn: 'root'
})
export class StaffService {
  private baseUrl = 'http://localhost:8000/AMQNU/api/staffs';
  private staffRequest: StaffRequest | null = null;

  constructor(private http: HttpClient) { }
  
  uploadCSV(file: File): Observable<JsonResponse<string>> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<JsonResponse<string>>(`${this.baseUrl}/upload`, formData);
  }
  
  searchStaffs(request: any): Observable<JsonResponse<PagedResponse<StaffResponse>>> {
    return this.http.post<JsonResponse<PagedResponse<StaffResponse>>>(`${this.baseUrl}/get-staffs`, request);
  }

  getStaffById(staffId: number): Observable<JsonResponse<StaffResponse>> {
    return this.http.get<JsonResponse<StaffResponse>>(`${this.baseUrl}/${staffId}`);
  }

  updateStaff(staffId: number, request: StaffRequest): Observable<JsonResponse<string>> {
    return this.http.put<JsonResponse<string>>(`${this.baseUrl}/${staffId}`, request);
  }

  createStaff(request: StaffRequest): Observable<JsonResponse<string>> {
    return this.http.post<JsonResponse<string>>(this.baseUrl, request);
  }

  deleteStaff(staffId: number): Observable<JsonResponse<string>> {
    return this.http.delete<JsonResponse<string>>(`${this.baseUrl}/${staffId}`);
  }

  setStaffRequest(request: StaffRequest) {
    this.staffRequest = request;
  }

  getStaffRequest(): StaffRequest | null {
    return this.staffRequest;
  }
}
