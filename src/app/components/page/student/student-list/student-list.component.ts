import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { StudentResponse } from '../../../../dto/response/student-response';
import { StudentService } from '../../../../service/student.service';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, fromEvent } from 'rxjs';
import { DepartmentResponse } from '../../../../dto/response/department-response';
import { CourseResponse } from '../../../../dto/response/course-response';
import { ClassService } from '../../../../service/class.service';
import { CourseService } from '../../../../service/course.service';
import { DepartmentService } from '../../../../service/department.service';
import { ClassResponse } from '../../../../dto/response/class-response';
import { Router } from '@angular/router';
import { AuthService } from '../../../../service/auth.service';
import { BaseFilterComponent } from '../../../../core/BaseFilterComponent';


declare var bootstrap: any;
@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.css'
})
export class StudentListComponent extends BaseFilterComponent implements OnInit {
  students: StudentResponse[] = [];
  totalRecords: number = 0;
  rows: number = 7;
  first: number = 0;
  page: number = 0;
  private modalInstance: any;
  itemIdToDelete: number | null = null;
  @ViewChild('filterModal') filterModal!: ElementRef;
  selectedDepartment: DepartmentResponse | null = null;
  selectedCourse: CourseResponse | null = null;
  selectedClass: ClassResponse | null = null;
  departments: DepartmentResponse[] = [];
  courses: CourseResponse[] = [];
  classes: ClassResponse[] = [];
  filteredCourses: CourseResponse[] = [];
  filteredDepartments: DepartmentResponse[] = [];
  filteredClasses: ClassResponse[] = [];
  selectedCourseId: number | null = null;
  selectedDepartmentId: number | null = null;
  selectedClassId: number | null = null;
  selectedFile: File | null = null;
  fileName: string = '';
  searchInputValue: string = '';


  constructor(
    private studentService: StudentService,
    private toastr: ToastrService,
    private departmentService: DepartmentService,
    private courseService: CourseService,
    private classService: ClassService,
    private router: Router,
    public authService: AuthService
  ) {
    super();
  }
  ngOnInit(): void {
    this.loadStudents({ page: 0, rows: this.rows });
    this.loadFilters();
  }


  loadStudents(event: any = { page: 0, rows: 7 }): void {
    this.studentService
      .searchStudent({
        page: event.page,
        size: event.rows,
        filter: { keyWord: this.searchInputValue,
          courseId: this.selectedCourseId,
          departmentId: this.selectedDepartmentId,
          classId: this.selectedClassId
        },
      })
      .subscribe((response) => {
        if (response.code === 200) {
          this.students = response.result.content;
          this.totalRecords = response.result.totalItems;
        }
      });
  }


  navigateAddStudent(){
    this.router.navigateByUrl('/students/add');
  }

  editStudent(studentId: number) {
    this.router.navigate(['/students/edit', studentId]);
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.loadStudents({ page: event.page, rows: event.rows });
  }

  openDeleteModal(id: number) {
    this.itemIdToDelete = id;
    const modalElement = document.getElementById('deleteModal');
    this.modalInstance = new bootstrap.Modal(modalElement!);
    this.modalInstance.show();
  }


  onSelectedFilter() {
    if (this.selectedCourse != null) {
      this.selectedCourseId = this.selectedCourse.id;
    }
    if (this.selectedDepartment != null) {
      this.selectedDepartmentId = this.selectedDepartment.id;
    }
    if (this.selectedClass!= null) {
      this.selectedClassId = this.selectedClass.id;
    }
    this.loadStudents({ page: 0, rows: this.rows });
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
    this.courseService.getCourseSummary().subscribe((response) => {
      if (response.code === 200) {
        this.courses = response.result;
      }
    });
    this.classService.getClassSummary().subscribe((response) => {
      if (response.code === 200) {
        this.classes = response.result;
      }
    });
  }


  
  onKeywordChange(keyword: string) {
    this.searchInputValue = keyword;         
    this.loadStudents({ page: 0, rows: this.rows });
  }

  deleteStudent = (id: number) =>
    this.studentService.deleteStudent(id);
  
  uploadStudent = (file: File) =>
    this.studentService.uploadCSV(file);
}
