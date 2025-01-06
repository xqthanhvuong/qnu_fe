import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LecturerRequest } from '../dto/request/lecturer-request';
import { LecturerResponse } from '../dto/response/lecturer-response';
import { JsonResponse } from '../dto/response/json-response';
import { PagedResponse } from '../dto/response/paged-response';

@Injectable({
  providedIn: 'root',
})
export class LecturerService {
  private baseUrl = 'http://localhost:8000/AMQNU/api/lecturers';

  constructor(private http: HttpClient) {}

  searchLecturers(request: any): Observable<JsonResponse<PagedResponse<LecturerResponse>>> {
    return this.http.post<JsonResponse<PagedResponse<LecturerResponse>>>(`${this.baseUrl}/get-lecturers`, request);
  }

  uploadCSV(file: File): Observable<JsonResponse<string>> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<JsonResponse<string>>(`${this.baseUrl}/upload`, formData);
  }

  getLecturerById(id: number): Observable<JsonResponse<LecturerResponse>> {
    return this.http.get<JsonResponse<LecturerResponse>>(`${this.baseUrl}/${id}`);
  }

  createLecturer(request: LecturerRequest): Observable<JsonResponse<string>> {
    return this.http.post<JsonResponse<string>>(this.baseUrl, request);
  }

  updateLecturer(id: number, request: LecturerRequest): Observable<JsonResponse<string>> {
    return this.http.put<JsonResponse<string>>(`${this.baseUrl}/${id}`, request);
  }

  deleteLecturer(id: number): Observable<JsonResponse<string>> {
    return this.http.delete<JsonResponse<string>>(`${this.baseUrl}/${id}`);
  }
  getAllLecturers(): Observable<JsonResponse<LecturerResponse[]>> {
    return this.http.get<JsonResponse<LecturerResponse[]>>(this.baseUrl);
  }
}
