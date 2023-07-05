import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmationModalComponent } from "./confirmation-modal.component";

@Injectable({
    providedIn: "root"
})
export class ConfirmationModalService {
    constructor(private readonly dialog: MatDialog) {}

    show() {
        const dialogRef = this.dialog.open(ConfirmationModalComponent, {
            width: "400px",
            height: "300px",
            minWidth: "300px",
            disableClose: true,
            closeOnNavigation: true,
            backdropClass: "bgdrop",
            position: {
                top: "0px"
            },
            delayFocusTrap: false,
            enterAnimationDuration: 10
        });

        return dialogRef.afterClosed();
    }
}
