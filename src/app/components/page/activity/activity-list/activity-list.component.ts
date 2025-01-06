import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivityResponse } from '../../../../dto/response/activity-response';
import { ActivityService } from '../../../../service/activity.service';
import { debounceTime, fromEvent } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../../../service/auth.service';

@Component({
  selector: 'app-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrl: './activity-list.component.css',
})
export class ActivityListComponent implements OnInit {
  activityGuides: ActivityResponse[] = [];
  totalRecords: number = 0;
  rows: number = 7;
  first: number = 0;
  page: number = 0;
  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef;

  constructor(
    private activityService: ActivityService,
    private router: Router,
    public authService: AuthService
  ) {}

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.loadGuides({ page: event.page, rows: event.rows });
  }

  ngOnInit(): void {
    this.loadGuides({ page: 0, rows: this.rows }); // Tải dữ liệu lần đầu
    this.initializeSearch();
  }

  loadGuides(event: any = { page: 0, rows: 2 }): void {
    this.page = event.page; // PrimeNG paginator sử dụng chỉ số bắt đầu từ 0
    const size = event.rows;
    this.activityService
      .searchActivity({
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

  activityDetail(activityId: number): void {
    this.router.navigate(['activity', activityId]);
  }

  viewClassActivity(activityId: number): void {
    this.router.navigate(['activity/class-activity', activityId]);
  }

  addActivity(): void {
    this.router.navigate(['activity/add']);
  }

  initializeSearch(): void {
    fromEvent(this.searchInput.nativeElement, 'input')
      .pipe(debounceTime(500))
      .subscribe(() => {
        const searchValue = this.searchInput.nativeElement.value;
        this.loadGuides({ page: 0, rows: this.rows });
      });
  }
}
