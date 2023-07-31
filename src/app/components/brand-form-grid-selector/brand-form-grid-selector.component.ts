import { Component, forwardRef, OnDestroy } from "@angular/core";
import {
    ControlValueAccessor,
    FormControl,
    FormGroup,
    NG_VALUE_ACCESSOR,
    Validators
} from "@angular/forms";
import { IProductBrandView, IProductFormView } from "@generated-api-clients";
import {
    BehaviorSubject,
    distinctUntilChanged,
    map,
    Observable,
    of,
    Subject,
    switchMap,
    takeUntil,
    tap
} from "rxjs";
import { ProductsApiService } from "src/app/api/products-api.service";
import { IBrandFormSelection, ILetterRange, UNKNOWN } from "src/app/types";
import {
    combineMapLatest,
    observeFormControlValue,
    replayLatest
} from "src/app/utilities/rxjs-utils";

class LetterRange<T extends object> implements ILetterRange {
    readonly name: string;
    readonly hasAny$: Observable<boolean>;
    readonly hasNone$: Observable<boolean>;

    constructor(
        readonly from: string,
        readonly to: string,
        items: Observable<readonly T[] | null | undefined>,
        key: keyof T
    ) {
        this.name = `${from}-${to}`;

        this.hasAny$ = items.pipe(
            map(
                (c) =>
                    !!c &&
                    c.some((x) => {
                        if (!(key in x)) {
                            return false;
                        }

                        const val = x[key];

                        if (typeof val !== "string") {
                            return false;
                        }

                        return this.matches(val);
                    })
            )
        );
        this.hasNone$ = this.hasAny$.pipe(map((c) => !c));
    }

    matches(value: string): boolean {
        return (
            value.charAt(0).toUpperCase() >= this.from.toUpperCase() &&
            value.charAt(0).toUpperCase() <= this.to.toUpperCase()
        );
    }
}

