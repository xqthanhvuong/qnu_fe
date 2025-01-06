import { Component } from '@angular/core';
import { DepartmentResponse } from '../../../../dto/response/department-response';
import { StaffService } from '../../../../service/staff.service';
import { DepartmentService } from '../../../../service/department.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { StaffRequest } from '../../../../dto/request/staff-request';

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

@Component({
  selector: 'app-staff-add',
  templateUrl: './staff-add.component.html',
  styleUrl: './staff-add.component.css'
})
export class StaffAddComponent {
  isEditMode = false;
  staffId: number | null = null;
  name: string = '';
  birthDate: Date | null = null;;
  gender: string = '';
  email: string = '';
  phoneNumber: string = '';
  selectedDepartment: DepartmentResponse | null = null;
  departments: DepartmentResponse[] = [];
  filteredDepartments: DepartmentResponse[] = [];

  genders = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
  ];

  constructor(
    private staffService: StaffService,
    private departmentService: DepartmentService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDepartments();

    // Check if editing or adding new staff
    this.route.params.subscribe((params) => {
      this.staffId = params['id'] ? Number(params['id']) : null;
      this.isEditMode = !!this.staffId;

      if (this.isEditMode) {
        this.loadStaffDetail(this.staffId!);
      }
    });
  }

  loadDepartments(): void {
    this.departmentService.getDepartmentSummary().subscribe((response) => {
      if (response.code === 200) {
        this.departments = response.result;
      }
    });
  }

  loadStaffDetail(staffId: number): void {
    this.staffService.getStaffById(staffId).subscribe((response) => {
      if (response.code === 200) {
        const staff = response.result;
        this.name = staff.name;
        this.birthDate = new Date(staff.birthDate);
        this.gender = staff.gender;
        this.email = staff.email;
        this.phoneNumber = staff.phoneNumber;
        this.selectedDepartment = this.departments.find(
          (dep) => dep.id === staff.departmentId
        ) ?? null;
      }
    });
  }

  filterDepartment(event: AutoCompleteCompleteEvent): void {
    const query = event.query.toLowerCase();
    this.filteredDepartments = this.departments.filter((dep) =>
      dep.name.toLowerCase().includes(query)
    );
  }

  validateInput(): boolean {
    if (
      !this.name ||
      !this.birthDate ||
      !this.gender ||
      !this.email ||
      !this.phoneNumber ||
      !this.selectedDepartment
    ) {
      this.toastr.error('Please fill in all fields');
      return false;
    }
    return true;
  }

  addStaff(): void {
    if (!this.validateInput()) return;

    const staffRequest: StaffRequest = {
      name: this.name,
      birthDate: this.birthDate!,
      gender: this.gender,
      email: this.email,
      phoneNumber: this.phoneNumber,
      departmentId: this.selectedDepartment!.id,
    };

    this.staffService.createStaff(staffRequest).subscribe((response) => {
      if (response.code === 200) {
        this.toastr.success('Staff added successfully');
        this.router.navigate(['/staff']);
      } else {
        this.toastr.error('Failed to add staff');
      }
    });
  }

  updateStaff(): void {
    if (!this.validateInput()) return;

    const staffRequest: StaffRequest = {
      name: this.name,
      birthDate: this.birthDate!,
      gender: this.gender,
      email: this.email,
      phoneNumber: this.phoneNumber,
      departmentId: this.selectedDepartment!.id,
    };

    this.staffService
      .updateStaff(this.staffId!, staffRequest)
      .subscribe((response) => {
        if (response.code === 200) {
          this.toastr.success('Staff updated successfully');
          this.router.navigate(['/staff']);
        } else {
          this.toastr.error('Failed to update staff');
        }
      });
  }

}
