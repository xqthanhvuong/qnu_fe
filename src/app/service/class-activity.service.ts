import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JsonResponse } from '../dto/response/json-response';
import { PagedResponse } from '../dto/response/paged-response';
import { ClassActivityResponse } from '../dto/response/class-activity-response';
import { enviroment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClassActivityService {
  private baseUrl = enviroment.apiURL  + 'class-activity';

  constructor(private http: HttpClient) { }

  searchClassActivities(request: any): Observable<JsonResponse<PagedResponse<ClassActivityResponse>>> {
    return this.http.post<JsonResponse<PagedResponse<ClassActivityResponse>>>(`${this.baseUrl}/get-activities`, request);
  }

  setActivityTime(id: number ,activityTime: string): Observable<JsonResponse<string>> {
    return this.http.patch<JsonResponse<string>>(`${this.baseUrl}/${id}/activity-time`, { activityTime });
  }

  getClassActivity(id: number): Observable<JsonResponse<ClassActivityResponse>> { 
    return this.http.get<JsonResponse<ClassActivityResponse>>(`${this.baseUrl}/${id}`);
  }

}
