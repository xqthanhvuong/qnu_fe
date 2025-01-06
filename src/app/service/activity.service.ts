import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JsonResponse } from '../dto/response/json-response';
import { PagedResponse } from '../dto/response/paged-response';
import { ActivityResponse } from '../dto/response/activity-response';
import { ActivitySummary } from '../dto/response/activity-summary';

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  private baseUrl = 'http://localhost:8000/AMQNU/api/activity';

  constructor(private http: HttpClient) {}

  searchActivity(
    request: any
  ): Observable<JsonResponse<PagedResponse<ActivityResponse>>> {
    return this.http.post<JsonResponse<PagedResponse<ActivityResponse>>>(
      `${this.baseUrl}/get-activities`,
      request
    );
  }

  uploadActivity(request: any): Observable<JsonResponse<String>> {
    return this.http.post<JsonResponse<String>>(
      `${this.baseUrl}/create-activity`,
      request
    );
  }

  getSummaryActivity(): Observable<JsonResponse<ActivitySummary[]>> {
    return this.http.get<JsonResponse<ActivitySummary[]>>(`${this.baseUrl}`);
  }
}
