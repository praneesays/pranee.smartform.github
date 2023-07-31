import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
    selector: "app-complaint-description",
    templateUrl: "./complaint-description.component.html",
    styleUrls: ["./complaint-description.component.scss"]
})
export class ComplaintDescriptionComponent implements OnInit {
    // @Input() descriptionForm!: FormGroup;
    @Input() form?: FormGroup;
    constructor(private formBuilder: FormBuilder) {}

    ngOnInit() {
        // this.descriptionForm = this.formBuilder.group({
        //   issueDescription: [''],
        //   uploadImage: [''],
        // });
        console.log(this.form?.value);
    }
}
