import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  constructor(private translate: TranslateService) {
    // Kiểm tra nếu chạy trên client (trình duyệt) mới sử dụng localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedLang = localStorage.getItem('language');
      if (savedLang) {
        this.setLanguage(savedLang); // Áp dụng ngôn ngữ đã lưu
      } else {
        this.setLanguage('en'); // Nếu không có ngôn ngữ, mặc định là tiếng Anh
      }
    } else {
      this.setLanguage('en'); // Mặc định là tiếng Anh nếu không có localStorage
    }
  }

  // Hàm thay đổi ngôn ngữ
  setLanguage(language: string): void {
    this.translate.use(language); // Thay đổi ngôn ngữ
    // Kiểm tra nếu chạy trên client mới lưu vào localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('language', language); // Lưu ngôn ngữ vào localStorage
    }
  }

  // Lấy ngôn ngữ hiện tại
  getLanguage(): string {
    // Kiểm tra nếu chạy trên client mới lấy từ localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('language') || 'en'; // Trả về ngôn ngữ đã lưu hoặc tiếng Anh nếu chưa có
    }
    return 'en'; // Trả về tiếng Anh mặc định khi không có localStorage
  }
}
