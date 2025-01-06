import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JsonResponse } from '../dto/response/json-response';
import { HttpClient } from '@angular/common/http';
import { Permission } from '../dto/permission';
import { RoleDetailResponse } from '../dto/response/role-detail-response';
import { PagedResponse } from '../dto/response/paged-response';
import { RoleResponse } from '../dto/response/role-response';
import { AccountHaveRole } from '../dto/response/account-have-role';


@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private baseUrl = 'http://localhost:8000/AMQNU/api/roles';
  private permissionUrl = 'http://localhost:8000/AMQNU/api/permissions';

  constructor(private http: HttpClient) { }

  getPermissionOfType(): Observable<JsonResponse<Permission[]>> {
    return this.http.get<JsonResponse<Permission[]>>(this.permissionUrl);
  }

  addRole(request: {roleName: string, permissionIds: number[]}): Observable<JsonResponse<string>> {
    return this.http.post<JsonResponse<string>>(this.baseUrl, request);
  }

  getPermissionsOfRole(roleId: number): Observable<JsonResponse<RoleDetailResponse>> {
    return this.http.get<JsonResponse<RoleDetailResponse>>(`${this.baseUrl}/${roleId}`);
  }

  updateRole(roleId: number, request: {roleName: string, permissionIds: number[]}): Observable<JsonResponse<string>> {
    return this.http.put<JsonResponse<string>>(`${this.baseUrl}/${roleId}`, request);
  }

  deleteRole(roleId: number): Observable<JsonResponse<string>> {
    return this.http.delete<JsonResponse<string>>(`${this.baseUrl}/${roleId}`);
  }

  getRoles(request: any): Observable<JsonResponse<PagedResponse<RoleResponse>>>{
    return this.http.post<JsonResponse<PagedResponse<RoleResponse>>>(`${this.baseUrl}/get-roles`, request);
  }

  setRoleForAccount(request: any): Observable<JsonResponse<string>>{
    return this.http.post<JsonResponse<string>>(`${this.baseUrl}/accounts`, request);
  }

  getAccountHaveRole(id: number): Observable<JsonResponse<AccountHaveRole[]>>{
    return this.http.get<JsonResponse<AccountHaveRole[]>>(`${this.baseUrl}/accounts/${id}`);
  }

  getAllAccountHaveRole(): Observable<JsonResponse<AccountHaveRole[]>>{
    return this.http.get<JsonResponse<AccountHaveRole[]>>(`${this.baseUrl}/accounts`);
  }

  deleteAccountHaveRole(id: number): Observable<JsonResponse<String>>{
    return this.http.delete<JsonResponse<String>>(`${this.baseUrl}/accounts/account-role/${id}`);
  }


}
