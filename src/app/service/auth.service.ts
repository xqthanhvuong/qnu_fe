import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';
import { enviroment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.loggedIn.asObservable();

  private userName = new BehaviorSubject<string>('');
  userName$ = this.userName.asObservable();

  private userRole: string = '';

  private role = new BehaviorSubject<string>('');
  userRole$ = this.role.asObservable();

  private tokenKey = 'authToken';

  private permissions: string[] = [];

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.checkToken();
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(enviroment.apiURL + 'auth/log-in', { username, password }).pipe(
      tap((response) => {
        if (response.result.token) {
          this.setCookie(this.tokenKey, response.result.token, 1); 
          this.loggedIn.next(true);
          const payload = this.decodeToken(response.result.token);
          this.userName.next(payload?.username || '');
          this.role.next(payload?.role || '');
          this.userRole = payload?.role || '';
          this.permissions = payload?.permission || [];
        }
      })
    );
  }

  clearSession(): void {
    this.deleteCookie(this.tokenKey);
    this.loggedIn.next(false);
    this.userName.next('');
    this.role.next('');
    this.userRole = '';
    this.permissions = [];
  }

   logout(): Observable<any> {
    return this.http.post<any>(enviroment.apiURL + 'auth/log-out', {}).pipe(
      tap((response) => {
        if (response.code === 200) {
          this.clearSession(); 
        }
      }),
      catchError(()=>{
        this.clearSession();
        return of(null)
      })
    );
  }

  public checkToken(): void {
    const token = this.getCookie(this.tokenKey);
    if (token && !this.isTokenExpired(token)) {
      this.loggedIn.next(true);
      const payload = this.decodeToken(token);
      this.userName.next(payload?.username || '');
      this.userRole = payload?.role || '';
      this.role.next(payload?.role || '');
      this.permissions = payload?.permission || [];
    } else {
      this.clearSession();
    }
  }

  public getRole(): string {
    return this.userRole;
  }

  public checkPermissions(permission: string): boolean {
    return this.permissions.includes(permission);
  }

  private isTokenExpired(token: string): boolean {
    const payload = this.decodeToken(token);
    if (payload.exp) {
      const expiry = payload.exp * 1000;
      return Date.now() > expiry;
    }
    return true;
  }

  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return {
        username: decoded.sub,  // Lấy username từ `subject`
        role: decoded.type,     // Lấy role từ `type`
        exp: decoded.exp,       // Lấy thời gian hết hạn
        permission: decoded.scope // Danh sách quyền từ `scope`
      };
    } catch (e) {
      return null;
    }
  }

  private setCookie(name: string, value: string, days: number): void {
    if (isPlatformBrowser(this.platformId)) {
      const expires = new Date(Date.now() + days * 864e5).toUTCString();
      this.document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/;`;
    }
  }

  public getCookie(name: string): string | null {
    if (isPlatformBrowser(this.platformId)) {
      const match = this.document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      return match ? decodeURIComponent(match[2]) : null;
    }
    return null;
  }

  private deleteCookie(name: string): void {
    this.setCookie(name, '', -1);
  }

  public isHaveRole(name: string): boolean {
    return this.userRole === name;
  }
}
