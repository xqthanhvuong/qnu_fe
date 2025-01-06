import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CourseResponse } from '../../../../dto/response/course-response';
import { CourseService } from '../../../../service/course.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { debounceTime, fromEvent } from 'rxjs';
import { AuthService } from '../../../../service/auth.service';

declare var bootstrap: any;

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrl: './course-list.component.css',
})
export class CourseListComponent implements OnInit {
  courses: CourseResponse[] = [];
  totalRecords: number = 0;
  rows: number = 7;
  first: number = 0;
  page: number = 0;
  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef;
  itemIdToDelete: number | null = null;
  private modalInstance: any;
  selectedCourse: CourseResponse | null = null;
  selectedFile: File | null = null;

  constructor(
    private courseService: CourseService,
    private router: Router,
    private toastr: ToastrService,
    public authService: AuthService
  ) {}

  loadCourses(event: any = { page: 0, rows: 2 }): void {
    this.page = event.page;
    const size = event.rows;
    this.courseService
      .searchCourses({
        page: this.page,
        size,
        filter: { keyWord: this.searchInput.nativeElement.value },
      })
      .subscribe((response) => {
        if (response.code === 200) {
          this.courses = response.result.content;
          this.totalRecords = response.result.totalItems;
        }
      });
  }
  initializeSearch(): void {
    fromEvent(this.searchInput.nativeElement, 'input')
      .pipe(debounceTime(500))
      .subscribe(() => {
        const searchValue = this.searchInput.nativeElement.value;
        this.loadCourses({ page: 0, rows: this.rows });
      });
  }

  ngOnInit(): void {
    this.loadCourses({ page: 0, rows: this.rows });
    this.initializeSearch();
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.loadCourses({ page: event.page, rows: event.rows });
  }
  openDeleteModal(id: number) {
    this.itemIdToDelete = id;
    const modalElement = document.getElementById('deleteModal');
    this.modalInstance = new bootstrap.Modal(modalElement!);
    this.modalInstance.show();
  }

  confirmDelete() {
    if (this.itemIdToDelete !== null) {
      this.deleteCourse(this.itemIdToDelete);
      this.itemIdToDelete = null;
      this.modalInstance.hide();
    }
  }

  deleteCourse(courseId: number): void {
    this.courseService.deleteCourse(courseId).subscribe((response) => {
      if (response.code === 200) {
        this.loadCourses({ page: this.page, rows: this.rows });
      }
    });
  }

  navigateToEdit(courseId: number): void {
    this.router.navigate(['/batch/edit', courseId]);
  }
  navigateToAdd(): void {
    this.router.navigate(['/batch/add']);
  }




  uploadCSVFile(){
    if (this.selectedFile) {
      this.courseService.uploadCSV(this.selectedFile).subscribe(
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

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      this.selectedFile = file;
    } else {
      this.toastr.error('Please select a valid Excel file.', 'Invalid File');
      this.selectedFile = null;
    }
}


  downloadCSVTemplate() {
    const link = document.createElement('a');
    link.href = 'http://localhost:8000/AMQNU/api/courses/download-template'; // API tải file mẫu
    link.download = 'departments_template.csv';
    link.click();
  }
}
