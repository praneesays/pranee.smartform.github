import { Component, forwardRef, Input } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { BehaviorSubject, NEVER, Observable, switchMap } from "rxjs";

export interface IImageMapArea {
    value: string;

    x: number;
    y: number;

    radius: number;
}

interface IImageWithDimensions {
    dataUrl: string;
    width: number;
    height: number;
}

@Component({
    selector: "app-image-map",
    templateUrl: "./image-map.component.html",
    styleUrls: ["./image-map.component.scss"],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ImageMapComponent),
            multi: true
        }
    ]
})
export class ImageMapComponent implements ControlValueAccessor {
    readonly imageWithDimensions$: Observable<IImageWithDimensions>;

    selectedValue?: string;

    @Input()
    areas: IImageMapArea[] = [];

    private imageSrc$ = new BehaviorSubject<string | null>(null);

    private disabled = false;

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
    }

    onAreaClicked(area: IImageMapArea) {
        if (this.disabled) {
            return;
        }

        this.selectedValue = area.value;

        this.onTouched();
        this.onChange(area.value);
    }

    writeValue(obj: any): void {
        this.selectedValue = obj;
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    @Input()
    set imageSrc(val: string | null) {
        this.imageSrc$.next(val);
    }
    get imageSrc() {
        return this.imageSrc$.value;
    }

    private onChange: (images: string) => void = () => {};
    private onTouched = () => {};
}
