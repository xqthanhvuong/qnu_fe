import { Component } from '@angular/core';
import { LecturerResponse } from '../../../../dto/response/lecturer-response';
import { ClassResponse } from '../../../../dto/response/class-response';
import { AdvisorService } from '../../../../service/advisor.service';
import { LecturerService } from '../../../../service/lecturer.service';
import { ClassService } from '../../../../service/class.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { AdvisorRequest } from '../../../../dto/request/advisor-tequest';
import { BaseFilterComponent } from '../../../../core/BaseFilterComponent';

@Component({
  selector: 'app-advisor-add',
  templateUrl: './advisor-add.component.html',
  styleUrl: './advisor-add.component.css'
})
export class AdvisorAddComponent extends BaseFilterComponent {
  isEditMode = false;
  advisorId: number | null = null;

  // Input fields
  selectedLecturer: LecturerResponse | null = null;
  selectedClass: ClassResponse | null = null;
  academicYear: string = '';

  // Dropdown and autocomplete options
  lecturers: LecturerResponse[] = [];
  classes: ClassResponse[] = [];
  filteredLecturers: LecturerResponse[] = [];
  filteredClasses: ClassResponse[] = [];

  constructor(
    private advisorService: AdvisorService,
    private lecturerService: LecturerService,
    private classService: ClassService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadLecturers();
    this.loadClasses();

    this.route.params.subscribe((params) => {
      this.advisorId = params['id'] ? Number(params['id']) : null;
      this.isEditMode = !!this.advisorId;

      if (this.isEditMode) {
        this.loadAdvisorDetail(this.advisorId!);
      }
    });
  }

  loadLecturers(): void {
    this.lecturerService.getAllLecturers().subscribe((response) => {
      if (response.code === 200) {
        this.lecturers = response.result;
      }
    });
  }

  loadClasses(): void {
    this.classService.getClassSummary().subscribe((response) => {
      if (response.code === 200) {
        this.classes = response.result;
      }
    });
  }

  loadAdvisorDetail(advisorId: number): void {
    this.advisorService.getAdvisorById(advisorId).subscribe((response) => {
      if (response.code === 200) {
        const advisor = response.result;
        this.selectedLecturer = this.lecturers.find(
          (lecturer) => lecturer.id === advisor.lecturerId
        ) ?? null;
        this.selectedClass = this.classes.find(
          (cls) => cls.id === advisor.classId
        ) ?? null;
        this.academicYear = advisor.academicYear;
      }
    });
  }


  validateInput(): boolean {
    if (!this.selectedLecturer || !this.selectedClass || !this.academicYear) {
      this.toastr.error('Please fill in all fields');
      return false;
    }
    return true;
  }

  addAdvisor(): void {
    if (!this.validateInput()) return;

    const advisorRequest: AdvisorRequest = {
      lecturerId: this.selectedLecturer!.id,
      classId: this.selectedClass!.id,
      academicYear: this.academicYear,
    };

    this.advisorService.createAdvisor(advisorRequest).subscribe((response) => {
      if (response.code === 200) {
        this.toastr.success('Advisor added successfully');
        this.router.navigate(['/advisors']);
      } else {
        this.toastr.error('Failed to add advisor');
      }
    });
  }

  updateAdvisor(): void {
    if (!this.validateInput()) return;

    const advisorRequest: AdvisorRequest = {
      lecturerId: this.selectedLecturer!.id,
      classId: this.selectedClass!.id,
      academicYear: this.academicYear,
    };

    this.advisorService.updateAdvisor(this.advisorId!, advisorRequest).subscribe((response) => {
      if (response.code === 200) {
        this.toastr.success('Advisor updated successfully');
        this.router.navigate(['/advisors']);
      } else {
        this.toastr.error('Failed to update advisor');
      }
    });
  }
}
