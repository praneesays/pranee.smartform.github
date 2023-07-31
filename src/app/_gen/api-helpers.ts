import { ApiSpecificationFile } from "./api-metadata";

export type ApiPath = keyof ApiSpecificationFile["paths"];
export type ApiPathMethod<Path extends ApiPath> = string &
    keyof ApiSpecificationFile["paths"][Path];
export type ApiTypeName = keyof ApiSpecificationFile["components"]["schemas"];

export const getPathAndMethod = <Path extends ApiPath>(
    path: Path,
    method: ApiPathMethod<Path>
) => {
    return {
        path,
        method
    };
};
