import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/auth/login/login.component';
import { ResetPasswordComponent } from './components/auth/reset-password/reset-password.component';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { LayoutPrimaryComponent } from './components/layout/layout-primary/layout-primary.component';
import { UserComponent } from './components/page/user/user.component';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { AuthGuard } from './guard/auth.guard';
import { LayoutSidebarComponent } from './components/layout/layout-sidebar/layout-sidebar.component';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DepartmentListComponent } from './components/page/department/department-list/department-list.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth/interceptor.service';
import { DepartmentAddComponent } from './components/page/department/department-add/department-add.component';
import { ToastrModule } from 'ngx-toastr';
import { CourseListComponent } from './components/page/course/course-list/course-list.component';
import { ClassListComponent } from './components/page/class/class-list/class-list.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ClassAddComponent } from './components/page/class/class-add/class-add.component';
import { DropdownModule } from 'primeng/dropdown';
import { StaffListComponent } from './components/page/staff/staff-list/staff-list.component';
import { LecturerListComponent } from './components/page/lecturer/lecturer-list/lecturer-list.component';
import { ClassDetailComponent } from './components/page/class/class-detail/class-detail.component';
import { StudentListComponent } from './components/page/student/student-list/student-list.component';
import { StudentAddComponent } from './components/page/student/student-add/student-add.component';
import { CalendarModule } from 'primeng/calendar';
import { StaffAddComponent } from './components/page/staff/staff-add/staff-add.component';
import { LecturerAddComponent } from './components/page/lecturer/lecturer-add/lecturer-add.component';
import { CourseAddComponent } from './components/page/course/course-add/course-add.component';
import { AdvisorListComponent } from './components/page/advisor/advisor-list/advisor-list.component';
import { AdvisorAddComponent } from './components/page/advisor/advisor-add/advisor-add.component';
import { GuideListComponent } from './components/page/activity-guide/guide-list/guide-list.component';
import { RoleDetailComponent } from './components/page/role/role-detail/role-detail.component';
import { RoleAddComponent } from './components/page/role/role-add/role-add.component';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RoleListComponent } from './components/page/role/role-list/role-list.component';
import { TooltipModule } from 'primeng/tooltip';
import { CommonModule } from '@angular/common';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ActivityListComponent } from './components/page/activity/activity-list/activity-list.component';
import { ActivityAddComponent } from './components/page/activity/activity-add/activity-add.component';
import { ToastModule } from 'primeng/toast';
import { ProgressBarModule } from 'primeng/progressbar';
import { BadgeModule } from 'primeng/badge';
import { TagModule } from 'primeng/tag';
import { FileUploadModule } from 'primeng/fileupload';
import { MessageService} from 'primeng/api';
import { GuideDetailComponent } from './components/page/activity/guide-detail/guide-detail.component';
import { ClassActivityListComponent } from './components/page/activity/class-activity-list/class-activity-list.component';
import { ClassActivityTimeComponent } from './components/page/activity/class-activity-time/class-activity-time.component';
import { AttendanceComponent } from './components/page/activity/attendance/attendance.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { RouterModule } from '@angular/router'; 
import { InputOtpModule } from 'primeng/inputotp';
import { ActivityViewComponent } from './components/page/activity/activity-view/activity-view.component';
import { ActivityMinutesComponent } from './components/page/activity/activity-minutes/activity-minutes.component';
import { NotificationComponent } from './components/page/notification/notification.component';
import { RelativeTimePipe } from './relative-time.pipe';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ResetPasswordComponent,
    LayoutPrimaryComponent,
    UserComponent,
    LayoutSidebarComponent,
    DepartmentListComponent,
    DepartmentAddComponent,
    CourseListComponent,
    ClassListComponent,
    ClassAddComponent,
    StaffListComponent,
    LecturerListComponent,
    ClassDetailComponent,
    StudentListComponent,
    StudentAddComponent,
    StaffAddComponent,
    LecturerAddComponent,
    CourseAddComponent,
    AdvisorListComponent,
    AdvisorAddComponent,
    GuideListComponent,
    RoleDetailComponent,
    RoleAddComponent,
    RoleListComponent,
    ActivityListComponent,
    ActivityAddComponent,
    GuideDetailComponent,
    ClassActivityListComponent,
    ClassActivityTimeComponent,
    AttendanceComponent,
    ActivityViewComponent,
    ActivityMinutesComponent,
    NotificationComponent,
    RelativeTimePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    FloatLabelModule,
    InputTextModule,
    PasswordModule,
    HttpClientModule,
    ButtonModule,
    RadioButtonModule,
    ToastModule,
    ProgressBarModule,
    BadgeModule,
    TagModule,
    TooltipModule,
    CommonModule,
    IconFieldModule,
    PaginatorModule,
    TableModule,
    BrowserAnimationsModule,
    InputIconModule,
    FileUploadModule,
    AutoCompleteModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-right', 
      preventDuplicates: false, 
      closeButton: true 
    }),
    DropdownModule,
    CalendarModule,
    MultiSelectModule,
    RouterModule,
    InputOtpModule  
  ],
  providers: [
    AuthGuard,
    MessageService,
    provideClientHydration(),
    provideHttpClient(withFetch()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
