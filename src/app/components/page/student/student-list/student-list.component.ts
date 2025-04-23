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
  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef;
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
    this.initializeSearch();
    this.loadFilters();
  }


  loadStudents(event: any = { page: 0, rows: 7 }): void {
    this.studentService
      .searchStudent({
        page: event.page,
        size: event.rows,
        filter: { keyWord: this.searchInput.nativeElement.value,
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

  initializeSearch(): void {
    fromEvent(this.searchInput.nativeElement, 'input')
      .pipe(debounceTime(500))
      .subscribe(() => {
        this.loadStudents({ page: 0, rows: this.rows });
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

  confirmDelete() {
    if (this.itemIdToDelete !== null) {
      this.deleteStudent(this.itemIdToDelete);
      this.itemIdToDelete = null;
      this.modalInstance.hide();
    }
  }

  deleteStudent(studentId: number): void {
    this.studentService.deleteStudent(studentId).subscribe((response) => {
      if (response.code === 200) {
        this.loadStudents({ page: this.page, rows: this.rows });
      }
    });
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

  downloadCSVTemplate() {
    const link = document.createElement('a');
    link.href = 'http://localhost:8000/AMQNU/api/students/download-template'; // API tải file mẫu
    link.download = 'students_template.csv';
    link.click();
  }

  
  uploadCSVFile() {
    if (this.selectedFile) {
      this.studentService.uploadCSV(this.selectedFile).subscribe(
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
}
