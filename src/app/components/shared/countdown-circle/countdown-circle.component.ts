import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-countdown-circle',
  templateUrl: './countdown-circle.component.html',
  styleUrls: ['./countdown-circle.component.css']
})
export class CountdownCircleComponent implements OnInit, OnDestroy {
  @Input() remainingTime: number = 30; // Thời gian còn lại mà bạn truyền vào
  @Output() countdownFinished = new EventEmitter<void>();

  secondsLeft: number = 0;
  progressOffset: number = 0;
  private radius = 45;
  circumference = 2 * Math.PI * this.radius;

  private rafId: any;

  ngOnInit(): void {
    this.secondsLeft = 30; // Tổng thời gian là 30 giây
    this.startCountdown();
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.rafId);
  }

  private startCountdown(): void {
    const start = performance.now();
    const update = (now: number) => {
      const elapsed = (now - start) / 1000; // Thời gian đã trôi qua trong giây

      // Tính thời gian còn lại trong 30 giây
      const timeLeft = Math.max(0, 30 - elapsed - (30 - this.remainingTime)); // Thời gian còn lại trong 30 giây

      // Cập nhật giá trị secondsLeft để hiển thị
      this.secondsLeft = Math.ceil(timeLeft);

      // Tính phần trăm đã trôi qua trong tổng 30 giây
      const percent = Math.min(elapsed / 30, 1); 

      // Tính toán vị trí bắt đầu vòng tròn
      this.progressOffset = (1 - (this.remainingTime / 30)) * this.circumference;

      // Tính toán phần trăm đã trôi qua từ vị trí ban đầu
      const progress = percent * this.circumference;

      // Cập nhật giá trị vòng tròn
      this.progressOffset = this.progressOffset + progress;

      // Nếu thời gian hết, thông báo đã kết thúc
      if (timeLeft <= 0) {
        this.progressOffset = this.circumference; // Đảm bảo vòng tròn đầy
        this.countdownFinished.emit();
      } else {
        this.rafId = requestAnimationFrame(update);
      }
    };
    this.rafId = requestAnimationFrame(update);
  }
}
