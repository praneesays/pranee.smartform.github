import { NgModule, APP_INITIALIZER } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from "./material.module";
import { AppComponent } from './app.component';
import { IntroductionBottomSheetComponent } from './bottom-sheets/introduction-bottom-sheet/introduction-bottom-sheet.component';
import { LotNumberHelpBottomSheetComponent } from './bottom-sheets/lot-number-help-bottom-sheet/lot-number-help-bottom-sheet.component';
import { ImageMapComponent } from './components/image-map/image-map.component';
import { ImageSectionHighlightComponent } from './components/image-section-highlight/image-section-highlight.component';
import { ImageUploadComponent } from './components/image-upload/image-upload.component';
import { ComplaintFormComponent } from './components/complaint-form/complaint-form.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ProblemDescriptionFormComponent } from './components/problem-description-form/problem-description-form.component';
import { LocaleSelectorModalComponent } from './modals/locale-selector-modal/locale-selector-modal.component';
import { LocaleSelectorComponent } from './components/locale-selector/locale-selector.component';
import { LuxonDateAdapter, MatLuxonDateModule } from '@angular/material-luxon-adapter';
import { DateAdapter } from '@angular/material/core';
import { Router } from '@angular/router';
import { tokenRouterListener } from './shared/token.router.listener';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    ImageUploadComponent,
    ImageMapComponent,
    IntroductionBottomSheetComponent,
    ImageSectionHighlightComponent,
    LotNumberHelpBottomSheetComponent,
    ComplaintFormComponent,
    HeaderComponent,
    FooterComponent,
    ProblemDescriptionFormComponent,
    LocaleSelectorModalComponent,
    LocaleSelectorComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    MatLuxonDateModule,
    NgOptimizedImage,
    NgCircleProgressModule.forRoot({
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: "#78C000",
      innerStrokeColor: "#C7E596",
      animationDuration: 300
    }),
    NgbModule
  ],
  providers: [
    {
      provide: DateAdapter,
      useClass: LuxonDateAdapter,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: tokenRouterListener,
      deps: [Router],
      multi: true
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
