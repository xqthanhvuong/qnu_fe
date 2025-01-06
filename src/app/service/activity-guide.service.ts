import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JsonResponse } from '../dto/response/json-response';
import { PagedResponse } from '../dto/response/paged-response';
import { ActivityGuideResponse } from '../dto/response/activity-guide-response';

@Injectable({
  providedIn: 'root'
})
export class ActivityGuideService {
  private baseUrl = 'http://localhost:8000/AMQNU/api/activity-guide';

  constructor(private http: HttpClient) { }

  searchGuides(request: any): Observable<JsonResponse<PagedResponse<ActivityGuideResponse>>> {
    return this.http.post<JsonResponse<PagedResponse<ActivityGuideResponse>>>(
      `${this.baseUrl}/get-guides`,
      request
    );
  }

  addGuides(id: number,request: any): Observable<JsonResponse<string>> {
    return this.http.post<JsonResponse<string>>(
      `${this.baseUrl}/${id}`,
      request
    );
  }

  getAllGuides(id: number): Observable<JsonResponse<ActivityGuideResponse[]>> {
    return this.http.get<JsonResponse<ActivityGuideResponse[]>>(
      `${this.baseUrl}/get-all-guide/${id}`
    );
  }

  deleteGuide(id: number): Observable<JsonResponse<string>> {
    return this.http.delete<JsonResponse<string>>(
      `${this.baseUrl}/${id}`
    );
  }
}
