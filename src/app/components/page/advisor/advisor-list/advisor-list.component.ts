import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AdvisorResponse } from '../../../../dto/response/Advisor-response';
import { AdvisorService } from '../../../../service/advisor.service';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, fromEvent } from 'rxjs';
import { Router } from '@angular/router';
import { DepartmentResponse } from '../../../../dto/response/department-response';
import { CourseResponse } from '../../../../dto/response/course-response';
import { ClassResponse } from '../../../../dto/response/class-response';
import { DepartmentService } from '../../../../service/department.service';
import { CourseService } from '../../../../service/course.service';
import { ClassService } from '../../../../service/class.service';
import { AuthService } from '../../../../service/auth.service';

declare var bootstrap: any;
interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

@Component({
  selector: 'app-advisor-list',
  templateUrl: './advisor-list.component.html',
  styleUrls: ['./advisor-list.component.css']
})
export class AdvisorListComponent implements OnInit {
  advisors: AdvisorResponse[] = [];
  totalRecords: number = 0;
  rows: number = 7;
  first: number = 0;
  page: number = 0;
  private modalInstance: any;
  itemIdToDelete: number | null = null;

  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef;
  @ViewChild('filterModal') filterModal!: ElementRef;

  // Filter Options
  selectedAcademicYear: string | null = null;
  filteredAcademicYears: string[] = [];
  academicYears: string[] = [];

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

  constructor(
    private advisorService: AdvisorService,
    private toastr: ToastrService,
    private router: Router,
    private departmentService: DepartmentService,
    private courseService: CourseService,
    private classService: ClassService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadAdvisors({ page: 0, rows: this.rows });
    this.initializeSearch();
    this.loadFilters();
  }

  loadAdvisors(event: any = { page: 0, rows: 7 }): void {
    this.advisorService
      .searchAdvisors({
        page: event.page,
        size: event.rows,
        filter: {
          keyWord: this.searchInput.nativeElement.value,
          academicYear: this.selectedAcademicYear,
          departmentId: this.selectedDepartmentId,
          courseId: this.selectedCourseId,
          classId: this.selectedClassId
        }
      })
      .subscribe((response) => {
        if (response.code === 200) {
          this.advisors = response.result.content;
          this.totalRecords = response.result.totalItems;
        }
      });
  }

  initializeSearch(): void {
    fromEvent(this.searchInput.nativeElement, 'input')
      .pipe(debounceTime(500))
      .subscribe(() => {
        this.loadAdvisors({ page: 0, rows: this.rows });
      });
  }

  navigateAddAdvisor(): void {
    this.router.navigateByUrl('/advisors/add');
  }

  editAdvisor(advisorId: number): void {
    this.router.navigate(['/advisors/edit', advisorId]);
  }

  onPageChange(event: any): void {
    this.first = event.first;
    this.rows = event.rows;
    this.loadAdvisors({ page: event.page, rows: event.rows });
  }

  openDeleteModal(id: number): void {
    this.itemIdToDelete = id;
    const modalElement = document.getElementById('deleteModal');
    this.modalInstance = new bootstrap.Modal(modalElement!);
    this.modalInstance.show();
  }

  confirmDelete(): void {
    if (this.itemIdToDelete !== null) {
      this.deleteAdvisor(this.itemIdToDelete);
      this.itemIdToDelete = null;
      this.modalInstance.hide();
    }
  }

  deleteAdvisor(advisorId: number): void {
    this.advisorService.deleteAdvisor(advisorId).subscribe((response) => {
      if (response.code === 200) {
        this.toastr.success('Advisor deleted successfully');
        this.loadAdvisors({ page: this.page, rows: this.rows });
      }
    });
  }

  filterAcademicYears(event: any): void {
    const query = event.query.toLowerCase();
    this.filteredAcademicYears = this.academicYears.filter((year) =>
      year.toLowerCase().includes(query)
    );
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
    this.loadAdvisors({ page: 0, rows: this.rows });
    const modalElement = this.filterModal.nativeElement;
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance.hide();
  }


  
  filterDepartment(event: AutoCompleteCompleteEvent) {
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < (this.departments as any[]).length; i++) {
      let department = (this.departments as any[])[i];
      if (department.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(department);
      }
    }

    this.filteredDepartments = filtered;
  }

  filterCourse(event: AutoCompleteCompleteEvent) {
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < (this.courses as any[]).length; i++) {
      let course = (this.courses as any[])[i];
      if (course.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(course);
      }
    }

    this.filteredCourses = filtered;
  }

  filterClass(event: AutoCompleteCompleteEvent) {
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < (this.classes as any[]).length; i++) {
      let clazz = (this.classes as any[])[i];
      if (clazz.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(clazz);
      }
    }

    this.filteredClasses = filtered;
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
    this.advisorService.getAcademicYears().subscribe((response) => {
      if (response.code === 200) {
        this.academicYears = response.result;
      }
    });
  }
}
