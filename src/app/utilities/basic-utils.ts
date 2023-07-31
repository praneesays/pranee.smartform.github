export const filterArrayTruthy = <T>(a: T[]) => {
    return a.filter((c) => !!c) as NonNullable<T>[];
};

const keysWithValuesMatchingBoolean = <T extends string | number>(
    obj: Partial<Record<T, any>>,
    val: boolean
): T[] => {
    const ret: T[] = [];

    for (const k in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, k) && !!obj[k] === val) {
            ret.push(k);
        }
    }

    return ret;
};

export const truthyKeys = <T extends string | number>(
    obj: Partial<Record<T, any>>
): T[] => {
    return keysWithValuesMatchingBoolean(obj, true);
};

export const falsyKeys = <T extends string>(
    obj: Partial<Record<T, any>>
): T[] => {
    return keysWithValuesMatchingBoolean(obj, false);
};
