import {
  Component, Input, Output, EventEmitter
} from '@angular/core';
import { Observable, isObservable, of } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

type DeleteFn = (id: number) => Observable<any> | Promise<any>;

@Component({
  selector: 'app-confirm-delete-modal',
  templateUrl: './confirm-delete-modal.component.html',
  styleUrls: ['./confirm-delete-modal.component.css']
})
export class ConfirmDeleteModalComponent {
  /* cấu hình */
  @Input() modalId = 'confirmDeleteModal';
  @Input() title = 'Confirm delete';
  @Input() message = 'Are you sure?';
  @Input() itemId: number | null = null;                  // ID cần xoá
  @Input() deleteFn!: DeleteFn;              // hàm xoá cha truyền

  @Output() done = new EventEmitter<void>(); // báo cha reload list

  loading = false;

  constructor(private toast: ToastrService) {}

  /** Nhấn YES → gọi deleteFn, emit done, đóng modal */
  onConfirm() {
    if (!this.deleteFn || this.itemId == null) return;

    this.loading = true;

    const result = this.deleteFn(this.itemId);

    (isObservable(result) ? result : of(result))
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => {
          this.toast.success('Deleted successfully');
          this.done.emit();
          (window as any).bootstrap
            .Modal.getInstance(
              document.getElementById(this.modalId) as HTMLElement
            )
            ?.hide();
        },
        error: () => this.toast.error('Delete failed')
      });
  }
}
