import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './auth.service';
import { JsonResponse } from '../dto/response/json-response';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { enviroment } from '../../environments/environment';



@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket: WebSocket | null = null;
  private baseUrl = enviroment.apiURL + 'notifications';
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 1000;
  private maxReconnectInterval = 30000;
  private isConnected = false;
  private notiCountSubject = new BehaviorSubject<number>(0);
  notiCount$ = this.notiCountSubject.asObservable();
  constructor(
    private toastr: ToastrService,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object, // Inject PLATFORM_ID
    private http: HttpClient
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.authService.isLoggedIn$.subscribe((isLoggedIn) => {
        if (isLoggedIn) {
          this.connect();
          this.refreshNotiCount();
        } else {
          this.disconnect();
        }
      });
    }
  }

  private connect(): void {
    if (!isPlatformBrowser(this.platformId)) {
      // Không chạy kết nối nếu không phải trình duyệt
      return;
    }

    const token = this.authService.getCookie('authToken');
    if (!token) {
      console.warn('No JWT found. Cannot connect WebSocket.');
      return;
    }

    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const socketUrl = `${protocol}://${enviroment.socketURL}?token=${token}`;
    this.socket = new WebSocket(socketUrl);

    this.socket.onopen = () => {
      this.isConnected = true;
      this.reconnectAttempts = 0;
      console.log('WebSocket connected');
      this.toastr.success('WebSocket connected', 'Connected');
    };

    this.socket.onmessage = (event) => {
      console.log('Message received:', event.data);
      this.showNotification(event.data);
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.toastr.error('WebSocket error occurred!', 'Error');
    };

    this.socket.onclose = () => {
      this.isConnected = false;
      console.warn('WebSocket connection closed');
      this.toastr.warning('WebSocket connection closed', 'Disconnected');
      this.scheduleReconnect();
    };
  }

  private disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.isConnected = false;
      console.log('WebSocket disconnected');
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnect attempts reached. Giving up.');
      this.toastr.error(
        'Unable to reconnect to WebSocket. Please refresh the page.',
        'Connection Failed'
      );
      return;
    }

    const backoffTime = Math.min(
      this.reconnectInterval * 2 ** this.reconnectAttempts,
      this.maxReconnectInterval
    );

    this.reconnectAttempts++;
    console.log(`Reconnecting in ${backoffTime / 1000} seconds...`);

    setTimeout(() => {
      if (!this.isConnected) {
        this.connect();
      }
    }, backoffTime);
  }

  private showNotification(message: string): void {
    this.refreshNotiCount();
    this.toastr.info(message, 'New Notification');
  }

  public refreshNotiCount(): void{
    this.loadNotiCount().subscribe((response) => {
      if (response.code === 200) {
        const newNotiCount = response.result;
        this.notiCountSubject.next(newNotiCount);
      }
    })
  }

  private loadNotiCount(): Observable<JsonResponse<number>> {
    return this.http.get<JsonResponse<number>>(`${this.baseUrl}/count`);
  }


}
