import { Component, OnDestroy, OnInit, forwardRef } from "@angular/core";
import {
    AbstractControl,
    ControlValueAccessor,
    FormControl,
    FormGroup,
    NG_VALUE_ACCESSOR,
    Validators
} from "@angular/forms";
import { Subject, map, takeUntil } from "rxjs";
import { IPersonName, Title } from "src/app/types";
import { observeFormControlValue } from "src/app/utilities/rxjs-utils";

@Component({
    selector: "app-person-name",
    templateUrl: "./person-name.component.html",
    styleUrls: ["./person-name.component.scss"],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: forwardRef(() => PersonNameComponent)
        }
    ]
})
export class PersonNameComponent
    implements ControlValueAccessor, OnInit, OnDestroy
{
    readonly titleOptions: string[] = Object.values(Title);

    readonly formGroup = new FormGroup({
        title: new FormControl<Title | null>(null, {
            validators: []
        }),
        firstName: new FormControl<string>("", {
            validators: [Validators.required]
        }),
        lastName: new FormControl<string>("", {
            validators: [Validators.required]
        })
    });

    private readonly destroy$ = new Subject<void>();

    private onTouched?: () => void;
    private onChange?: (val: IPersonName | null) => void;

    constructor() {
        observeFormControlValue(this.formGroup)
            .pipe(
                map((c): IPersonName | null => {
                    if (!c) {
                        return null;
                    }

                    return {
                        title: c.title ?? null,
                        firstName: c.firstName!,
                        lastName: c.lastName!
                    };
                }),
                takeUntil(this.destroy$)
            )
            .subscribe((c) => {
                const onChange = this.onChange;
                if (!onChange) {
                    return;
                }
                onChange(c);
            });
    }

    ngOnInit() {
        this.formGroup.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                // console.log(value);
            });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    setRequiredValidator(control: AbstractControl) {
        control?.setValidators(Validators.required);
    }

    clearValidatorsAndSetValue(control: AbstractControl) {
        control?.setValue("");
        control?.clearValidators();
    }

    updateFormControlValidity(control: AbstractControl) {
        control?.updateValueAndValidity();
    }

    writeValue(obj: IPersonName | null): void {
        this.formGroup.setValue({
            title: obj?.title ?? null,
            firstName: obj?.firstName!,
            lastName: obj?.lastName!
        });
    }
    registerOnChange(fn: (val: IPersonName | null) => void): void {
        this.onChange = fn;
    }
    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }
    setDisabledState(isDisabled: boolean): void {
        if (isDisabled) {
            this.formGroup.disable();
        } else {
            this.formGroup.enable();
        }
    }
}
