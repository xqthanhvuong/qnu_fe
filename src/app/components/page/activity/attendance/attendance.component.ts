import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { AttendanceRecord } from '../../../../dto/response/attendance-record';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { AttendanceService } from '../../../../service/attendance.service';
import { catchError, EMPTY } from 'rxjs';
import { Location } from '@angular/common';
import { AuthService } from '../../../../service/auth.service';

declare var bootstrap: any;

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.css',
})
export class AttendanceComponent implements OnInit {
  @ViewChild('dt2') dt2!: Table;
  attendanceRecords!: AttendanceRecord[];
  classActivityId: number | null = null;
  statuses!: any[]; 
  selectedStatus: any = null;
  attendanceCode: string = '';
  valueCode: string = '';
  modalInstance: any;
  statusUpdate: any;
  idAttendance: number | null = null;
  showCountdown = false;
  countdownDuration = 0; 

  clear(table: Table) {
    table.clear();
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input) {
      this.dt2.filterGlobal(input.value, 'contains');
    }
  }

  constructor(
    private attendanceService: AttendanceService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    public authService: AuthService
  ) {
    this.statuses = [
      { label: 'Present', value: 'Present' },
      { label: 'Absent', value: 'Absent' },
      { label: 'Excused', value: 'Excused' },
      { label: 'Late', value: 'Late' }
  ];
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.classActivityId = params['id'] ? Number(params['id']) : null;
      this.loadAttendance();
    });
  }

  onCodeExpired() {
    this.showCountdown = false; // ẩn component countdown
    this.attendanceService.renew(this.classActivityId!).pipe(
      catchError((error) => {
        this.toastr.error('Server error or network issue!', 'Error');
        // this.location.back();
        return EMPTY;
      })
    ).subscribe((response) => {
      if (response.code === 200) {
        this.attendanceCode = response.result.attendanceCode;
      
        const updatedDate = new Date(response.result.updateAt);
        const targetTime = updatedDate.getTime() + 30000; // cộng 30000ms
        const now = Date.now();
      
        // Tính số giây còn lại (không âm)
        this.countdownDuration = Math.max(0, Math.floor((targetTime - now) / 1000));
        this.showCountdown = true;
      
        this.loadAttendance();
      }
    });

  }
  

  loadAttendance() {
      if (this.classActivityId !== null) {
        this.attendanceService.getAttendanceSession(this.classActivityId!).pipe(
          catchError((error) => {
            this.toastr.error('Server error or network issue!', 'Error');
            // this.location.back();
            return EMPTY;
          })
        ).subscribe((response) => {
          if (response.code === 200) {
            this.attendanceRecords = response.result;
          }
        });
      } else {
        // this.location.back();
      }
    }

    getSeverity(status: string) {
      switch (status) {
        case 'Present':
          return 'success';
        case 'Excused':
          return 'info';
        case 'Absent':
          return 'danger';
        case 'Late':
          return 'warning';
        default:
          return 'secondary';
      }
    }

    isRoleDepartement(): boolean {
      return this.authService.getRole() === "DEPARTMENT";
    }

    createAttendanceSession(): void {
      this.attendanceService.createAttendanceSession(this.classActivityId!).pipe(
        catchError((error) => {
          if(error.error.code === 1046 || error.error.code === 1052){
            this.toastr.error(error.error.message, 'Error');
          } else{
            this.toastr.error('Server error or network issue!', 'Error');
          }
          // this.location.back();
          return EMPTY;
        })
      ).subscribe((response) => {
        if (response.code === 200) {
          this.openAttendanceCodeModal(response.result.attendanceCode);
        
          const updatedDate = new Date(response.result.updateAt);
          const targetTime = updatedDate.getTime() + 30000; // cộng 30000ms
          const now = Date.now();
        
          // Tính số giây còn lại (không âm)
          this.countdownDuration = Math.max(0, Math.floor((targetTime - now) / 1000));
          this.showCountdown = true;
        
          this.loadAttendance();
        }
      });
    }

    openAttendanceCodeModal(code: string): void {
      this.attendanceCode = code;
      this.showCountdown = false; // reset component con
    
      // Delay nhỏ để Angular remove & re-add component
      setTimeout(() => {
        this.showCountdown = true;
      }, 0);
    
      const modalElement = document.getElementById('attendanceCodeModal');
      if (modalElement) {
        this.modalInstance = new bootstrap.Modal(modalElement);
        this.modalInstance.show();
      }
    }

    openAttendanceModal(){
      const modalElement = document.getElementById('attendanceModal');
      this.modalInstance = new bootstrap.Modal(modalElement!);
      this.modalInstance.show();
    }

    openAttendanceStatusModal(idAttendance: number){
      const modalElement = document.getElementById('attendanceUpdate');
      this.modalInstance = new bootstrap.Modal(modalElement!);
      this.idAttendance = idAttendance;
      this.modalInstance.show();
    }

    submitCode(): void {
      this.attendanceService.rollCall({ classActivityId: this.classActivityId!, attendanceCode: this.valueCode }).pipe(
        catchError((error) => {
        this.toastr.error('Server error or network issue!', 'Error');
          // this.location.back();
          return EMPTY;
        })
      ).subscribe((response) => {
        if (response.code === 200) {
          if(response.result.success){
            this.toastr.success('Attendance successfully!', 'Success');
            this.loadAttendance();
          }else{
            this.toastr.error('Invalid attendance code!', 'Error');
          }
          this.modalInstance.hide();
        }
      });
    }

    submitStatus(): void {
      this.attendanceService.updateAttendanceSession({ id: this.idAttendance!, attendanceStatus: this.statusUpdate }).pipe(
        catchError((error) => {
          this.toastr.error('Server error or network issue!', 'Error');
            // this.location.back();
            return EMPTY;
          })
      ).subscribe((response) => {
        if (response.code === 200) {
            this.toastr.success('Modify successfully!', 'Success');
            this.loadAttendance();
          this.modalInstance.hide();
        }
      });
    }
}


