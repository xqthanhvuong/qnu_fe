import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ClassDetailResponse } from '../../../../dto/response/class-detail-response';
import { ClassService } from '../../../../service/class.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, debounceTime, EMPTY, fromEvent } from 'rxjs';
import { AuthService } from '../../../../service/auth.service';

@Component({
  selector: 'app-class-detail',
  templateUrl: './class-detail.component.html',
  styleUrl: './class-detail.component.css',
})
export class ClassDetailComponent implements OnInit {
  classDetail: ClassDetailResponse | null = null;
  totalRecords: number = 0;
  rows: number = 7;
  first: number = 0;
  page: number = 0;
  classId: number | null = null;
  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef;
  role: string = '';

  constructor(
    private classService: ClassService,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    public authService: AuthService
  ) {}
  ngOnInit(): void {
    this.role = this.authService.getRole();
    this.route.params.subscribe((params) => {
      this.classId = params['id'] ? Number(params['id']) : null;
      if (this.classId || this.isRoleStudent()) {
        this.loadClasses();
        this.initializeSearch();
      } else {
        this.toastr.error('Class not found');
        this.router.navigate(['/class']);
      }
    });
  }

  loadClasses(event: any = { page: 0, rows: 7 }): void {
    this.page = event.page;
    const size = event.rows;
    if(this.isRoleStudent()){
      this.classService.getMyClassesStudent({
        page: this.page,
        size,
        filter: {
          keyWord: this.searchInput.nativeElement.value,
        },}).subscribe((response) => {
          if (response.code === 200) {
            this.classDetail = response.result;
            this.totalRecords = response.result.total;
            this.classId = response.result.id;
          }
        });
        return;
    }
    if (this.classId == null) {
      return;
    }
    this.classService
      .getClassDetailById(this.classId, {
        page: this.page,
        size,
        filter: {
          keyWord: this.searchInput.nativeElement.value,
        },
      })
      .subscribe((response) => {
        if (response.code === 200) {
          this.classDetail = response.result;
          this.totalRecords = response.result.total;
        }
      });
  }
  initializeSearch(): void {
    fromEvent(this.searchInput.nativeElement, 'input')
      .pipe(debounceTime(500))
      .subscribe(() => {
        const searchValue = this.searchInput.nativeElement.value;
        this.loadClasses({ page: 0, rows: this.rows });
      });
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.loadClasses({ page: event.page, rows: event.rows });
  }

  editStudent(studentId: number) {
    this.router.navigate(['/students/edit', studentId]);
  }

  navigateAddStudent() {
    this.router.navigateByUrl('/students/add');
  }

  navigateClassAcvivity() {
    this.router.navigate(['/my-class/activity', this.classId]);
  }

  isRoleStudent(): boolean {
    return this.role == 'STUDENT';
  }

  isActive(url: string): boolean {
    return this.router.url.startsWith(url);
  }
}
