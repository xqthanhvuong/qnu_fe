import { Injectable } from '@angular/core';
import { ClassRequest } from '../dto/request/class-request';
import { HttpClient } from '@angular/common/http';
import { JsonResponse } from '../dto/response/json-response';
import { Observable } from 'rxjs';
import { ClassResponse } from '../dto/response/class-response';
import { PagedResponse } from '../dto/response/paged-response';
import { ClassDetailResponse } from '../dto/response/class-detail-response';
import { enviroment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ClassService {
  private baseUrl = enviroment.apiURL + 'classes';
  private classRequest: ClassRequest | null = null;

  constructor(private http: HttpClient) { }
  
  uploadCSV(file: File): Observable<JsonResponse<string>> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<JsonResponse<string>>(`${this.baseUrl}/upload`, formData);
  }
  
  searchClasses(request: any): Observable<JsonResponse<PagedResponse<ClassResponse>>> {
    return this.http.post<JsonResponse<PagedResponse<ClassResponse>>>(`${this.baseUrl}/get-classes`, request);
  }

  getClassById(classId: number): Observable<JsonResponse<ClassResponse>> {
    return this.http.get<JsonResponse<ClassResponse>>(`${this.baseUrl}/${classId}`);
  }

  updateClass(classId: number, request: ClassRequest): Observable<JsonResponse<string>> {
    return this.http.put<JsonResponse<string>>(`${this.baseUrl}/${classId}`, request);
  }

  createClass(request: ClassRequest): Observable<JsonResponse<string>> {
    return this.http.post<JsonResponse<string>>(this.baseUrl, request);
  }

  deleteClass(classId: number): Observable<JsonResponse<string>> {
    return this.http.delete<JsonResponse<string>>(`${this.baseUrl}/${classId}`);
  }
  getClassSummary(): Observable<JsonResponse<ClassResponse[]>> {
    return this.http.get<JsonResponse<ClassResponse[]>>(this.baseUrl);
  }

  setClassRequest(request: ClassRequest) {
    this.classRequest = request;
  }

  getClassRequest(): ClassRequest | null {
    return this.classRequest;
  }

  getMyClasses(): Observable<JsonResponse<ClassResponse[]>> {
    return this.http.get<JsonResponse<ClassResponse[]>>(`${this.baseUrl}/my-class/for-lecturer`);
  }

  getMyClassesStudent(request: any): Observable<JsonResponse<ClassDetailResponse>> {
    return this.http.post<JsonResponse<ClassDetailResponse>>(`${this.baseUrl}/my-class/for-student`, request);
  }

    // Gọi API để lấy chi tiết lớp
  getClassDetailById(classId: number, pageRequest: any): Observable<JsonResponse<ClassDetailResponse>> {
    return this.http.post<JsonResponse<ClassDetailResponse>>(`${this.baseUrl}/${classId}`, pageRequest);
  }
}
