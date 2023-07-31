import { NgOptimizedImage } from "@angular/common";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { APP_INITIALIZER, NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
    LuxonDateAdapter,
    MatLuxonDateModule
} from "@angular/material-luxon-adapter";
import { DateAdapter } from "@angular/material/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { Router } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { NgCircleProgressModule } from "ng-circle-progress";
import { ProductsApiServiceMock } from "./api/products-api.service-mock";
import { UiLocalizationApiService } from "./api/ui-localization-api.service";
import { UiLocalizationApiServiceMock } from "./api/ui-localization-api.service-mock";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { IntroductionBottomSheetComponent } from "./bottom-sheets/introduction-bottom-sheet/introduction-bottom-sheet.component";
import { LotNumberHelpBottomSheetComponent } from "./bottom-sheets/lot-number-help-bottom-sheet/lot-number-help-bottom-sheet.component";
import { BrandFormGridSelectorComponent } from "./components/brand-form-grid-selector/brand-form-grid-selector.component";
import { ContactUsComponent } from "./components/contact-us/contact-us.component";
import { FooterComponent } from "./components/footer/footer.component";
import { HeaderComponent } from "./components/header/header.component";
import { ImageMapComponent } from "./components/image-map/image-map.component";
import { ImageSectionHighlightComponent } from "./components/image-section-highlight/image-section-highlight.component";
import { ImageSelectorComponent } from "./components/image-selector/image-selector.component";
import { ImageUploadComponent } from "./components/image-upload/image-upload.component";
import { LocaleSelectorComponent } from "./components/locale-selector/locale-selector.component";
import { ComplaintDescriptionComponent } from "./components/stepper/complaint-details/complaint-description/complaint-description.component";
import { ComplaintDetailsComponent } from "./components/stepper/complaint-details/complaint-details.component";
import { ImageHotspotComponent } from "./components/stepper/complaint-details/image-hotspot/image-hotspot.component";
import { ComplaintReportingComponent } from "./components/stepper/complaint-reporting/complaint-reporting.component";
import { ReviewComponent } from "./components/stepper/review/review.component";
import { StepperComponent } from "./components/stepper/stepper.component";
import { ContactInformationComponent } from "./components/stepper/user-details/contact-information/contact-information.component";
import { PersonNameComponent } from "./components/stepper/user-details/person-name/person-name.component";
import { UserDetailsComponent } from "./components/stepper/user-details/user-details.component";
import { MaterialModule } from "./material.module";
import { ConfirmationModalComponent } from "./modals/confirmation-modal/confirmation-modal.component";
import { LocaleSelectorModalComponent } from "./modals/locale-selector-modal/locale-selector-modal.component";
import { AddAcceptLanguageHttpInterceptor } from "./shared/localization/add-accept-language.interceptor";
import { ApiTranslationLoader } from "./shared/localization/api-translation-loader";
import { tokenRouterListener } from "./shared/token.router.listener";

@NgModule({
    declarations: [
        AppComponent,
        ImageUploadComponent,
        ImageMapComponent,
        IntroductionBottomSheetComponent,
        ImageSectionHighlightComponent,
        LotNumberHelpBottomSheetComponent,
        HeaderComponent,
        FooterComponent,
        LocaleSelectorModalComponent,
        LocaleSelectorComponent,
        StepperComponent,
        UserDetailsComponent,
        ComplaintReportingComponent,
        ReviewComponent,
        ImageSelectorComponent,
        ContactInformationComponent,
        PersonNameComponent,
        ConfirmationModalComponent,
        ImageHotspotComponent,
        ComplaintDetailsComponent,
        ComplaintDescriptionComponent,
        BrandFormGridSelectorComponent,
        ContactUsComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        NgSelectModule,
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
        NgbModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (api: UiLocalizationApiService) =>
                    new ApiTranslationLoader(api),
                deps: [UiLocalizationApiService]
            }
        })
    ],
    providers: [
        {
            provide: DateAdapter,
            useClass: LuxonDateAdapter
        },
        {
            provide: APP_INITIALIZER,
            useFactory: tokenRouterListener,
            deps: [Router],
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AddAcceptLanguageHttpInterceptor,
            multi: true
        },
        ProductsApiServiceMock.makeProvider(),
        UiLocalizationApiServiceMock.makeProvider()
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
