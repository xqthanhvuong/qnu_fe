import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  error: boolean = false;
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router, private toastr: ToastrService,) {}

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        this.router.navigate(['/']); // Chuyển hướng nếu đã đăng nhập
      }
    });
  }
  
  onSubmit(): void {
    this.authService.login(this.username, this.password).subscribe(
      (response) => {
        this.router.navigate(['/']); // Chuyển hướng sau khi đăng nhập thành công
      },
      (error) => {
        this.error = true;
        this.toastr.error('Invalid username or password', 'Error');
        this.errorMessage = 'Invalid username or password';
      }
    );
  }

}
