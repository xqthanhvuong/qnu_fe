import { Component, OnInit } from '@angular/core';
import { AuthService } from './service/auth.service';
import { WebSocketService } from './service/websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'qnu';

  constructor(private authService:AuthService, private websocketService: WebSocketService){}

  ngOnInit(): void {
    this.authService.checkToken();
  }
  
}
