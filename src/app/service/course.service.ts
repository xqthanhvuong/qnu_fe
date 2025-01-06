import { Injectable } from '@angular/core';
import { CourseRequest } from '../dto/request/course-requesr';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JsonResponse } from '../dto/response/json-response';
import { PagedResponse } from '../dto/response/paged-response';
import { CourseResponse } from '../dto/response/course-response';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private baseUrl = 'http://localhost:8000/AMQNU/api/courses';
  private courseRequest: CourseRequest | null = null;

  constructor(private http: HttpClient) { }

  uploadCSV(file: File): Observable<JsonResponse<string>> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<JsonResponse<string>>(`${this.baseUrl}/upload`, formData);
  }

  searchCourses(request: any): Observable<JsonResponse<PagedResponse<CourseResponse>>> {
    return this.http.post<JsonResponse<PagedResponse<CourseResponse>>>(`${this.baseUrl}/get-courses`, request);
  }

  getCourseById(courseId: number): Observable<JsonResponse<CourseResponse>> {
    return this.http.get<JsonResponse<CourseResponse>>(`${this.baseUrl}/${courseId}`);
  }

  updateCourse(courseId: number, request: CourseRequest): Observable<JsonResponse<string>> {
    return this.http.put<JsonResponse<string>>(`${this.baseUrl}/${courseId}`, request);
  }

  createCourse(request: CourseRequest): Observable<JsonResponse<string>> {
    return this.http.post<JsonResponse<string>>(this.baseUrl, request);
  }

  deleteCourse(courseId: number): Observable<JsonResponse<string>> {
    return this.http.delete<JsonResponse<string>>(`${this.baseUrl}/${courseId}`);
  }
  getCourseSummary(): Observable<JsonResponse<CourseResponse[]>> {
    return this.http.get<JsonResponse<CourseResponse[]>>(this.baseUrl);
  }

  setCourseRequest(request: CourseRequest) {
    this.courseRequest = request;
  }

  getCourseRequest(): CourseRequest | null {
    return this.courseRequest;
  }

}
