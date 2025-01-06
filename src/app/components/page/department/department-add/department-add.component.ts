import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DepartmentService } from '../../../../service/department.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-department-add',
  templateUrl: './department-add.component.html',
  styleUrl: './department-add.component.css',
})
export class DepartmentAddComponent implements OnInit {
  isEditMode: boolean = false;
  departmentId: number | null = null;
  departmentName: string = '';
  imageUrl: string | null = null;
  readonly cloudName = 'djpmekvyd';
  readonly uploadPreset = 'goij6nrl';

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private departmentService: DepartmentService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.departmentId = params['id'] ? Number(params['id']) : null;
      this.isEditMode = !!this.departmentId;
      if (this.isEditMode) {
        this.departmentName =
          this.departmentService.getDepartmentRequest()?.name || '';
        this.imageUrl =
          this.departmentService.getDepartmentRequest()?.urlLogo || '';
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.uploadImageToCloudinary(file);
    }
  }

  addDepartment() {
    if (this.departmentName && this.imageUrl) {
      this.departmentService
        .createDepartment({ name: this.departmentName, urlLogo: this.imageUrl })
        .subscribe((response) => {
          if (response.code === 200) {
            this.toastr.success('Department added successfully!', 'Success');
            this.router.navigate(['/department']);
          } else {
            this.toastr.error('Failed to add department!', 'Error');
          }
        });
    } else {
      this.toastr.warning('Please fill in all required fields!', 'Warning');
    }
  }

  editDepartment() {
    if (this.departmentName && this.imageUrl && this.departmentId) {
      this.departmentService
        .updateDepartment(this.departmentId, {
          name: this.departmentName,
          urlLogo: this.imageUrl,
        })
        .subscribe((response) => {
          if (response.code === 200) {
            this.toastr.success('Department updated successfully!', 'Success');
            this.router.navigate(['/department']);
          } else {
            this.toastr.error('Failed to update department!', 'Error');
          }
        });
    } else {
      this.toastr.warning('Please fill in all required fields!', 'Warning');
    }
  }

  uploadImageToCloudinary(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset); 

    this.http
      .post(
        `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`,
        formData
      )
      .subscribe(
        (response: any) => {
          this.imageUrl = response.secure_url; 
          console.log('Image uploaded successfully:', this.imageUrl);
        },
        (error) => console.error('Error uploading image:', error)
      );
  }
}
