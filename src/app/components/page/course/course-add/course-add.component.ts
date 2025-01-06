import { Component } from '@angular/core';
import { CourseService } from '../../../../service/course.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseRequest } from '../../../../dto/request/course-requesr';

@Component({
  selector: 'app-course-add',
  templateUrl: './course-add.component.html',
  styleUrl: './course-add.component.css'
})
export class CourseAddComponent {
  isEditMode = false;
  courseId: number | null = null;

  // Input fields
  name: string = '';
  startYear: number | null = null;
  endYear: number | null = null;

  constructor(
    private courseService: CourseService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check if editing or adding new course
    this.route.params.subscribe((params) => {
      this.courseId = params['id'] ? Number(params['id']) : null;
      this.isEditMode = !!this.courseId;

      if (this.isEditMode) {
        this.loadCourseDetail(this.courseId!);
      }
    });
  }

  loadCourseDetail(courseId: number): void {
    this.courseService.getCourseById(courseId).subscribe((response) => {
      if (response.code === 200) {
        const course = response.result;
        this.name = course.name;
        this.startYear = course.startYear;
        this.endYear = course.endYear;
      } else {
        this.toastr.error('Failed to load course details');
        this.router.navigate(['/courses']);
      }
    });
  }

  validateInput(): boolean {
    if (!this.name || !this.startYear || !this.endYear) {
      this.toastr.error('Please fill in all fields');
      return false;
    }
    if (this.startYear >= this.endYear) {
      this.toastr.error('Start year must be less than end year');
      return false;
    }
    return true;
  }

  addCourse(): void {
    if (!this.validateInput()) return;

    const courseRequest: CourseRequest = {
      name: this.name,
      startYear: this.startYear!,
      endYear: this.endYear!,
    };

    this.courseService.createCourse(courseRequest).subscribe((response) => {
      if (response.code === 200) {
        this.toastr.success('Course added successfully');
        this.router.navigate(['/courses']);
      } else {
        this.toastr.error('Failed to add course');
      }
    });
  }

  updateCourse(): void {
    if (!this.validateInput()) return;

    const courseRequest: CourseRequest = {
      name: this.name,
      startYear: this.startYear!,
      endYear: this.endYear!,
    };

    this.courseService.updateCourse(this.courseId!, courseRequest).subscribe((response) => {
      if (response.code === 200) {
        this.toastr.success('Course updated successfully');
        this.router.navigate(['/courses']);
      } else {
        this.toastr.error('Failed to update course');
      }
    });
  }
}
