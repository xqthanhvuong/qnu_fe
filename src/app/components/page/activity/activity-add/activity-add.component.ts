import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ActivityService } from '../../../../service/activity.service';
import { FileUpload } from 'primeng/fileupload';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivityGuideService } from '../../../../service/activity-guide.service';
import { DepartmentGuideService } from '../../../../service/department-guide.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-activity-add',
  templateUrl: './activity-add.component.html',
  styleUrls: ['./activity-add.component.css']
})
export class ActivityAddComponent implements OnInit {
  @ViewChild('fileUpload') fileUpload!: FileUpload;
  isLoading: boolean = false;
  files: File[] = [];
  totalSize: number = 0;
  totalSizePercent: number = 0;
  idActivity: number | null = null;
  

  constructor(
    private messageService: MessageService,
    private activityService: ActivityService,
    private activityGuideService: ActivityGuideService,
    private route: ActivatedRoute,
    private departmentGuideService: DepartmentGuideService,
    private router: Router,
    private location: Location
  ) {}
  ngOnInit(): void {
    if(!this.isActive('/activity/add')){
      this.route.params.subscribe((params) => {
        this.idActivity = params['id'] ? Number(params['id']) : null;  
      });
      if(!this.idActivity){
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "can't find activity id", life: 3000 });
        this.location.back();
      }
    }
  }

  choose(event: MouseEvent, chooseCallback: Function) {
    chooseCallback();
  }

  isActive(url: string): boolean {
    return this.router.url.startsWith(url);
  }

  // Hàm để upload file lên server
  uploadFiles() {
    console.log("Upload button clicked");
    if (!this.files || this.files.length === 0) {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'No files selected', life: 3000 });
      return;
    }

    const formData = new FormData();
    const metadata: { name: string }[] = [];

    this.files.forEach((file: File) => {
      formData.append('files', file, file.name);
      metadata.push({ name: this.getFileNameWithoutExtension(file.name) });
    });

    formData.append('metadata', JSON.stringify(metadata));
    this.isLoading = true; 

    if(this.isActive('/activity/add')){
      this.upLoadActivity(formData);
    }else if(this.isActive('/activity-guide/add') && this.idActivity){
      this.upLoadGuide(formData);
    }else if(this.isActive('/department-guide/add') && this.idActivity){
      this.upLoadDepartmentGuide(formData);
    }
  }


  upLoadActivity(formData: any){
    this.activityService.uploadActivity(formData).subscribe(
      (response) => {
        this.isLoading = false;
        if (response.code === 200) {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'File Uploaded', life: 3000 });
          this.fileUpload.clear();
          this.files = [];
          this.totalSize = 0;
          this.totalSizePercent = 0;
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'File upload failed', life: 3000 });
        }
      },
      error => {
        this.isLoading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred', life: 3000 });
      }
    );
  }

  upLoadGuide(formData: any){
    this.activityGuideService.addGuides(this.idActivity!,formData).subscribe(
      (response) => {
        this.isLoading = false;
        if (response.code === 200) {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'File Uploaded', life: 3000 });
          this.fileUpload.clear();
          this.files = [];
          this.totalSize = 0;
          this.totalSizePercent = 0;
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'File upload failed', life: 3000 });
        }
      },
      error => {
        this.isLoading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred', life: 3000 });
      }
    );
  }

  upLoadDepartmentGuide(formData: any){
    this.departmentGuideService.addGuides(this.idActivity!,formData).subscribe(
      (response) => {
        this.isLoading = false;
        if (response.code === 200) {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'File Uploaded', life: 3000 });
          this.fileUpload.clear();
          this.files = [];
          this.totalSize = 0;
          this.totalSizePercent = 0;
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'File upload failed', life: 3000 });
        }
      },
      error => {
        this.isLoading = false;
        console.error('Upload failed:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred', life: 3000 });
      }
    );
  }



  // Hàm để xóa các file đã chọn
  clearFiles(clearCallback: Function) {
    clearCallback();
    this.files = [];
    this.totalSize = 0;
    this.totalSizePercent = 0;
  }

  // Hàm được gọi khi upload thành công (có thể thêm logic bổ sung nếu cần)
  onTemplatedUpload() {
    this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
  }


  onSelectedFiles(event: { currentFiles: File[] }) {
    this.files = event.currentFiles;
    this.totalSize = 0;
    this.files.forEach((file: File) => {
      this.totalSize += file.size;
    });
    this.totalSizePercent = (this.totalSize / 20000000) * 100; 
  }

  handleFileRemove(event: any) {
    this.totalSize -= event.file.size;
    this.totalSizePercent = (this.totalSize / 20000000) * 100;

    this.messageService.add({ severity: 'info', summary: 'Removed', detail: `${event.file.name} đã được xóa.`, life: 3000 });
  }


  formatSize(bytes: number): string {
    const k = 1024;
    const dm = 2; 
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) {
      return `0 ${sizes[0]}`;
    }
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));
    return `${formattedSize} ${sizes[i]}`;
  }

  getFileNameWithoutExtension(fileName: string): string {
    if (!fileName) return '';

    const lastDotIndex = fileName.lastIndexOf('.');
    
    if (lastDotIndex <= 0) return fileName;

    return fileName.substring(0, lastDotIndex);
}

}
