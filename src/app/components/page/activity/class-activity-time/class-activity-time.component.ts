import { Component, OnInit } from '@angular/core';
import { ClassActivityResponse } from '../../../../dto/response/class-activity-response';
import { ActivatedRoute } from '@angular/router';
import { ClassActivityService } from '../../../../service/class-activity.service';
import { ToastrService } from 'ngx-toastr';
import {Location} from '@angular/common';

@Component({
  selector: 'app-class-activity-time',
  templateUrl: './class-activity-time.component.html',
  styleUrl: './class-activity-time.component.css'
})
export class ClassActivityTimeComponent implements OnInit {
  activity: ClassActivityResponse | null = null;
  time: Date = new Date();
  originalDate: Date | null = null;

  constructor(
    private route: ActivatedRoute,
    private classActivityService: ClassActivityService,
    private toastr: ToastrService,
    private location: Location
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.classActivityService.getClassActivity(id).subscribe(response => {
      if(response.code === 200){
        this.activity = response.result;
        const dateFromServer = new Date(this.activity.activityTime);
        this.originalDate = new Date(dateFromServer);
        
        this.time = new Date(dateFromServer);
      }
    });
  }

  saveTime(): void {
    if (!this.activity || !this.originalDate) return;
    const newDate = new Date(this.originalDate);
    newDate.setHours(this.time.getHours());
    newDate.setMinutes(this.time.getMinutes());
    newDate.setSeconds(this.time.getSeconds());

    const newActivityTime = newDate.toISOString();
    this.classActivityService.setActivityTime(this.activity.id, newActivityTime)
      .subscribe(response => {
        this.toastr.success('Update new activity time success!', 'Success');
      }, err => {
        this.toastr.error('Error when update', 'Error');
      });
  }

  back(): void {
    this.location.back();
  }

}