@Component({
    selector: "app-brand-form-grid-selector",
    templateUrl: "./brand-form-grid-selector.component.html",
    styleUrls: ["./brand-form-grid-selector.component.scss"],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => BrandFormGridSelectorComponent),
            multi: true
        }
    ]
})
export class BrandFormGridSelectorComponent
    implements ControlValueAccessor, OnDestroy
{
    readonly UNKNOWN = UNKNOWN;

    showAllProductForms: boolean = true;
    // selectedProduct?: Question;

    readonly allProductForms$: Observable<readonly IProductFormView[]>;
    readonly secondaryProductFormOptions$: Observable<
        readonly IProductFormView[] | null
    >;
    selectedProductFormBrandsLoading = false;
    readonly selectedProductFormBrands$: Observable<
        readonly IProductBrandView[] | null
    >;
    readonly filteredProductBrands$: Observable<
        readonly IProductBrandView[] | null
    >;

    readonly letterRanges: readonly ILetterRange[];

    readonly formGroup = new FormGroup({
        primaryFormId: new FormControl<string | null | typeof UNKNOWN>(null, {
            validators: [Validators.required]
        }),
        brandId: new FormControl<string | null>(null, {
            validators: [Validators.required]
        }),
        secondaryFormId: new FormControl<string | null>(null, {
            validators: [Validators.required]
        })
    });

    private readonly destroy$ = new Subject<void>();
    private readonly brandAlphaFilter$ =
        new BehaviorSubject<ILetterRange | null>(null);
    private onTouched?: () => void;
    private onChange?: (val: IBrandFormSelection | null) => void;

    constructor(private readonly productsApiService: ProductsApiService) {
        this.allProductForms$ = productsApiService
            .getForms()
            .pipe(replayLatest(this.destroy$), takeUntil(this.destroy$));

        const brandId$ = observeFormControlValue<string | null>(
            this.formGroup.controls.brandId
        );

        const primaryFormId$ = observeFormControlValue<
            string | null | typeof UNKNOWN
        >(this.formGroup.controls.primaryFormId);

        primaryFormId$
            .pipe(distinctUntilChanged(), takeUntil(this.destroy$))
            .subscribe((c) => {
                if (c === UNKNOWN) {
                    this.brandAlphaFilter = this.letterRanges[0];
                    this.formGroup.controls.secondaryFormId.enable();
                } else {
                    this.brandAlphaFilter = null;
                    this.formGroup.controls.secondaryFormId.disable();
                }

                this.productBrandControl.setValue(null);
                this.showAllProductForms = !c;
            });

        this.selectedProductFormBrands$ = primaryFormId$.pipe(
            tap(() => {
                this.selectedProductFormBrandsLoading = true;
                this.productBrandControl.disable();
            }),
            switchMap((formId) =>
                formId && formId !== UNKNOWN
                    ? productsApiService.getBrandsForForm(formId)
                    : productsApiService.getBrands()
            ),
            tap(() => {
                this.selectedProductFormBrandsLoading = false;
                this.productBrandControl.enable();
            }),
            takeUntil(this.destroy$)
        );

        this.filteredProductBrands$ = combineMapLatest({
            primaryFormId: primaryFormId$,
            brands: this.selectedProductFormBrands$,
            brandAlphaFilter: this.brandAlphaFilter$
        }).pipe(
            map((c) => {
                if (!c.brands) {
                    return null;
                }

                if (c.primaryFormId === UNKNOWN && !c.brandAlphaFilter) {
                    return null;
                }

                let ret = [...c.brands];
                if (c.brandAlphaFilter) {
                    ret = ret.filter((x) =>
                        c.brandAlphaFilter?.matches(x.name)
                    );
                }

                ret.sort((a, b) => a.name.localeCompare(b.name));

                return ret;
            })
        );

        this.secondaryProductFormOptions$ = brandId$.pipe(
            switchMap((brandId) =>
                brandId
                    ? productsApiService.getFormsForBrand(brandId)
                    : of(null)
            ),
            tap((c) => {
                if (c?.length === 1) {
                    this.secondaryProductFormControl.setValue(c[0].id);
                } else {
                    this.secondaryProductFormControl.setValue(null);
                }
            })
        );

        observeFormControlValue(this.formGroup)
            .pipe(
                tap(() => {
                    const onTouched = this.onTouched;

                    if (onTouched) {
                        onTouched();
                    }
                }),
                map((c) => {
                    if (!c?.brandId || !c.primaryFormId) {
                        return null;
                    }

                    const formId =
                        c.primaryFormId === UNKNOWN
                            ? c.secondaryFormId
                            : c.primaryFormId;

                    if (!formId) {
                        return null;
                    }

                    return {
                        brandId: c.brandId,
                        formId
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

        this.letterRanges = [
            new LetterRange("A", "C", this.selectedProductFormBrands$, "name"),
            new LetterRange("D", "F", this.selectedProductFormBrands$, "name"),
            new LetterRange("G", "I", this.selectedProductFormBrands$, "name"),
            new LetterRange("J", "L", this.selectedProductFormBrands$, "name"),
            new LetterRange("M", "O", this.selectedProductFormBrands$, "name"),
            new LetterRange("P", "R", this.selectedProductFormBrands$, "name"),
            new LetterRange("S", "U", this.selectedProductFormBrands$, "name"),
            new LetterRange("V", "Z", this.selectedProductFormBrands$, "name")
        ];
    }

    set brandAlphaFilter(filter: ILetterRange | null) {
        this.brandAlphaFilter$.next(filter);
    }
    get brandAlphaFilter() {
        return this.brandAlphaFilter$.value;
    }

    get primaryProductFormControl() {
        return this.formGroup.controls.primaryFormId;
    }

    get secondaryProductFormControl() {
        return this.formGroup.controls.secondaryFormId;
    }

    get productBrandControl() {
        return this.formGroup.controls.brandId;
    }

    toggleProducts() {
        this.showAllProductForms = !this.showAllProductForms;
    }

    writeValue(obj: IBrandFormSelection | null): void {
        this.formGroup.setValue({
            brandId: obj?.brandId ?? null,
            primaryFormId: obj?.formId ?? null,
            secondaryFormId: null
        });
    }
    registerOnChange(fn: (val: IBrandFormSelection | null) => void): void {
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

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
