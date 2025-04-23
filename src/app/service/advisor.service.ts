import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AdvisorResponse } from '../dto/response/Advisor-response';
import { JsonResponse } from '../dto/response/json-response';
import { Observable } from 'rxjs';
import { PagedResponse } from '../dto/response/paged-response';
import { AdvisorRequest } from '../dto/request/advisor-tequest';
import { enviroment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AdvisorService {

  private baseUrl = enviroment.apiURL + 'academic-advisors';

  constructor(private http: HttpClient) {}

  getAllAdvisors(): Observable<JsonResponse<AdvisorResponse[]>> {
    return this.http.get<JsonResponse<AdvisorResponse[]>>(this.baseUrl);
  }

  searchAdvisors(request: any): Observable<JsonResponse<PagedResponse<AdvisorResponse>>> {
    return this.http.post<JsonResponse<PagedResponse<AdvisorResponse>>>(
      `${this.baseUrl}/get-advisors`,
      request
    );
  }


  getAdvisorById(id: number): Observable<JsonResponse<AdvisorResponse>> {
    return this.http.get<JsonResponse<AdvisorResponse>>(`${this.baseUrl}/${id}`);
  }

  createAdvisor(request: AdvisorRequest): Observable<JsonResponse<string>> {
    return this.http.post<JsonResponse<string>>(this.baseUrl, request);
  }

  updateAdvisor(id: number, request: AdvisorRequest): Observable<JsonResponse<string>> {
    return this.http.put<JsonResponse<string>>(`${this.baseUrl}/${id}`, request);
  }

  deleteAdvisor(id: number): Observable<JsonResponse<string>> {
    return this.http.delete<JsonResponse<string>>(`${this.baseUrl}/${id}`);
  }

  getAcademicYears(): Observable<JsonResponse<string[]>> {
    return this.http.get<JsonResponse<string[]>>(`${this.baseUrl}/academic-years`);
  }

  uploadCSV(file: File): Observable<JsonResponse<string>> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<JsonResponse<string>>(`${this.baseUrl}/upload`, formData);
  }



}
