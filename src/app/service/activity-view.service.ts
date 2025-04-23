import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JsonResponse } from '../dto/response/json-response';
import { ActivityViewResponse } from '../dto/response/activity-view-response';
import { enviroment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ActivityViewService {
  private baseUrl = enviroment.apiURL + 'activity-view';

  constructor(private http: HttpClient) { }

  view(id: number): Observable<JsonResponse<string>> {
    return this.http.post<JsonResponse<string>>(
      `${this.baseUrl}/view/${id}`, {}
    );
  }

  getActivityView(request: any): Observable<JsonResponse<ActivityViewResponse[]>> {
    return this.http.post<JsonResponse<ActivityViewResponse[]>>(
      `${this.baseUrl}/get-activity-view`, request
    );
  }

  


}
