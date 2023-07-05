import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Subject, takeUntil } from "rxjs";
import { ConfirmationModalService } from "src/app/modals/confirmation-modal/confirmation-modal.service";
import { LanguageService, Locale } from "src/app/services/language.service";

@Component({
    selector: "app-header",
    templateUrl: "./header.component.html",
    styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit, OnDestroy {
    locale?: Locale | null;
    private readonly destroy$ = new Subject<void>();

    constructor(
        private dialog: ConfirmationModalService,
        private languageService: LanguageService,
        private router: Router
    ) {}

    ngOnInit() {
        this.languageService.selectedLocale$
            .pipe(takeUntil(this.destroy$))
            .subscribe((locale) => {
                this.locale = locale;
            });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    redirectToLanguageSelectionPage() {
        this.dialog
            .show()
            .pipe(takeUntil(this.destroy$))
            .subscribe((confirmed) => {
                if (confirmed) {
                    this.locale = null;
                    this.languageService.clearSelectedLocale();
                    this.router.navigate([""]);
                }
            });
    }
}
