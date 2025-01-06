import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivityGuideService } from '../../../../service/activity-guide.service';
import { ActivityGuideResponse } from '../../../../dto/response/activity-guide-response';
import { debounceTime, fromEvent } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../service/auth.service';
import { ActivityViewService } from '../../../../service/activity-view.service';

declare var bootstrap: any;
ActivityGuideService;

@Component({
  selector: 'app-guide-list',
  templateUrl: './guide-list.component.html',
  styleUrl: './guide-list.component.css',
})
export class GuideListComponent implements OnInit {
  activityGuides: ActivityGuideResponse[] = [];
  totalRecords: number = 0;
  rows: number = 7;
  first: number = 0;
  page: number = 0;
  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef;
  private modalInstance: any;
  itemIdToDelete: number | null = null;
  isDetail: boolean = false;
  activityId: number | null = null;
  role: string = '';

  constructor(
    private activityGuideService: ActivityGuideService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService,
    private activityViewService: ActivityViewService
  ) {}

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.loadGuides({ page: event.page, rows: event.rows });
  }

  ngOnInit(): void {
    this.role = this.authService.getRole();
    this.route.params.subscribe((params) => {
      this.activityId = params['id'] ? Number(params['id']) : null;
      this.isDetail = !!this.activityId;
      if (this.isDetail) {
        this.loadGuidesActivity(this.activityId!);
      } else {
        this.loadGuides({ page: 0, rows: this.rows });
        this.initializeSearch();
      }
    });
  }

  addGuide() {
    if (this.activityId) {
      if (!this.isDepartmentRole()) {
        console.log('activityId', this.activityId);
        this.router.navigate(['activity-guide/add', this.activityId]);
      } else {
        console.log('activityId de', this.activityId);
        this.router.navigate(['department-guide/add', this.activityId]);
      }
    }else{
      this.router.navigate(['activity']);
    }
  }

  isDepartmentRole() {
    return this.role === 'DEPARTMENT';
  }

  loadGuidesActivity(id: number): void {
    this.activityGuideService.getAllGuides(id).subscribe((response) => {
      if (response.code === 200) {
        this.activityGuides = response.result;
        this.totalRecords = response.result.length;
      }
    });
  }

  loadGuides(event: any = { page: 0, rows: 2 }): void {
    this.page = event.page; // PrimeNG paginator sử dụng chỉ số bắt đầu từ 0
    const size = event.rows;
    this.activityGuideService
      .searchGuides({
        page: this.page,
        size,
        filter: { keyWord: this.searchInput.nativeElement.value },
      })
      .subscribe((response) => {
        if (response.code === 200) {
          this.activityGuides = response.result.content; // Lưu danh sách phòng ban
          this.totalRecords = response.result.totalItems; // Cập nhật tổng số bản ghi
        }
      });
  }

  initializeSearch(): void {
    fromEvent(this.searchInput.nativeElement, 'input')
      .pipe(debounceTime(500))
      .subscribe(() => {
        const searchValue = this.searchInput.nativeElement.value;
        this.loadGuides({ page: 0, rows: this.rows });
      });
  }

  openDeleteModal(id: number): void {
    this.itemIdToDelete = id;
    const modalElement = document.getElementById('deleteModal');
    this.modalInstance = new bootstrap.Modal(modalElement!);
    this.modalInstance.show();
  }

  confirmDelete(): void {
    if (this.itemIdToDelete !== null) {
      this.deleteGuide(this.itemIdToDelete);
      this.itemIdToDelete = null;
      this.modalInstance.hide();
    }
  }

  deleteGuide(id: number): void {
    this.activityGuideService.deleteGuide(id).subscribe((response) => {
      if (response.code === 200) {
        this.toastr.success('Advisor deleted successfully');
        this.loadGuides({ page: this.page, rows: this.rows });
      }
    });
  }

  isRoleStudent(): boolean {
    return this.role == 'STUDENT';
  }

  isActive(url: string): boolean {
    return this.router.url.startsWith(url);
  }

}
