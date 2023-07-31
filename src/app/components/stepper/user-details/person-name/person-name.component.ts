import { Component, Input, OnDestroy, OnInit, forwardRef } from "@angular/core";
import {
    ControlValueAccessor,
    FormControl,
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
            useExisting: forwardRef(() => PersonNameComponent)
        }
    ]
})
export class PersonNameComponent
    implements ControlValueAccessor, OnInit, OnDestroy
{
    readonly titleOptions: string[] = Object.values(Title);

    form!: FormGroup;
    @Input() controlName!: string;
    nameControl: FormControl = new FormControl();
    private readonly destroy$ = new Subject<void>();

    constructor(private rootFormGroup: FormGroupDirective) {}

    onTouched = () => {};
    onChange: any = () => {};

    ngOnInit(): void {
        this.form = this.rootFormGroup.control.get(
            this.controlName
        ) as FormGroup;
        // this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
        //     console.log(this.form.value);
        //     this.onChange(this.form.value);
        // });
        // this.nameControl.valueChanges
        //     .pipe(takeUntil(this.destroy$))
        //     .subscribe((value) => {
        //         console.log(value);
        //         this.onChange(value);
        //     });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    writeValue(value: any) {
        if (value) {
            this.nameControl.setValue(value);
        }
    }

    registerOnTouched(onTouched: any) {
        this.onTouched = onTouched;
    }

    registerOnChange(onChange: any) {
        this.onChange = onChange;
        // this.form.valueChanges
        //     .pipe(takeUntil(this.destroy$))
        //     .subscribe(onChange);
    }

    setDisabledState?(isDisabled: boolean) {
        if (isDisabled) {
            this.form.disable();
        } else {
            this.form.enable();
        }
    }
}
