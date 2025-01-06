import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ClassActivityResponse } from '../../../../dto/response/class-activity-response';
import { DepartmentResponse } from '../../../../dto/response/department-response';
import { CourseResponse } from '../../../../dto/response/course-response';
import { ClassResponse } from '../../../../dto/response/class-response';
import { ToastrService } from 'ngx-toastr';
import { DepartmentService } from '../../../../service/department.service';
import { CourseService } from '../../../../service/course.service';
import { ClassService } from '../../../../service/class.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ClassActivityService } from '../../../../service/class-activity.service';
import { ActivitySummary } from '../../../../dto/response/activity-summary';
import { ActivityService } from '../../../../service/activity.service';
import { ActivityViewService } from '../../../../service/activity-view.service';
import { AuthService } from '../../../../service/auth.service';

declare var bootstrap: any;
interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}
interface status{
  name: string;
  code: String;
}

@Component({
  selector: 'app-class-activity-list',
  templateUrl: './class-activity-list.component.html',
  styleUrl: './class-activity-list.component.css',
})
export class ClassActivityListComponent implements OnInit {
  classActivityList: ClassActivityResponse[] = [];
  rows: number = 7;
  first: number = 0;
  page: number = 0;
  totalRecords: number = 0;

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
  selectedStatus: status[] = [];
  status: status[] = [
    { name: 'Planned', code: 'PLANNED' },
    { name: 'Ongoing', code: 'ONGOING' },
    { name: 'Completed', code: 'COMPLETED' },
    { name: 'Cancelled', code: 'CANCELLED' },
  ];
  

  constructor(
    private toastr: ToastrService,
    private departmentService: DepartmentService,
    private courseService: CourseService,
    private classService: ClassService,
    private router: Router,
    private classActivityService: ClassActivityService,
    private activityService: ActivityService,
    private route: ActivatedRoute,
    private activityViewService: ActivityViewService,
    public authService: AuthService
  ) {}

  getSeverity(status: string) {
    switch (status) {
      case 'PLANNED':
        return 'secondary';
      case 'ONGOING':
        return 'info';
      case 'COMPLETED':
        return 'success';
      case 'CANCELLED':
        return 'danger';
      default:
        return 'secondary';
    }
  }
  ngOnInit(): void {
    if(this.isActive("/my-class")){
      this.route.params.subscribe((params) => {
        this.selectedClassId= params['id'] ? Number(params['id']) : null;  
        this.loadClassActivities({ page: 0, rows: this.rows });
        this.loadFilters();
      });
    }else{
      this.route.params.subscribe((params) => {
        this.selectedActivityId = params['id'] ? Number(params['id']) : null;  
        this.loadClassActivities({ page: 0, rows: this.rows });
        this.loadFilters();
      });
    }
    
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.loadClassActivities({ page: event.page, rows: event.rows });
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
    this.loadClassActivities({ page: 0, rows: this.rows });
    const modalElement = this.filterModal.nativeElement;
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance.hide();
  }

  loadClassActivities(event: any = { page: 0, rows: 7 }): void {
    let statusFilter: String[] | null = null;
    if(this.selectedStatus.length > 0){
      statusFilter = this.selectedStatus.map(status => status.code);
    }
    this.classActivityService
      .searchClassActivities({
        page: event.page,
        size: event.rows,
        filter: {
          courseId: this.selectedCourseId,
          departmentId: this.selectedDepartmentId,
          classId: this.selectedClassId,
          activityId: this.selectedActivityId,
          activityStatus: statusFilter
        },
      })
      .subscribe((response) => {
        if (response.code === 200) {
          this.classActivityList = response.result.content;
          this.totalRecords = response.result.totalItems;
        }
      });
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

  navigateAttendance(id: number){
    this.router.navigate(['/my-class/activity/attendance', id]);
  }

  navigateAttendanceAdmin(id: number){
    this.router.navigate(['/activity/attendance', id]);
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

  isPlanned(status: string): boolean {
    return status === 'PLANNED';
  }

  filterActivity(event: AutoCompleteCompleteEvent) {
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < (this.activities as any[]).length; i++) {
      let activity = (this.activities as any[])[i];
      if (activity.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(activity);
      }
    }

    this.filteredActivities = filtered;
  }

  
  activityDetail(activityId: number, classActivityId: number): void {
    if(this.isRoleStudent()){
      this.activityViewService.view(classActivityId).subscribe();
    }
    this.router.navigate(['my-class/activity/guide', activityId]);
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
        if(this.selectedActivityId){
          for (let i = 0; i < this.activities.length; i++) {
            if (this.activities[i].id === this.selectedActivityId) {
              this.selectedActivity = this.activities[i];
            }
          }
        }
      }
    });
  }

  navigateToTime(id: number){
    this.router.navigate(['/my-class/class-activity/time', id]);
  }

  navigateToDetail(id: number){
    this.router.navigate(['my-class/activity/minutes', id]);
  }

  navigateToDetailAdmin(id: number){
    this.router.navigate(['activity/minutes', id]);
  }

  navigateActivityView(classId: number){
    this.router.navigateByUrl(`activity-view/${classId}/${this.selectedActivityId}`);
  }

  isActive(url: string): boolean {
    return this.router.url.startsWith(url);
  }

  isRoleStudent(): boolean {
    return this.authService.getRole() == 'STUDENT';
  }

  isRoleDepartment(): boolean {
    return this.authService.getRole() == 'DEPARTMENT';
  }

}
