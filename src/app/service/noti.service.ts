import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JsonResponse } from '../dto/response/json-response';
import { PagedResponse } from '../dto/response/paged-response';
import { NotificationResponse } from '../dto/response/notification-response';

@Injectable({
  providedIn: 'root'
})
export class NotiService {
  private baseUrl = 'http://localhost:8000/AMQNU/api/notifications';

  constructor(private http: HttpClient) { }

    public getNotification(request: any): Observable<JsonResponse<PagedResponse<NotificationResponse>>> {
        return this.http.post<JsonResponse<PagedResponse<NotificationResponse>>>(`${this.baseUrl}/get-notifications`,request);
    }
    
    
  public setReadAll(): Observable<JsonResponse<string>>{
    return this.http.put<JsonResponse<string>>(`${this.baseUrl}/read-all`,null);
  }
}
