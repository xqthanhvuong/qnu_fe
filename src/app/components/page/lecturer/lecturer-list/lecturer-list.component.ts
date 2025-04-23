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
  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef;
  @ViewChild('filterModal') filterModal!: ElementRef;
  selectedDepartment: DepartmentResponse | null = null;
  departments: DepartmentResponse[] = [];
  filteredDepartments: DepartmentResponse[] = [];
  selectedDepartmentId: number | null = null;
  fileName: string = '';

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
    this.initializeSearch();
    this.loadFilters();
  }

  loadLecturers(event: any = { page: 0, rows: 7 }): void {
    this.lecturerService
      .searchLecturers({
        page: event.page,
        size: event.rows,
        filter: { keyWord: this.searchInput.nativeElement.value,
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

  initializeSearch(): void {
    fromEvent(this.searchInput.nativeElement, 'input')
      .pipe(debounceTime(500))
      .subscribe(() => {
        this.loadLecturers({ page: 0, rows: this.rows });
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

  deleteLecturer(lecturerId: number): void {
    this.lecturerService.deleteLecturer(lecturerId).subscribe((response) => {
      if (response.code === 200) {
        this.loadLecturers({ page: this.page, rows: this.rows });
      }
    });
  }

  loadFilters(): void {
    this.departmentService.getDepartmentSummary().subscribe((response) => {
      if (response.code === 200) {
        this.departments = response.result;
      }
    });
  }


  downloadCSVTemplate() {
    const link = document.createElement('a');
    link.href = 'http://localhost:8000/AMQNU/api/lectureres/download-template'; // API tải file mẫu
    link.download = 'lecturer_template.csv';
    link.click();
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const dropArea = event.target as HTMLElement;
    dropArea.classList.add('drag-over');
  }

  // Xử lý khi thả file vào khu vực
  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const dropArea = event.target as HTMLElement;
    dropArea.classList.remove('drag-over');

    const file = event.dataTransfer?.files[0];

    if (
      file &&
      file.type ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      this.selectedFile = file;
      this.fileName = file.name;
    } else {
      this.toastr.error('Please select a valid Excel file.', 'Invalid File');
      this.selectedFile = null;
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (
      file &&
      file.type ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      this.selectedFile = file;
      this.fileName = file.name;
    } else {
      this.toastr.error('Please select a valid Excel file.', 'Invalid File');
      this.selectedFile = null;
    }
  }


  uploadCSVFile() {
    if (this.selectedFile) {
      this.lecturerService.uploadCSV(this.selectedFile).subscribe(
        (response) => {
          if (response.code === 200) {
            this.toastr.success('File uploaded successfully!', 'Success');
            this.selectedFile = null;
            return;
          }
          console.error('Error uploading File');
          this.toastr.error('Failed to upload file.', 'Error');
        },
        (error) => {
          console.error('Error uploading CSV:', error);
          this.toastr.error('Failed to upload file.', 'Error');
        }
      );
    } else {
      this.toastr.warning('Please select a file to upload.', 'Warning');
    }
  }

}
