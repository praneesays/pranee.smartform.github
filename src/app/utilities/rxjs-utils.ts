import { AbstractControl } from "@angular/forms";
import {
    combineLatest,
    defer,
    filter,
    map,
    MonoTypeOperatorFunction,
    Observable,
    ObservableInput,
    ObservedValueOf,
    OperatorFunction,
    shareReplay,
    startWith,
    takeUntil,
    withLatestFrom
} from "rxjs";

export const filterTruthy = <T>(): OperatorFunction<T, NonNullable<T>> => {
    return (obs: Observable<T>) => obs.pipe(filter((c) => !!c) as any);
};

export const withLatestFromKeyed = <
    KI extends string,
    TI,
    KO extends string,
    TO
>(
    key: KI,
    other$: Observable<TO>,
    otherKey: KO
): OperatorFunction<TI, Record<KI, TI> & Record<KO, TO>> => {
    return (obs: Observable<TI>) =>
        obs.pipe(
            withLatestFrom(other$),
            map((c) => ({
                [key]: c[0],
                [otherKey]: c[1]
            }))
        ) as any;
};

export const combineMapLatest = <
    T extends Record<string | symbol | number, ObservableInput<any>>
>(
    sourcesObject: T
): Observable<{ [K in keyof T]: ObservedValueOf<T[K]> }> => {
    const keys = Object.keys(sourcesObject) as (keyof T)[];

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    const observables = keys.map(
        (c) => sourcesObject[c] as ObservableInput<any>
    );

    return combineLatest(observables).pipe(
        map((c) => {
            const ret: { [K in keyof T]: ObservedValueOf<T[K]> } = {} as any;

            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                const val = c[i];

                ret[key] = val as any;
            }

            return ret;
        })
    );
};

export const replayLatest = <T>(
    until$?: Observable<any>
): MonoTypeOperatorFunction<T> => {
    const ret = shareReplay<T>({
        bufferSize: 1,
        refCount: !until$
    });

    if (!until$) {
        return ret;
    }

    return (obs: Observable<T>) => obs.pipe(ret, takeUntil(until$));
};

export const observeFormControlValue = <T = any>(
    formControl: AbstractControl<T>
): Observable<T | null | undefined> => {
    return defer(() => {
        return formControl.valueChanges.pipe(startWith(formControl.value));
    });
};
