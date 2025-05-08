import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CourseResponse } from '../../../../dto/response/course-response';
import { CourseService } from '../../../../service/course.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
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
  itemIdToDelete: number | null = null;
  private modalInstance: any;
  selectedCourse: CourseResponse | null = null;
  selectedFile: File | null = null;
  searchInputValue: string = '';

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
        filter: { keyWord: this.searchInputValue },
      })
      .subscribe((response) => {
        if (response.code === 200) {
          this.courses = response.result.content;
          this.totalRecords = response.result.totalItems;
        }
      });
  }

  ngOnInit(): void {
    this.loadCourses({ page: 0, rows: this.rows });
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

  deleteCourse = (id: number) =>
    this.courseService.deleteCourse(id);

  navigateToEdit(courseId: number): void {
    this.router.navigate(['/batch/edit', courseId]);
  }
  navigateToAdd(): void {
    this.router.navigate(['/batch/add']);
  }

  onKeywordChange(keyword: string) {
    this.searchInputValue = keyword;          // <- nếu cần lưu để export
    this.loadCourses({ page: 0, rows: this.rows });
  }

  uploadCourse = (file: File) =>
    this.courseService.uploadCSV(file);
}
