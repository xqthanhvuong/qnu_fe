import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JsonResponse } from '../dto/response/json-response';
import { ActivityMinutes } from '../dto/request/activity-minutes';
import { enviroment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MinutesActivityService {

  private baseUrl = enviroment.apiURL + 'minute-activity';

  constructor(private http: HttpClient) {}

  getMinutes(id: number): Observable<JsonResponse<ActivityMinutes>>{
    return this.http.get<JsonResponse<ActivityMinutes>>(`${this.baseUrl}/${id}`);
  }

  saveMinutes(activityMinutes: ActivityMinutes): Observable<JsonResponse<string>>{
    return this.http.post<JsonResponse<string>>(`${this.baseUrl}`, activityMinutes);
  }

}
