import { Component, OnInit } from '@angular/core';
import { DepartmentResponse } from '../../../../dto/response/department-response';
import { LecturerService } from '../../../../service/lecturer.service';
import { DepartmentService } from '../../../../service/department.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { LecturerRequest } from '../../../../dto/request/lecturer-request';
import { BaseFilterComponent } from '../../../../core/BaseFilterComponent';

@Component({
  selector: 'app-lecturer-add',
  templateUrl: './lecturer-add.component.html',
  styleUrl: './lecturer-add.component.css'
})
export class LecturerAddComponent extends BaseFilterComponent implements OnInit {
  isEditMode = false;
  lecturerId: number | null = null;
  name: string = '';
  gender: string = '';
  degree: string = '';
  birthDate: Date | null = null;
  phoneNumber: string = '';
  email: string = '';
  selectedDepartment: DepartmentResponse | null = null;
  departments: DepartmentResponse[] = [];
  filteredDepartments: DepartmentResponse[] = [];
  genders = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
  ];
  degrees = [
    { label: "Bachelor's Degree", value: 'Bachelor' },
    { label: "Master's Degree", value: 'Masters' },
    { label: "Doctorate (PhD)", value: 'PhD' },
    { label: "Associate Professor", value: 'Assoc. Prof' },
    { label: "Professor", value: 'Prof' },
  ];

  constructor(
    private lecturerService: LecturerService,
    private departmentService: DepartmentService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadDepartments();

    // Check if editing or adding new lecturer
    this.route.params.subscribe((params) => {
      this.lecturerId = params['id'] ? Number(params['id']) : null;
      this.isEditMode = !!this.lecturerId;

      if (this.isEditMode) {
        this.loadLecturerDetail(this.lecturerId!);
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

  loadLecturerDetail(lecturerId: number): void {
    this.lecturerService.getLecturerById(lecturerId).subscribe((response) => {
      if (response.code === 200) {
        const lecturer = response.result;
        this.name = lecturer.name;
        this.gender = lecturer.gender;
        this.degree = lecturer.degree;
        this.birthDate = new Date(lecturer.birthDate);
        this.phoneNumber = lecturer.phoneNumber;
        this.email = lecturer.email;
        this.selectedDepartment = this.departments.find(
          (dep) => dep.id === lecturer.departmentId
        ) ?? null;
      }
    });
  }

  validateInput(): boolean {
    if (
      !this.name ||
      !this.gender ||
      !this.degree ||
      !this.birthDate ||
      !this.phoneNumber ||
      !this.email ||
      !this.selectedDepartment
    ) {
      this.toastr.error('Please fill in all fields');
      return false;
    }
    return true;
  }

  addLecturer(): void {
    if (!this.validateInput()) return;

    const lecturerRequest: LecturerRequest = {
      name: this.name,
      gender: this.gender,
      degree: this.degree,
      birthDate: this.birthDate!,
      phoneNumber: this.phoneNumber,
      email: this.email,
      departmentId: this.selectedDepartment!.id,
    };

    this.lecturerService.createLecturer(lecturerRequest).subscribe((response) => {
      if (response.code === 200) {
        this.toastr.success('Lecturer added successfully');
        this.router.navigate(['/lecturer']);
      } else {
        this.toastr.error('Failed to add lecturer');
      }
    });
  }

  updateLecturer(): void {
    if (!this.validateInput()) return;

    const lecturerRequest: LecturerRequest = {
      name: this.name,
      gender: this.gender,
      degree: this.degree,
      birthDate: this.birthDate!,
      phoneNumber: this.phoneNumber,
      email: this.email,
      departmentId: this.selectedDepartment!.id,
    };

    this.lecturerService
      .updateLecturer(this.lecturerId!, lecturerRequest)
      .subscribe((response) => {
        if (response.code === 200) {
          this.toastr.success('Lecturer updated successfully');
          this.router.navigate(['/lecturer']);
        } else {
          this.toastr.error('Failed to update lecturer');
        }
      });
  }

}
