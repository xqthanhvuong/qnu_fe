import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JsonResponse } from '../dto/response/json-response';
import { RollCallRequest } from '../dto/request/roll-call-request';
import { RollCallResponse } from '../dto/response/roll-call-response';
import { AttendanceRecordRequest } from '../dto/request/attendance-record-request';
import { AttendanceRecord } from '../dto/response/attendance-record';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private baseUrl = 'http://localhost:8000/AMQNU/api/attendance';

  constructor(private http: HttpClient) {}

  createAttendanceSession(id: number): Observable<JsonResponse<string>> {
    return this.http.post<JsonResponse<string>>(`${this.baseUrl}/${id}`, {});
  }
  rollCall(request: RollCallRequest): Observable<JsonResponse<RollCallResponse>> {
    return this.http.post<JsonResponse<RollCallResponse>>(`${this.baseUrl}/roll-call`, request);
  }

  updateAttendanceSession(request: AttendanceRecordRequest): Observable<JsonResponse<string>> {
    return this.http.put<JsonResponse<string>>(`${this.baseUrl}`, request);
  }

  getAttendanceSession(id: number): Observable<JsonResponse<AttendanceRecord[]>> {
    return this.http.get<JsonResponse<AttendanceRecord[]>>(`${this.baseUrl}/${id}`);
  }
}
