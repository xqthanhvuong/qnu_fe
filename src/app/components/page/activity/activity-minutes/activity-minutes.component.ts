import { Component } from '@angular/core';
import { ActivityMinutes } from '../../../../dto/request/activity-minutes';
import { MinutesActivityService } from '../../../../service/minutes-activity.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { catchError, EMPTY } from 'rxjs';

@Component({
  selector: 'app-activity-minutes',
  templateUrl: './activity-minutes.component.html',
  styleUrl: './activity-minutes.component.css'
})
export class ActivityMinutesComponent {
  activityMinutes: ActivityMinutes = {
    classActivityId: null,
    id: null,
    lastMonthActivity: '',
    thisMonthActivity: '',
    teacherFeedback: '',
    classFeedback: ''
  }
  isEdit: boolean = false;
  constructor(
    private minutesActivityService: MinutesActivityService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private toastr: ToastrService
  ){
  }

  ngOnInit(): void {
    if(this.isActive('/my-class')){
      this.isEdit = true;
    }
    this.route.params.subscribe((params) => {
      this.activityMinutes.classActivityId = params['id'] ? Number(params['id']) : null;
      if(this.activityMinutes.classActivityId === null){
        this.toastr.error('Activity not found!', 'Error');
        this.location.back();
      }
      this.loadMinutes();
    });
  }

  loadMinutes(): void {
    this.minutesActivityService.getMinutes(this.activityMinutes.classActivityId!).subscribe(
      (response) => {
        if(response.code === 200){
          this.activityMinutes = response.result;
        }
      }
    );
  }

  saveMinutes(): void {
    this.minutesActivityService.saveMinutes(this.activityMinutes).pipe(
      catchError((error) => {
          if(error.error.code===1046){
            this.toastr.error('You can modify it in this time!', 'Error');
          }
        return EMPTY
      }
    )).subscribe((response) => {
      if(response.code === 200){
        this.toastr.success('Minutes saved successfully!', 'Success');
        this.location.back();
      }else{
        this.toastr.error('Minutes not saved!', 'Error');
      }
    });
  }

  isActive(url: string): boolean {
    return this.router.url.startsWith(url);
  }
}
