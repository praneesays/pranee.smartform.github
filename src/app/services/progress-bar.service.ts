import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProgressBarService {
  private progressValue: number = 0;
  private totalSteps: number = 0;
  progressValueChange: EventEmitter<number> = new EventEmitter<number>();

  private totalStepsSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private totalSteps$: Observable<number> = this.totalStepsSubject.asObservable();


  setProgressValue(value: number) {
    this.progressValue = value;
    this.progressValueChange.emit(this.progressValue);
  }

  getProgressValue(): number {
    return this.progressValue;
  }

  setTotalSteps(steps: number) {
    this.totalSteps = steps;
  }

  getTotalSteps(): number {
    return this.totalSteps;
  }
  // setTotalSteps(totalSteps: number) {
  //   this.totalStepsSubject.next(totalSteps);
  // }

  // getTotalSteps(): Observable<number> {
  //   return this.totalSteps$;
  // }
}
