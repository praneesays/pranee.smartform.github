import { DateTime } from "luxon";
import { Observable, OperatorFunction } from "rxjs";
import { filter } from "rxjs/operators";
import { ApiSpecificationFile } from './api-metadata';

export type ApiPath = keyof ApiSpecificationFile['paths'];
export type ApiPathMethod<
    Path extends ApiPath
> = string & keyof ApiSpecificationFile['paths'][Path];

export function getApiPath<P extends ApiPath, M extends ApiPathMethod<P>>(path: P, method: M) {
    return {
        path, method
    };
}

export type KeysMatching<T, V> = { [K in keyof T]-?: T[K] extends V ? K : never }[keyof T];

export interface IApiTypeBase {
    init: (_data: any) => void;
    toJSON: (data?: any) => any;
    clone: () => this;
}

type Constructor<T> = new (...args: any[]) => T;
type Primitive = string | DateTime | number | null | undefined;

export const filterTruthy = <T>(): OperatorFunction<T, NonNullable<T>> => {
    return (obs: Observable<T>) => obs.pipe(filter((c) => !!c) as any);
};

export interface IApiTypeBaseStatic<T> extends Constructor<T> {
    fromJS: (_data: any) => T;
}

export type ApiTypeInterface<T> = T extends Primitive
    ? T
    : T extends Array<infer K>
    ? Array<ApiTypeInterface<K>>
    : {
        [k in keyof Omit<T, keyof IApiTypeBase>]: ApiTypeInterface<T[k]>;
    };

export const makeApiType = <
    TClass extends IApiTypeBase,
    TInterface extends ApiTypeInterface<TClass>
>(
    type: IApiTypeBaseStatic<TClass>,
    d: ApiTypeInterface<TInterface>
) => type.fromJS(d);
