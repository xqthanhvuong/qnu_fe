import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { LayoutPrimaryComponent } from './components/layout/layout-primary/layout-primary.component';
import { AuthGuard } from './guard/auth.guard';
import { UserComponent } from './components/page/user/user.component';
import { LayoutSidebarComponent } from './components/layout/layout-sidebar/layout-sidebar.component';
import { DepartmentListComponent } from './components/page/department/department-list/department-list.component';
import { DepartmentAddComponent } from './components/page/department/department-add/department-add.component';
import { CourseListComponent } from './components/page/course/course-list/course-list.component';
import { ClassListComponent } from './components/page/class/class-list/class-list.component';
import { ClassAddComponent } from './components/page/class/class-add/class-add.component';
import { StaffListComponent } from './components/page/staff/staff-list/staff-list.component';
import { LecturerListComponent } from './components/page/lecturer/lecturer-list/lecturer-list.component';
import { ClassDetailComponent } from './components/page/class/class-detail/class-detail.component';
import { StudentListComponent } from './components/page/student/student-list/student-list.component';
import { StudentAddComponent } from './components/page/student/student-add/student-add.component';
import { StaffAddComponent } from './components/page/staff/staff-add/staff-add.component';
import { LecturerAddComponent } from './components/page/lecturer/lecturer-add/lecturer-add.component';
import { CourseAddComponent } from './components/page/course/course-add/course-add.component';
import { AdvisorListComponent } from './components/page/advisor/advisor-list/advisor-list.component';
import { AdvisorAddComponent } from './components/page/advisor/advisor-add/advisor-add.component';
import { GuideListComponent } from './components/page/activity-guide/guide-list/guide-list.component';
import { RoleAddComponent } from './components/page/role/role-add/role-add.component';
import { RoleListComponent } from './components/page/role/role-list/role-list.component';
import { RoleDetailComponent } from './components/page/role/role-detail/role-detail.component';
import { ActivityListComponent } from './components/page/activity/activity-list/activity-list.component';
import { ActivityAddComponent } from './components/page/activity/activity-add/activity-add.component';
import { ClassActivityTimeComponent } from './components/page/activity/class-activity-time/class-activity-time.component';
import { ClassActivityListComponent } from './components/page/activity/class-activity-list/class-activity-list.component';
import { AttendanceComponent } from './components/page/activity/attendance/attendance.component';
import { ActivityViewComponent } from './components/page/activity/activity-view/activity-view.component';
import { ActivityMinutesComponent } from './components/page/activity/activity-minutes/activity-minutes.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutPrimaryComponent,
    children: [
      { path: 'login', component: LoginComponent }, 
      { path: '', component: LayoutSidebarComponent, canActivate: [AuthGuard],
        children: [
          {path: '', component: UserComponent},
          {path: 'department', component: DepartmentListComponent},
          {path: 'department/add', component: DepartmentAddComponent},
          {path: 'department/edit/:id', component: DepartmentAddComponent},
          {path: 'batch', component:CourseListComponent},
          {path: 'batch/add', component:CourseAddComponent},
          {path: 'batch/edit/:id', component:CourseAddComponent},
          {path: 'class', component:ClassListComponent},
          {path: 'class/add', component:ClassAddComponent},
          {path: 'class/edit/:id', component:ClassAddComponent},
          {path: 'class/detail/:id', component:ClassDetailComponent},
          {path: 'my-class', component:ClassListComponent},
          {path: 'my-class/detail/:id', component:ClassDetailComponent},
          {path: 'my-class/student', component:ClassDetailComponent},
          {path: 'my-class/activity/:id', component:ClassActivityListComponent},
          {path: 'my-class/activity/attendance/:id', component:AttendanceComponent},
          {path: 'my-class/activity/guide/:id', component:GuideListComponent},
          {path: 'my-class/activity/minutes/:id', component:ActivityMinutesComponent},
          {path: 'my-class/class-activity/time/:id', component:ClassActivityTimeComponent},
          {path: 'activity/attendance/:id', component:AttendanceComponent},

          {path: 'staff', component:StaffListComponent},
          {path: 'staff/add', component:StaffAddComponent},
          {path: 'staff/edit/:id', component:StaffAddComponent},
          {path: 'lecturer', component:LecturerListComponent},
          {path: 'lecturer/add', component:LecturerAddComponent},
          {path: 'lecturer/edit/:id', component:LecturerAddComponent},
          {path: 'students', component:StudentListComponent},
          {path: 'students/add', component:StudentAddComponent},
          {path: 'students/edit/:id', component:StudentAddComponent},
          {path: 'advisors', component:AdvisorListComponent},
          {path: 'advisors/add', component:AdvisorAddComponent},
          {path: 'advisors/edit/:id', component:AdvisorAddComponent},
          {path: 'activity-guide', component:GuideListComponent},
          {path: 'activity-guide/add/:id', component:ActivityAddComponent},
          {path: 'department-guide/add/:id', component:ActivityAddComponent},
          {path: 'activity', component:ActivityListComponent},
          {path: 'activity/guide/:id', component:GuideListComponent},
          {path: 'activity/add', component:ActivityAddComponent},
          {path: 'activity/:id', component:GuideListComponent},
          {path: 'activity-view', component:ActivityViewComponent},
          {path: 'activity-view/:classId/:activityId', component:ActivityViewComponent},
          {path: 'class-activity', component:ClassActivityListComponent},
          {path: 'activity/class-activity/:id', component:ClassActivityListComponent},
          {path: 'role', component:RoleListComponent},
          {path: 'role/add', component:RoleAddComponent},
          {path: 'role/edit/:id', component:RoleAddComponent},
          {path: 'role/detail/:id', component:RoleDetailComponent},
          {path: 'activity/minutes/:id', component: ActivityMinutesComponent},
        ]
      },
    ]
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
