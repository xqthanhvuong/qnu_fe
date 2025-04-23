import { Component } from '@angular/core';
import { ClassService } from '../../../../service/class.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DepartmentService } from '../../../../service/department.service';
import { CourseService } from '../../../../service/course.service';
import { DepartmentResponse } from '../../../../dto/response/department-response';
import { CourseResponse } from '../../../../dto/response/course-response';
import { ClassRequest } from '../../../../dto/request/class-request';
import { BaseFilterComponent } from '../../../../core/BaseFilterComponent';

@Component({
  selector: 'app-class-add',
  templateUrl: './class-add.component.html',
  styleUrl: './class-add.component.css',
})
export class ClassAddComponent extends BaseFilterComponent {
  isEditMode = false;
  departments: DepartmentResponse[] = [];
  courses: CourseResponse[] = [];
  className: string = '';
  filteredCourses: CourseResponse[] = [];
  filteredDepartments: DepartmentResponse[] = [];
  selectedDepartment: DepartmentResponse | null = null;
  selectedCourse: CourseResponse | null = null;
  durations: string[] = [];
  selectedDuration: string = '4';
  classId: number | null = null;

  constructor(
    private classService: ClassService,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private departmentService: DepartmentService,
    private courseService: CourseService
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadFilters();
    this.durations = ['4', '4.5', '6'];
    this.route.params.subscribe(params => {
      this.classId = params['id'] ? Number(params['id']) : null;
      this.isEditMode = !!this.classId;
      if (this.isEditMode) {
        let classRequest: ClassRequest | null = this.classService.getClassRequest();
        if (!classRequest) {
          this.toastr.error('Class not found');
          this.router.navigate(['/class']);
          return;
        }
        this.className = classRequest.name || '';
        this.selectedDepartment = { id: classRequest.departmentId } as DepartmentResponse;
        this.selectedCourse = { id: classRequest.courseId} as CourseResponse;
        this.selectedDuration = classRequest.durationYears.toString() || '4';
      }
    })
  }

  updateClass(){
    if (
      this.selectedCourse === null ||
      this.selectedDepartment === null ||
      this.className === '' ||
      this.selectedCourse.id === undefined ||
      this.selectedCourse.id === undefined ||
      this.classId === null ||
      this.classId === undefined
    ){
      this.toastr.error('Please enter and select all fields');
      return;
    }
    let classRequest: ClassRequest = {
      name: this.className,
      departmentId: this.selectedDepartment.id,
      courseId: this.selectedCourse.id,
      durationYears: this.selectedDuration
    };
    this.classService.updateClass(this.classId, classRequest).subscribe(response => {
      if(response.code === 200){
        this.toastr.success('Class updated successfully');
        this.router.navigate(['/class']);
      }else{
        this.toastr.error('Failed to update class');
      }
    });
  }

  loadFilters(): void {
    this.departmentService.getDepartmentSummary().subscribe((response) => {
      if (response.code === 200) {
        this.departments = response.result;
        if(this.isEditMode){
          this.selectedDepartment = this.departments.find(d => d.id === this.selectedDepartment?.id) ?? null;
        }
      }
    });
    this.courseService.getCourseSummary().subscribe((response) => {
      if (response.code === 200) {
        this.courses = response.result;
        if(this.isEditMode){
          this.selectedCourse = this.courses.find(c => c.id === this.selectedCourse?.id) ?? null;
        }
      }
    });
  }

  addClass() {
    if (
      this.selectedCourse === null ||
      this.selectedDepartment === null ||
      this.className === '' ||
      this.selectedCourse.id === undefined ||
      this.selectedCourse.id === undefined
    ) {
      this.toastr.error('Please enter and select all fields');
      return;
    }
    console.log(this.selectedCourse);
    this.classService
      .createClass({
        name: this.className,
        courseId: this.selectedCourse.id,
        departmentId: this.selectedDepartment.id,
        durationYears: this.selectedDuration,
      })
      .subscribe((response) => {
        if (response.code === 200) {
          this.toastr.success('Class added successfully');
          this.router.navigate(['/class']);
        } else {
          this.toastr.error('Failed to add class');
        }
      });
  }

}
