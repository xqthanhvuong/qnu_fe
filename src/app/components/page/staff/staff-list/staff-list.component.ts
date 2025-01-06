import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { StaffResponse } from '../../../../dto/response/staff-response';
import { StaffService } from '../../../../service/staff.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, fromEvent } from 'rxjs';
import { DepartmentResponse } from '../../../../dto/response/department-response';
import { DepartmentService } from '../../../../service/department.service';
import { AuthService } from '../../../../service/auth.service';

declare var bootstrap: any;
interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

@Component({
  selector: 'app-staff-list',
  templateUrl: './staff-list.component.html',
  styleUrl: './staff-list.component.css'
})
export class StaffListComponent implements OnInit {
  staffs: StaffResponse[] = [];
  totalRecords: number = 0;
  rows: number = 7;
  first: number = 0;
  page: number = 0;
  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef;
  @ViewChild('filterModal') filterModal!: ElementRef;
  selectedFile: File | null = null;
  selectedDepartment: DepartmentResponse | null = null;
  departments: DepartmentResponse[] = [];
  filteredDepartments: DepartmentResponse[] = [];
  selectedDepartmentId: number | null = null;
  itemIdToDelete: number | null = null;
  private modalInstance: any;


  constructor(
    private staffService: StaffService,
    private router: Router,
    private toastr: ToastrService,
    private departmentService: DepartmentService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadStaffs({ page: 0, rows: this.rows });
    this.initializeSearch();
    this.loadFilters();
  }

  loadStaffs(event: any = { page: 0, rows: 7 }): void {
    this.page = event.page;
    const size = event.rows;
    this.staffService
      .searchStaffs({
        page: this.page,
        size,
        filter: {
          keyWord: this.searchInput.nativeElement.value,
          departmentId: this.selectedDepartmentId
        },
      })
      .subscribe((response) => {
        if (response.code === 200) {
          this.staffs = response.result.content;
          this.totalRecords = response.result.totalItems;
        }
      });
  }


  initializeSearch(): void {
    fromEvent(this.searchInput.nativeElement, 'input')
      .pipe(debounceTime(500))
      .subscribe(() => {
        const searchValue = this.searchInput.nativeElement.value;
        this.loadStaffs({ page: 0, rows: this.rows });
      });
  }

  openDeleteModal(id: number) {
    this.itemIdToDelete = id;
    const modalElement = document.getElementById('deleteModal');
    this.modalInstance = new bootstrap.Modal(modalElement!);
    this.modalInstance.show();
  }

  confirmDelete() {
    if (this.itemIdToDelete !== null) {
      this.deleteClass(this.itemIdToDelete);
      this.itemIdToDelete = null;
      this.modalInstance.hide();
    }
  }

  deleteClass(staffId: number): void {
    this.staffService.deleteStaff(staffId).subscribe((response) => {
      if (response.code === 200) {
        this.loadStaffs({ page: this.page, rows: this.rows });
        this.toastr.success('Delete staff successfully');
      }
    });
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.loadStaffs({ page: event.page, rows: event.rows });
  }
  
  navigateAddStaff(){
    this.router.navigateByUrl('/staff/add');
  }

  editStaff(staff: StaffResponse){
    this.router.navigate(['/staff/edit', staff.id]);
  }

  onSelectedFilter() {
    if (this.selectedDepartment != null) {
      this.selectedDepartmentId = this.selectedDepartment.id;
    }
    this.loadStaffs({ page: 0, rows: this.rows });
    const modalElement = this.filterModal.nativeElement;
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance.hide();
  }

  filterDepartment(event: AutoCompleteCompleteEvent) {
    let query = event.query.toLowerCase();

    this.filteredDepartments = this.departments.filter((dep) =>
      dep.name.toLowerCase().includes(query)
    );
  }

  loadFilters(): void {
    this.departmentService.getDepartmentSummary().subscribe((response) => {
      if (response.code === 200) {
        this.departments = response.result;
      }
    });
  }


  downloadCSVTemplate() {
    const link = document.createElement('a');
    link.href = 'http://localhost:8000/AMQNU/api/staffs/download-template'; // API tải file mẫu
    link.download = 'staffs_template.csv';
    link.click();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      this.selectedFile = file;
    } else {
      this.toastr.error('Please select a valid Excel file.', 'Invalid File');
      this.selectedFile = null;
    }
}


  uploadCSVFile() {
    if (this.selectedFile) {
      this.staffService.uploadCSV(this.selectedFile).subscribe(
        (response) => {
          if (response.code === 200) {
            this.toastr.success('CSV file uploaded successfully!', 'Success');
            this.selectedFile = null;
            return;
          }
          console.error('Error uploading CSV');
          this.toastr.error('Failed to upload CSV file.', 'Error');
        },
        (error) => {
          console.error('Error uploading CSV:', error);
          this.toastr.error('Failed to upload CSV file.', 'Error');
        }
      );
    } else {
      this.toastr.warning('Please select a CSV file to upload.', 'Warning');
    }
  }
}
