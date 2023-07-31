import { Component, OnDestroy } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { filter, map, Observable, startWith, Subject, takeUntil } from "rxjs";
import { ConfirmationModalService } from "src/app/modals/confirmation-modal/confirmation-modal.service";

@Component({
    selector: "app-header",
    templateUrl: "./header.component.html",
    styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnDestroy {
    readonly locale$: Observable<string>;
    private readonly destroy$ = new Subject<void>();

    constructor(
        private dialog: ConfirmationModalService,
        translateService: TranslateService
    ) {
        this.locale$ = translateService.onLangChange.pipe(
            map((c) => c.lang),
            startWith(translateService.currentLang)
        );
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    redirectToLanguageSelectionPage() {
        this.dialog
            .show()
            .pipe(
                filter((c) => !!c),
                takeUntil(this.destroy$)
            )
            .subscribe(() => {
                window.location.assign("/");
            });
    }
}
