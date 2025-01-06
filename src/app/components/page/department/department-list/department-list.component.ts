import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DepartmentResponse } from '../../../../dto/response/department-response';
import { DepartmentService } from '../../../../service/department.service';
import { debounceTime, fromEvent } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../service/auth.service';

declare var bootstrap: any;

@Component({
  selector: 'app-department-list',
  templateUrl: './department-list.component.html',
  styleUrls: ['./department-list.component.css'],
})
export class DepartmentListComponent implements OnInit {
  departments: DepartmentResponse[] = [];
  totalRecords: number = 0;
  rows: number = 7;
  first: number = 0;
  page: number = 0;
  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef;
  itemIdToDelete: number | null = null;
  private modalInstance: any;
  selectedDepartment: DepartmentResponse | null = null;
  selectedFile: File | null = null;

  constructor(
    private departmentService: DepartmentService,
    private router: Router,
    private toastr: ToastrService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadDepartments({ page: 0, rows: this.rows }); // Tải dữ liệu lần đầu
    this.initializeSearch();
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.loadDepartments({ page: event.page, rows: event.rows });
  }

  loadDepartments(event: any = { page: 0, rows: 2 }): void {
    this.page = event.page; // PrimeNG paginator sử dụng chỉ số bắt đầu từ 0
    const size = event.rows;
    this.departmentService
      .searchDepartments({
        page: this.page,
        size,
        filter: { keyWord: this.searchInput.nativeElement.value },
      })
      .subscribe((response) => {
        if (response.code === 200) {
          this.departments = response.result.content; // Lưu danh sách phòng ban
          this.totalRecords = response.result.totalItems; // Cập nhật tổng số bản ghi
        }
      });
  }

  initializeSearch(): void {
    fromEvent(this.searchInput.nativeElement, 'input')
      .pipe(debounceTime(500))
      .subscribe(() => {
        const searchValue = this.searchInput.nativeElement.value;
        this.loadDepartments({ page: 0, rows: this.rows });
      });
  }

  openDeleteModal(id: number) {
    this.itemIdToDelete = id;
    const modalElement = document.getElementById('deleteModal');
    this.modalInstance = new bootstrap.Modal(modalElement!);
    this.modalInstance.show();
  }

  confirmDelete() {
    if (this.itemIdToDelete !== null) {
      this.deleteDepartment(this.itemIdToDelete);
      this.itemIdToDelete = null;
      this.modalInstance.hide();
    }
  }

  navigateAddDepartment(): void {
    this.router.navigateByUrl('/department/add');
  }

  editDepartment(department: DepartmentResponse): void {
    this.departmentService.setDepartmentRequest({
      name: department.name,
      urlLogo: department.urlLogo,
    });
    this.router.navigateByUrl(`/department/edit/${department.id}`);
  }

  deleteDepartment(departmentId: number): void {
    // Gọi service để xóa phòng ban
    this.departmentService
      .deleteDepartment(departmentId)
      .subscribe((response) => {
        if (response.code === 200) {
          this.loadDepartments({ page: this.page, rows: this.rows }); // Tải lại danh sách sau khi xóa thành công
        }
      });
  }

  openDepartmentModal(department: DepartmentResponse) {
    this.selectedDepartment = department;
    const modalElement = document.getElementById('departmentModal');
    const modalInstance = new bootstrap.Modal(modalElement);
    modalInstance.show();
  }
  downloadCSVTemplate() {
    const link = document.createElement('a');
    link.href = 'http://localhost:8000/AMQNU/api/departments/download-template'; // API tải file mẫu
    link.download = 'departments_template.csv';
    link.click();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      this.selectedFile = file;
    } else {
      this.toastr.error('Please select a valid Excel file.', 'Invalid File');
      this.selectedFile = null;
    }
}


  uploadCSVFile() {
    if (this.selectedFile) {
      this.departmentService.uploadCSV(this.selectedFile).subscribe(
        (response) => {
          if (response.code === 200) {
            this.toastr.success('CSV file uploaded successfully!', 'Success');
            this.selectedFile = null;
            return;
          }
          console.error('Error uploading CSV');
          this.toastr.error('Failed to upload CSV file.', 'Error');
        },
        (error) => {
          console.error('Error uploading CSV:', error);
          this.toastr.error('Failed to upload CSV file.', 'Error');
        }
      );
    } else {
      this.toastr.warning('Please select a CSV file to upload.', 'Warning');
    }
  }
}
