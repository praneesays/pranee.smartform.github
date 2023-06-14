import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-locale-selector-modal',
  templateUrl: './locale-selector-modal.component.html',
  styleUrls: ['./locale-selector-modal.component.scss']
})
export class LocaleSelectorModalComponent {
  localeForm!: FormGroup;
  constructor(
      private readonly dialogRef: MatDialogRef<LocaleSelectorModalComponent>,
      private formBuilder: FormBuilder,
      private router: Router
  ) {
      this.localeForm = this.formBuilder.group({
        locale: this.formBuilder.group({
          country: ['', Validators.required],
          language: ['', Validators.required]
        })
      });
  }

  onSubmit() {
    if (this.localeForm?.valid) {
      const formValue = this.localeForm.value.locale;
      this.router.navigateByUrl(`/${formValue.language}`);
    }
  }

}
