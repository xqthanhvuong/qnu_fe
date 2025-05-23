import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ClassResponse } from '../../../../dto/response/class-response';
import { ClassService } from '../../../../service/class.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, fromEvent } from 'rxjs';
import { DepartmentResponse } from '../../../../dto/response/department-response';
import { CourseResponse } from '../../../../dto/response/course-response';
import { DepartmentService } from '../../../../service/department.service';
import { CourseService } from '../../../../service/course.service';
import { AuthService } from '../../../../service/auth.service';
import { StringUtils } from '../../../../until/StringUtils';
import { BaseFilterComponent } from '../../../../core/BaseFilterComponent';

declare var bootstrap: any;
@Component({
  selector: 'app-class-list',
  templateUrl: './class-list.component.html',
  styleUrl: './class-list.component.css',
})
export class ClassListComponent extends BaseFilterComponent implements OnInit {
  classes: ClassResponse[] = [];
  totalRecords: number = 0;
  rows: number = 7;
  first: number = 0;
  page: number = 0;
  @ViewChild('filterModal') filterModal!: ElementRef;
  itemIdToDelete: number | null = null;
  private modalInstance: any;

  //for filter
  selectedClass: ClassResponse | null = null;
  selectedFile: File | null = null;
  selectedDepartment: DepartmentResponse | null = null;
  selectedCourse: CourseResponse | null = null;
  departments: DepartmentResponse[] = [];
  courses: CourseResponse[] = [];
  filteredCourses: CourseResponse[] = [];
  filteredDepartments: DepartmentResponse[] = [];
  selectedCourseId: number | null = null;
  selectedDepartmentId: number | null = null;
  role: string = '';
  searchInputValue: string = '';
  
  isMyClass: boolean = false;


  constructor(
    private classService: ClassService,
    private router: Router,
    private toastr: ToastrService,
    private departmentService: DepartmentService,
    private courseService: CourseService,
    public authService: AuthService
  ) {
    super();
  }

  ngOnInit(): void {
    if(this.isActive("/my-class")){
      this.isMyClass = true;
    }
    if(this.isMyClass){
      this.loadMyClasses();
    }
    else{
      this.role = this.authService.getRole();
      this.loadClasses({ page: 0, rows: this.rows });
      this.loadFilters();
    }
  }

  loadMyClasses(){
    this.classService.getMyClasses().subscribe((response)=>{
      if(response.code === 200){
        this.classes = response.result;
        this.totalRecords = response.result.length;
      }
    })
  }

  onSelectedFilter() {
    if (this.selectedCourse != null) {
      this.selectedCourseId = this.selectedCourse.id;
    }
    if (this.selectedDepartment != null) {
      this.selectedDepartmentId = this.selectedDepartment.id;
    }
    this.loadClasses({ page: 0, rows: this.rows });
    const modalElement = this.filterModal.nativeElement;
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance.hide();
  }

  isRoleAdmin(): boolean {
    return this.role == 'SUPERADMIN';
  }


  loadClasses(event: any = { page: 0, rows: 2 }): void {
    this.page = event.page;
    const size = event.rows;
    if(this.isMyClass){

    }
    this.classService
      .searchClasses({
        page: this.page,
        size,
        filter: {
          keyWord: this.searchInputValue,
          courseId: this.selectedCourseId,
          departmentId: this.selectedDepartmentId,
        },
      })
      .subscribe((response) => {
        if (response.code === 200) {
          this.classes = response.result.content;
          this.totalRecords = response.result.totalItems;
        }
      });
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
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.loadClasses({ page: event.page, rows: event.rows });
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

  editClass(clazz: ClassResponse) {
    this.classService.setClassRequest({
      name: clazz.name,
      courseId: clazz.courseId,
      departmentId: clazz.departmentId,
      durationYears: clazz.durationYears,
    });
    this.router.navigate(['/class/edit', clazz.id]);
  }

  detailClass(clazz: ClassResponse){
    if(this.isMyClass){
      this.router.navigate(['/my-class/detail', clazz.id]);
    }else{

      this.router.navigate(['/class/detail', clazz.id]);
    }
  }

  navigateAddClass(): void {
    this.router.navigateByUrl('/class/add');
  }

  isActive(url: string): boolean {
    return this.router.url.startsWith(url);
  }


  onKeywordChange(keyword: string) {
    this.searchInputValue = keyword;         
    this.loadClasses({ page: 0, rows: this.rows });
  }

  deleteClass = (id: number) =>
    this.classService.deleteClass(id);

  uploadClass = (file: File) =>
    this.classService.uploadCSV(file);
}
