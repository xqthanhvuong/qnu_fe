import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivityViewResponse } from '../../../../dto/response/activity-view-response';
import { Table } from 'primeng/table';
import { ActivityViewService } from '../../../../service/activity-view.service';
import { DepartmentResponse } from '../../../../dto/response/department-response';
import { CourseResponse } from '../../../../dto/response/course-response';
import { ClassResponse } from '../../../../dto/response/class-response';
import { ActivitySummary } from '../../../../dto/response/activity-summary';
import { DepartmentService } from '../../../../service/department.service';
import { CourseService } from '../../../../service/course.service';
import { ClassService } from '../../../../service/class.service';
import { ActivityService } from '../../../../service/activity.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../service/auth.service';
import { BaseFilterComponent } from '../../../../core/BaseFilterComponent';

declare var bootstrap: any;
@Component({
  selector: 'app-activity-view',
  templateUrl: './activity-view.component.html',
  styleUrl: './activity-view.component.css',
})
export class ActivityViewComponent extends BaseFilterComponent implements OnInit {
  activityViews: ActivityViewResponse[] = [];
  @ViewChild('dt2') dt2!: Table;
  @ViewChild('filterModal') filterModal!: ElementRef;
  selectedDepartment: DepartmentResponse | null = null;
  selectedCourse: CourseResponse | null = null;
  selectedClass: ClassResponse | null = null;
  selectedActivity: ActivitySummary | null = null;
  departments: DepartmentResponse[] = [];
  courses: CourseResponse[] = [];
  classes: ClassResponse[] = [];
  activities: ActivitySummary[] = [];
  filteredCourses: CourseResponse[] = [];
  filteredDepartments: DepartmentResponse[] = [];
  filteredClasses: ClassResponse[] = [];
  filteredActivities: ActivitySummary[] = [];
  selectedCourseId: number | null = null;
  selectedDepartmentId: number | null = null;
  selectedClassId: number | null = null;
  selectedActivityId: number | null = null;
  isDetail: boolean = false;

  clear(table: Table) {
    table.clear();
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input) {
      this.dt2.filterGlobal(input.value, 'contains');
    }
  }

  constructor(
    private activityViewService: ActivityViewService,
    private departmentService: DepartmentService,
    private courseService: CourseService,
    private classService: ClassService,
    private activityService: ActivityService,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    super();
  }
  ngOnInit(): void {
    console.log('ActivityViewComponent');
    this.route.params.subscribe((params) => {
      this.selectedClassId = params['classId'] ? Number(params['classId']) : null;
      this.selectedActivityId = params['activityId'] ? Number(params['activityId']) : null
      if(this.selectedActivityId !== null){
        this.isDetail = true
      }
    });
    this.loadViews();
    this.loadFilters();
  }

  loadViews(): void {
    this.activityViewService
      .getActivityView({
        courseId: this.selectedCourseId,
        departmentId: this.selectedDepartmentId,
        classId: this.selectedClassId,
        activityId: this.selectedActivityId,
      })
      .subscribe((response) => {
        if (response.code === 200) {
          this.activityViews = response.result;
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
    if (this.selectedClass != null) {
      this.selectedClassId = this.selectedClass.id;
    }
    if (this.selectedActivity != null) {
      this.selectedActivityId = this.selectedActivity.id;
    }
    this.loadViews();
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
    this.activityService.getSummaryActivity().subscribe((response) => {
      if (response.code === 200) {
        this.activities = response.result;
        if (this.selectedActivityId) {
          for (let i = 0; i < this.activities.length; i++) {
            if (this.activities[i].id === this.selectedActivityId) {
              this.selectedActivity = this.activities[i];
            }
          }
        }
      }
    });
  }
}
