import { Component, OnDestroy } from "@angular/core";
import { Subject, takeUntil } from "rxjs";

@Component({
    selector: "app-footer",
    templateUrl: "./footer.component.html",
    styleUrls: ["./footer.component.scss"]
})
export class FooterComponent implements OnDestroy {
    privacyPolicy = "https://www.janssen.com/privacy-policy";

    private readonly destroy$ = new Subject<void>();

    constructor() {
        // this.languageService.selectedLocale$
        //     .pipe(takeUntil(this.destroy$))
        //     .subscribe((locale) => {
        //         this.privacyPolicy = locale?.privacyPolicy;
        //     });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
