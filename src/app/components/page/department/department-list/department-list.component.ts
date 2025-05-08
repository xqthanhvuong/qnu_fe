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
  itemIdToDelete: number | null = null;
  private modalInstance: any;
  selectedDepartment: DepartmentResponse | null = null;
  selectedFile: File | null = null;
  fileName: string = '';
  searchInputValue: string = ''; 

  constructor(
    private departmentService: DepartmentService,
    private router: Router,
    private toastr: ToastrService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadDepartments({ page: 0, rows: this.rows }); // Tải dữ liệu lần đầu
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
        filter: {keyWord:this.searchInputValue},
      })
      .subscribe((response) => {
        if (response.code === 200) {
          this.departments = response.result.content; // Lưu danh sách phòng ban
          this.totalRecords = response.result.totalItems; // Cập nhật tổng số bản ghi
        }
      });
  }


  /* DepartmentListComponent */
onKeywordChange(keyword: string) {
  this.searchInputValue = keyword;          // <- nếu cần lưu để export
  this.loadDepartments({ page: 0, rows: this.rows });
}


  openDeleteModal(id: number) {
    this.itemIdToDelete = id;
    const modalElement = document.getElementById('deleteModal');
    this.modalInstance = new bootstrap.Modal(modalElement!);
    this.modalInstance.show();
  }

  deleteDepartment = (id: number) =>
    this.departmentService.deleteDepartment(id);

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

  openDepartmentModal(department: DepartmentResponse) {
    this.selectedDepartment = department;
    const modalElement = document.getElementById('departmentModal');
    const modalInstance = new bootstrap.Modal(modalElement);
    modalInstance.show();
  }

  uploadDepartment = (file: File) =>
    this.departmentService.uploadCSV(file);
}
