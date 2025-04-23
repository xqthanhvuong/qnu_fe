import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JsonResponse } from '../dto/response/json-response';
import { PagedResponse } from '../dto/response/paged-response';
import { ActivityGuideResponse } from '../dto/response/activity-guide-response';
import { enviroment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class DepartmentGuideService {
  private baseUrl = enviroment + 'department-guide';

  constructor(private http: HttpClient) { }
  searchGuides(request: any): Observable<JsonResponse<PagedResponse<ActivityGuideResponse>>> {
    return this.http.post<JsonResponse<PagedResponse<ActivityGuideResponse>>>(
      `${this.baseUrl}/get-guides`,
      request
    );
  }

  addGuides(id: number,request: any): Observable<JsonResponse<string>> {
    return this.http.post<JsonResponse<string>>(
      `${this.baseUrl}/add-guide/${id}`,
      request
    );
  }

  deleteGuide(id: number): Observable<JsonResponse<string>> {
    return this.http.delete<JsonResponse<string>>(
      `${this.baseUrl}/${id}`
    );
  }
}
