import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-layout-sidebar',
  templateUrl: './layout-sidebar.component.html',
  styleUrls: ['./layout-sidebar.component.css'],
})
export class LayoutSidebarComponent implements OnInit {
  username: string = '';
  constructor(private router: Router,public authService: AuthService) {}

  ngOnInit(): void {
    console.log('Layout Sidebar initialized');
    this.authService.userName$.subscribe((name)=>{
      this.username = name;
    })
  }

  navigate(link: string): void {
    this.router.navigate([link]);
  }

  isActive(url: string): boolean {
    return this.router.url.startsWith(url);
  }

  isAdminRole(): boolean {
    return this.authService.getRole() === 'SUPERADMIN';
  }

  
  isRoleStudent(): boolean { 
    return this.authService.getRole() == 'STUDENT';
  }
}
