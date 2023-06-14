import { Component, OnInit } from '@angular/core';
import { Observable, filter, first, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IntroductionBottomSheetComponent } from './bottom-sheets/introduction-bottom-sheet/introduction-bottom-sheet.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ProgressBarService } from './services/progress-bar.service';
import { LocaleSelectorModalService } from './modals/locale-selector-modal/locale-selector-modal.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  isFormPage: boolean = false;
  progress: number = 0;
  currentStep: number = 1;
  totalSteps = 5;

  readonly authorized$: Observable<boolean>;

  constructor(
    private readonly bottomSheet: MatBottomSheet,
    private progressBarService: ProgressBarService,
    private dialog: LocaleSelectorModalService,
    activedRoute: ActivatedRoute,
    router: Router
  ) {
    if (environment.token) {
      this.authorized$ = activedRoute.queryParamMap.pipe(
        map((c) => c.get('token')),
        map((c) => c === environment.token)
      );
    } else {
      this.authorized$ = of(true);
    }

    // router.events.subscribe((event) => {
    //   if (event instanceof NavigationEnd) {
    //     this.isFormPage = event.url === "/complaint-form"
    //   }
    // })
  }

  ngOnInit() {
    this.authorized$
      .pipe(
        filter((c) => c),
        first()
      )
      .subscribe(() => {
        this.bottomSheet.open(IntroductionBottomSheetComponent, {
          backdropClass: 'blurred-backdrop',
        });
      });

    this.progress = this.progressBarService.getProgressValue();
    // this.dialog.show();
    // this.totalSteps = this.progressBarService.getTotalSteps();

    this.progressBarService.progressValueChange.subscribe((value: number) => {
      this.progress = value;
      this.calculateSteps();
    })
  }

  calculateSteps() {
    this.currentStep = Math.ceil((this.progress / 100) * this.totalSteps);
  }
}
