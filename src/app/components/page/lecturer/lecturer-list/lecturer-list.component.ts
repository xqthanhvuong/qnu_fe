import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LecturerResponse } from '../../../../dto/response/lecturer-response';
import { LecturerService } from '../../../../service/lecturer.service';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, fromEvent } from 'rxjs';
import { DepartmentResponse } from '../../../../dto/response/department-response';
import { DepartmentService } from '../../../../service/department.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../../service/auth.service';
import { BaseFilterComponent } from '../../../../core/BaseFilterComponent';

declare var bootstrap: any;

@Component({
  selector: 'app-lecturer-list',
  templateUrl: './lecturer-list.component.html',
  styleUrls: ['./lecturer-list.component.css'],
})
export class LecturerListComponent extends BaseFilterComponent implements OnInit {
  lecturers: LecturerResponse[] = [];
  totalRecords: number = 0;
  rows: number = 7;
  first: number = 0;
  page: number = 0;
  private modalInstance: any;
  selectedFile: File | null = null;
  itemIdToDelete: number | null = null;
  @ViewChild('filterModal') filterModal!: ElementRef;
  selectedDepartment: DepartmentResponse | null = null;
  departments: DepartmentResponse[] = [];
  filteredDepartments: DepartmentResponse[] = [];
  selectedDepartmentId: number | null = null;
  fileName: string = '';
  searchInputValue: string = '';

  constructor(
    private lecturerService: LecturerService,
    private toastr: ToastrService,
    private departmentService: DepartmentService,
    private router: Router,
    public authService: AuthService
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadLecturers({ page: 0, rows: this.rows });
    this.loadFilters();
  }

  loadLecturers(event: any = { page: 0, rows: 7 }): void {
    this.lecturerService
      .searchLecturers({
        page: event.page,
        size: event.rows,
        filter: { keyWord: this.searchInputValue,
          departmentId: this.selectedDepartmentId
         },
      })
      .subscribe((response) => {
        if (response.code === 200) {
          this.lecturers = response.result.content;
          this.totalRecords = response.result.totalItems;
        }
      });
  }


  navigateAddLecturer(){
    this.router.navigate(['/lecturer/add']);
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.loadLecturers({ page: event.page, rows: event.rows });
  }

  editLecturer(lecturer:LecturerResponse){
    this.router.navigate(['/lecturer/edit', lecturer.id]);
  }

  onSelectedFilter() {
    if (this.selectedDepartment != null) {
      this.selectedDepartmentId = this.selectedDepartment.id;
    }
    this.loadLecturers({ page: 0, rows: this.rows });
    const modalElement = this.filterModal.nativeElement;
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance.hide();
  }
  
  openDeleteModal(id: number) {
    this.itemIdToDelete = id;
    const modalElement = document.getElementById('deleteModal');
    this.modalInstance = new bootstrap.Modal(modalElement!);
    this.modalInstance.show();
  }

  confirmDelete() {
    if (this.itemIdToDelete !== null) {
      this.deleteLecturer(this.itemIdToDelete);
      this.itemIdToDelete = null;
      this.modalInstance.hide();
    }
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
    this.loadLecturers({ page: 0, rows: this.rows });
  }

  deleteLecturer = (id: number) =>
    this.lecturerService.deleteLecturer(id);

  uploadLecturer = (file: File) =>
    this.lecturerService.uploadCSV(file);

}
