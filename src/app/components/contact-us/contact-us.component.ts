import { Component, ViewChild } from "@angular/core";
import {
    FormGroup,
    FormBuilder,
    Validators,
    NgForm,
} from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
    selector: "app-contact-us",
    templateUrl: "./contact-us.component.html",
    styleUrls: ["./contact-us.component.scss"]
})
export class ContactUsComponent {
    form: FormGroup;
    @ViewChild("myForm") myForm!: NgForm;

    constructor(
        private formBuilder: FormBuilder,
        private snackBar: MatSnackBar
    ) {
        this.form = this.formBuilder.group({
            firstName: ["", Validators.required],
            lastName: ["", Validators.required],
            email: ["", [Validators.required, Validators.email]],
            message: ["", Validators.required]
        });
    }

    onSubmit() {
        if (this.form.valid) {
            console.log(this.form.value);

            this.snackBar.open(
                "Thank you for your feedback/enquiry! We will get back to you soon.",
                "Close",
                {
                    duration: 3000,
                    horizontalPosition: "center",
                    verticalPosition: "top"
                }
            );

            this.form.reset();
            this.myForm.resetForm();
        } else {
            this.form.markAllAsTouched();
        }
    }
}
