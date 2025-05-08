import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { StaffResponse } from '../../../../dto/response/staff-response';
import { StaffService } from '../../../../service/staff.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, fromEvent } from 'rxjs';
import { DepartmentResponse } from '../../../../dto/response/department-response';
import { DepartmentService } from '../../../../service/department.service';
import { AuthService } from '../../../../service/auth.service';
import { BaseFilterComponent } from '../../../../core/BaseFilterComponent';

declare var bootstrap: any;

@Component({
  selector: 'app-staff-list',
  templateUrl: './staff-list.component.html',
  styleUrl: './staff-list.component.css'
})
export class StaffListComponent extends BaseFilterComponent implements OnInit {
  staffs: StaffResponse[] = [];
  totalRecords: number = 0;
  rows: number = 7;
  first: number = 0;
  page: number = 0;
  @ViewChild('filterModal') filterModal!: ElementRef;
  selectedFile: File | null = null;
  selectedDepartment: DepartmentResponse | null = null;
  departments: DepartmentResponse[] = [];
  filteredDepartments: DepartmentResponse[] = [];
  selectedDepartmentId: number | null = null;
  itemIdToDelete: number | null = null;
  private modalInstance: any;
  fileName: string = '';
  searchInputValue: string = '';


  constructor(
    private staffService: StaffService,
    private router: Router,
    private toastr: ToastrService,
    private departmentService: DepartmentService,
    public authService: AuthService
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadStaffs({ page: 0, rows: this.rows });
    this.loadFilters();
  }

  loadStaffs(event: any = { page: 0, rows: 7 }): void {
    this.page = event.page;
    const size = event.rows;
    this.staffService
      .searchStaffs({
        page: this.page,
        size,
        filter: {
          keyWord: this.searchInputValue,
          departmentId: this.selectedDepartmentId
        },
      })
      .subscribe((response) => {
        if (response.code === 200) {
          this.staffs = response.result.content;
          this.totalRecords = response.result.totalItems;
        }
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
      this.deleteClass(this.itemIdToDelete);
      this.itemIdToDelete = null;
      this.modalInstance.hide();
    }
  }

  deleteClass(staffId: number): void {
    this.staffService.deleteStaff(staffId).subscribe((response) => {
      if (response.code === 200) {
        this.loadStaffs({ page: this.page, rows: this.rows });
        this.toastr.success('Delete staff successfully');
      }
    });
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.loadStaffs({ page: event.page, rows: event.rows });
  }
  
  navigateAddStaff(){
    this.router.navigateByUrl('/staff/add');
  }

  editStaff(staff: StaffResponse){
    this.router.navigate(['/staff/edit', staff.id]);
  }

  onSelectedFilter() {
    if (this.selectedDepartment != null) {
      this.selectedDepartmentId = this.selectedDepartment.id;
    }
    this.loadStaffs({ page: 0, rows: this.rows });
    const modalElement = this.filterModal.nativeElement;
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance.hide();
  }

  loadFilters(): void {
    this.departmentService.getDepartmentSummary().subscribe((response) => {
      if (response.code === 200) {
        this.departments = response.result;
      }
    });
  }

  onKeywordChange(keyword: string) {
    this.searchInputValue = keyword;         
    this.loadStaffs({ page: 0, rows: this.rows });
  }

  deleteStaff = (id: number) =>
    this.staffService.deleteStaff(id);
  
  uploadStaff = (file: File) =>
    this.staffService.uploadCSV(file);
}
