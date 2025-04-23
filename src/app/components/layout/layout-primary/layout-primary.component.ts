import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { WebSocketService } from '../../../service/websocket.service';
import { NotificationResponse } from '../../../dto/response/notification-response';
import { NotiService } from '../../../service/noti.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../service/language.service';



@Component({
  selector: 'app-layout-primary',
  templateUrl: './layout-primary.component.html',
  styleUrl: './layout-primary.component.css',
})
export class LayoutPrimaryComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  username: string = '';
  role: string = '';
  notiCount: number = 0;
  isLoading: boolean = false;
  currentPage: number = 0; // Trang hiện tại
  pageSize: number = 10;
  isLastPage: boolean = false;
  notifications: NotificationResponse[] = [];
  isPopupVisible: boolean = false;
  private isBrowser: boolean;
  currentLanguage = 'en';

  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object,
    private websocketService: WebSocketService,
    private notiService: NotiService,
    private translate: TranslateService,
    private languageService: LanguageService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  toggleNotification(): void {
    if(this.notiCount > 0){
      this.notiService.setReadAll().subscribe({
        next: (response) => {
          if (response.code === 200) {
            this.notiCount = 0;
            this.websocketService.refreshNotiCount();
          }
        },
        error: (error) => {
          console.error('Error in setReadAll:', error); // Log lỗi để xác định nguồn gốc
        }
      });
    }
    this.loadNotifications();
    this.isPopupVisible = !this.isPopupVisible;
  }

  closePopupOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.notification-icon')) {
      this.isPopupVisible = false;
    }
  }

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
    });
    this.authService.userName$.subscribe((name) => {
      this.username = name;
    });
    this.role = this.authService.getRole();
    if (this.isBrowser) {
      document.addEventListener('click', this.closePopupOutside.bind(this));
    }
    this.websocketService.notiCount$.subscribe((count) => {
      this.notiCount = count;
    });
    this.currentLanguage = this.languageService.getLanguage();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    if (this.isBrowser) {
      document.removeEventListener('click', this.closePopupOutside.bind(this));
    }
  }

  private loadNotifications(): void {
    this.isLoading = true;
    this.currentPage = 0; // Reset trang hiện tại

    const request = {
      page: this.currentPage,
      size: this.pageSize,
      sortBy: "createdAt",
      direction: "desc"
    };
    this.notiService.getNotification(request).subscribe({
      next: (response) => {
        if (response.code === 200) {
          this.notifications = response.result.content;
          this.isLastPage = response.result.last;
          if (!this.isLastPage) {
            this.currentPage++;
          }
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error in getNotification:', error); // Log lỗi để xác định nguồn gốc
        this.isLoading = false; // Đảm bảo trạng thái không bị kẹt
      }
    });
    
  }
  loadMoreNotifications(): void {
    this.isLoading = true;
    const request = {
      page: this.currentPage,
      size: this.pageSize,
      sortBy: "createdAt",
      direction: "desc"
    };
    this.notiService.getNotification(request).subscribe({
      next: (response) => {
        if (response.code === 200) {
          const newNotifications = response.result.content;
          this.notifications = [...this.notifications, ...newNotifications];
          this.isLastPage = response.result.last;
          if (!this.isLastPage) {
            this.currentPage++;
          }
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error in getNotification:', error); // Log lỗi để xác định nguồn gốc
        this.isLoading = false; // Đảm bảo trạng thái không bị kẹt
      }
    });
  }

  onScroll(event: any): void {
    const element = event.target;

    // Kiểm tra nếu người dùng cuộn đến cuối danh sách
    if (
      element.scrollTop + element.clientHeight >= element.scrollHeight &&
      !this.isLoading && !this.isLastPage
    ) {
      this.loadMoreNotifications();
      console.log('Load more notifications');
    }
  }


  switchLanguage(language: string) {
    this.languageService.setLanguage(language); // Đổi ngôn ngữ
    this.currentLanguage = language; // Cập nhật biến ngôn ngữ
  }
}
