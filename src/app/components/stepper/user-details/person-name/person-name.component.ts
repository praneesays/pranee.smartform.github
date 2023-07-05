import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import {
    ControlValueAccessor,
    FormGroup,
    FormGroupDirective,
    NG_VALUE_ACCESSOR
} from "@angular/forms";
import { Subject, takeUntil } from "rxjs";
import { Title } from "src/app/types";

@Component({
    selector: "app-person-name",
    templateUrl: "./person-name.component.html",
    styleUrls: ["./person-name.component.scss"],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: PersonNameComponent
        }
    ]
})
export class PersonNameComponent
    implements ControlValueAccessor, OnInit, OnDestroy
{
    readonly titleOptions: string[] = Object.values(Title);

    form!: FormGroup;
    @Input() controlName!: string;

    private readonly destroy$ = new Subject<void>();

    constructor(private rootFormGroup: FormGroupDirective) {}

    onTouched = () => {};

    ngOnInit(): void {
        this.form = this.rootFormGroup.control.get(
            this.controlName
        ) as FormGroup;
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    writeValue(value: any) {
        if (value) {
            this.form.setValue(value);
        }
    }

    registerOnTouched(onTouched: any) {
        this.onTouched = onTouched;
    }

    registerOnChange(onChange: any) {
        this.form.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe(onChange);
    }

    setDisabledState?(isDisabled: boolean) {
        if (isDisabled) {
            this.form.disable();
        } else {
            this.form.enable();
        }
    }
}
