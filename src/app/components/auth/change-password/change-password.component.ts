import { Component } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {
  username: string = '';
  password: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  error: boolean = false;
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router, private toastr: ToastrService,) {}
  
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
