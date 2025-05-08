import {
  Component, Input, Output, EventEmitter
} from '@angular/core';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

export interface ApiResponse { code: number; [key: string]: any; }
export type UploadFn = (file: File) => Observable<ApiResponse>;

@Component({
  selector: 'app-upload-modal',
  templateUrl: './upload-modal.component.html',
  styleUrls: ['./upload-modal.component.css']
})
export class UploadModalComponent {
  /* Inputs - mọi thứ parent quyết định */
  @Input() modalId = 'excelUploadModal';          // ID bootstrap modal
  @Input() title = 'Import file';
  @Input() templateUrl!: string;                 // URL tải file mẫu
  @Input() uploadFn!: UploadFn;                  // Hàm upload do parent truyền

  /* Output */
  @Output() finished = new EventEmitter<void>(); // báo cha reload list

  selectedFile: File | null = null;
  fileName = '';

  constructor(private toastr: ToastrService) {}

  /* ----- download template ----- */
  downloadTemplate() {
    window.open(this.templateUrl, '_blank');
  }

  /* ----- file handling ----- */
  private validateFile(file: File | null) {
    const MIME =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    if (file && file.type === MIME) {
      this.selectedFile = file;
      this.fileName = file.name;
    } else {
      this.toastr.error('Please select a valid Excel file.', 'Invalid File');
      this.selectedFile = null;
      this.fileName = '';
    }
  }

  onFileSelected(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0] ?? null;
    this.validateFile(file);
  }

  onDragOver(e: DragEvent) {
    e.preventDefault(); e.stopPropagation();
    (e.currentTarget as HTMLElement).classList.add('drag-over');
  }
  onDrop(e: DragEvent) {
    e.preventDefault(); e.stopPropagation();
    (e.currentTarget as HTMLElement).classList.remove('drag-over');
    this.validateFile(e.dataTransfer?.files[0] ?? null);
  }

  /* ----- upload ----- */
  upload() {
    if (!this.selectedFile || !this.uploadFn) return;

    this.uploadFn(this.selectedFile).subscribe({
      next: (res) => {
        if (res.code === 200) {
          this.toastr.success('File uploaded successfully!', 'Success');
          this.finished.emit();                       
          (window as any).bootstrap
            .Modal.getInstance(
              document.getElementById(this.modalId) as HTMLElement
            )
            ?.hide();
          this.selectedFile = null;
          this.fileName = '';
        } else {
          this.toastr.error('Failed to upload.', 'Error');
        }
      },
      error: () => this.toastr.error('Failed to upload.', 'Error')
    });
  }
}
