import {
    Component,
    EventEmitter,
    forwardRef,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { MatSelectionList } from "@angular/material/list";
import {
    BehaviorSubject,
    NEVER,
    Observable,
    pipe,
    Subject,
    switchMap,
    takeUntil
} from "rxjs";
import { IImageMapOption } from "src/app/questions";

export interface IImageMapArea {
    value: string;

    x: number;
    y: number;

    radius: number;

    selected?: boolean;
}

interface IImageWithDimensions {
    dataUrl: string;
    width: number;
    height: number;
}

@Component({
    selector: "app-image-hotspot",
    templateUrl: "./image-hotspot.component.html",
    styleUrls: ["./image-hotspot.component.scss"],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ImageHotspotComponent),
            multi: true
        }
    ]
})
export class ImageHotspotComponent implements OnInit, OnDestroy {
    // implements ControlValueAccessor {
    // readonly imageWithDimensions$: Observable<IImageWithDimensions>;

    // selectedValue?: string;

    // @Input()
    // areas: IImageMapArea[] = [];

    // private imageSrc$ = new BehaviorSubject<string | null>(null);

    // private disabled = false;

    // constructor() {
    //     this.imageWithDimensions$ = this.imageSrc$.pipe(
    //         switchMap((imageSrc) => {
    //             if (!imageSrc) {
    //                 return NEVER;
    //             }

    //             return new Observable<IImageWithDimensions>((sub) => {
    //                 var img = document.createElement("img");

    //                 sub.add(() => {
    //                     img.remove();
    //                 });

    //                 img.onload = () => {
    //                     sub.next({
    //                         dataUrl: imageSrc,
    //                         width: img.naturalWidth,
    //                         height: img.naturalHeight
    //                     });

    //                     sub.complete();
    //                 };

    //                 img.onerror = () => {
    //                     sub.error();
    //                 };

    //                 img.src = imageSrc;
    //             });
    //         })
    //     );
    // }

    // onAreaClicked(area: IImageMapArea) {
    //     if (this.disabled) {
    //         return;
    //     }

    //     this.selectedValue = area.value;

    //     this.onTouched();
    //     this.onChange(area.value);
    // }

    // writeValue(obj: any): void {
    //     this.selectedValue = obj;
    // }

    // registerOnChange(fn: any): void {
    //     this.onChange = fn;
    // }

    // registerOnTouched(fn: any): void {
    //     this.onTouched = fn;
    // }

    // setDisabledState(isDisabled: boolean): void {
    //     this.disabled = isDisabled;
    // }

    // @Input()
    // set imageSrc(val: string | null) {
    //     this.imageSrc$.next(val);
    // }
    // get imageSrc() {
    //     return this.imageSrc$.value;
    // }

    // private onChange: (images: string) => void = () => {};
    // private onTouched = () => {};

    readonly imageWithDimensions$: Observable<IImageWithDimensions>;

    dynamicViewBox?: string;

    isSelected: boolean = false;

    disabled = false;

    @Output() selectedValuesChange = new EventEmitter<IImageMapArea>();

    private imageSrc$ = new BehaviorSubject<string | null>(null);

    private _areas: IImageMapArea[] = [];

    private readonly destroy$ = new Subject<void>();

    constructor() {
        this.imageWithDimensions$ = this.imageSrc$.pipe(
            switchMap((imageSrc) => {
                if (!imageSrc) {
                    return NEVER;
                }

                return new Observable<IImageWithDimensions>((sub) => {
                    var img = document.createElement("img");

                    sub.add(() => {
                        img.remove();
                    });

                    img.onload = () => {
                        sub.next({
                            dataUrl: imageSrc,
                            width: img.naturalWidth,
                            height: img.naturalHeight
                        });

                        sub.complete();
                    };

                    img.onerror = () => {
                        sub.error();
                    };

                    img.src = imageSrc;
                });
            })
        );

        this.imageWithDimensions$
            .pipe(takeUntil(this.destroy$))
            .subscribe(
                (image) =>
                    (this.dynamicViewBox = `0 0 ${image.width} ${image.height}`)
            );
    }

    ngOnInit() {
        this.clearAllSelections();

        this.areas.sort((a, b) => a.x - b.x);
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    selectHotspot(area: IImageMapOption) {
        area.selected = !area.selected;
        this.areas.forEach((button) => {
            button.selected = button === area;
        });

        this.selectedValuesChange.emit(area);
    }

    selectOption(label: any) {
        this.areas.forEach((area) => {
            area.selected = area.value === label.label;
        });
    }

    clearAllSelections() {
        this.areas.forEach((area) => {
            area.selected = false;
        });
    }

    @Input()
    set imageSrc(val: string | null) {
        this.imageSrc$.next(val);
    }
    get imageSrc() {
        return this.imageSrc$.value;
    }

    @Input()
    set areas(value: IImageMapArea[]) {
        this._areas = value;
    }

    get areas(): IImageMapArea[] {
        return this._areas;
    }
}
