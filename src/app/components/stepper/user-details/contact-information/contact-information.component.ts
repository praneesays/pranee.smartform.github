import { Component, Input, OnInit } from "@angular/core";
import { FormGroup, FormGroupDirective } from "@angular/forms";
import { map, Observable, startWith } from "rxjs";
import { Country } from "src/app/types";

@Component({
    selector: "app-contact-information",
    templateUrl: "./contact-information.component.html",
    styleUrls: ["./contact-information.component.scss"]
})
export class ContactInformationComponent implements OnInit {
    readonly countries: Country[] = Object.values(Country);
    // @Input() formGroup!: FormGroup;

    form?: FormGroup;
    countriesList?: Observable<string[]>;

    @Input() parentForm?: FormGroup;
    @Input() controlName?: string;

    constructor(private rootFormGroup: FormGroupDirective) {}

    // get formGroup(): FormGroup {
    //     return this.parentForm.get(this.controlName) as FormGroup;
    // }

    ngOnInit() {
        if (!this.controlName) {
            throw new Error("Not implemented!");
        }

        this.form = this.rootFormGroup.control.get(
            this.controlName
        ) as FormGroup;

        if (!this.form) {
            return;
        }

        if (this.form.get("country")) {
            this.countriesList = this.form.get("country")?.valueChanges.pipe(
                startWith(""),
                map((value) => this._filter(value || ""))
            );
        }
    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();

        return this.countries.filter((country) =>
            country.toLowerCase().includes(filterValue)
        );
    }
}
