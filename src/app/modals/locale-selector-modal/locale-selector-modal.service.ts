import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { LocaleSelectorModalComponent } from "./locale-selector-modal.component";


@Injectable({
    providedIn: "root"
})

export class LocaleSelectorModalService {
  constructor(private readonly dialog: MatDialog) {}

  show() {
    const dialogRef = this.dialog.open(LocaleSelectorModalComponent, {
      width: "500px",
      height: "500px",
      disableClose: true,
      closeOnNavigation: true,
      backdropClass: "bgdrop"
    })

  }
}