import { Component, OnInit } from '@angular/core';
import { ClassResponse } from '../../../../dto/response/class-response';
import { StudentService } from '../../../../service/student.service';
import { ClassService } from '../../../../service/class.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentRequest } from '../../../../dto/request/student-request';
import { Location } from '@angular/common';
import { BaseFilterComponent } from '../../../../core/BaseFilterComponent';

@Component({
  selector: 'app-student-add',
  templateUrl: './student-add.component.html',
  styleUrl: './student-add.component.css'
})
export class StudentAddComponent extends BaseFilterComponent implements OnInit {
  isEditMode = false;
  studentId: number | null = null;

  studentCode: string = '';
  name: string = '';
  birthDate: Date | null = null;
  email: string = '';
  gender: string = '';
  selectedClass: ClassResponse | null = null;
  studentPosition: string = '';
  selectedClassId: number | null = null;

  classes: ClassResponse[] = [];
  filteredClasses: ClassResponse[] = [];
  genders = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
  ];
  positions = [
    { label: 'Leader', value: 'ClassLeader' },
    { label: 'Vice Leader', value: 'ViceLeader' },
    { label: 'Secretary', value: 'Secretary' },
    { label: 'Member', value: 'Member' },
  ];

  constructor(
    private studentService: StudentService,
    private classService: ClassService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadClasses();
    this.route.params.subscribe((params) => {
      this.studentId = params['id'] ? Number(params['id']) : null;
      this.isEditMode = !!this.studentId;

      if (this.isEditMode) {
        this.loadStudentDetail(this.studentId!);
      }
    });
  }

  loadClasses(): void {
    this.classService.getClassSummary().subscribe((response) => {
      if (response.code === 200) {
        this.classes = response.result;
        if(this.selectedClassId !== null) {
          this.selectedClass = this.classes.find(
            (cls) => cls.id === this.selectedClassId
          ) ?? null;
      }
      }
    });
  }

  loadStudentDetail(studentId: number): void {
    this.studentService.getStudentById(studentId).subscribe((response) => {
      if (response.code === 200) {
        const student = response.result;
        this.studentCode = student.studentCode;
        this.name = student.name;
        this.birthDate = new Date(student.birthDate);
        this.email = student.email;
        this.gender = student.gender;
        this.selectedClassId = student.classId;
        this.selectedClass = this.classes.find(
          (cls) => cls.id === student.classId
        ) ?? null;
        this.studentPosition = student.studentPosition;
      }
    });
  }

  validateInput(): boolean {
    if (
      !this.studentCode ||
      !this.name ||
      !this.birthDate ||
      !this.email ||
      !this.gender ||
      !this.selectedClass ||
      !this.studentPosition
    ) {
      this.toastr.error('Please fill in all fields');
      return false;
    }
    return true;
  }

  addStudent(): void {
    if (!this.validateInput()) return;

    const studentRequest: StudentRequest = {
      studentCode: this.studentCode,
      name: this.name,
      birthDate: this.birthDate!,
      email: this.email,
      gender: this.gender,
      classId: this.selectedClass!.id.toString(),
      studentPositionEnum: this.studentPosition,
    };

    this.studentService.createStudent(studentRequest).subscribe((response) => {
      if (response.code === 200) {
        this.toastr.success('Student added successfully');
        this.goBack();
      } else {
        this.toastr.error('Failed to add student');
      }
    });
  }

  updateStudent(): void {
    if (!this.validateInput()) return;

    const studentRequest: StudentRequest = {
      studentCode: this.studentCode,
      name: this.name,
      birthDate: this.birthDate!,
      email: this.email,
      gender: this.gender,
      classId: this.selectedClass!.id.toString(),
      studentPositionEnum: this.studentPosition,
    };

    this.studentService
      .updateStudent(this.studentId!, studentRequest)
      .subscribe((response) => {
        if (response.code === 200) {
          this.toastr.success('Student updated successfully');
          this.goBack();
        } else {
          this.toastr.error('Failed to update student');
        }
      });
  }
  

  goBack(): void {
    this.location.back(); // Quay lại trang trước
  }

}
