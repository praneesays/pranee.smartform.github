import { DefaultUrlSerializer, UrlSerializer, UrlTree } from "@angular/router";

export class CustomUrlSerializer implements UrlSerializer {
    parse(url: string): UrlTree {
        const defaultSerializer = new DefaultUrlSerializer();
        url = url.replace("-", "/");
        return defaultSerializer.parse(url);
    }

    serialize(tree: UrlTree): string {
        const defaultSerializer = new DefaultUrlSerializer();
        let url = defaultSerializer.serialize(tree);
        url = url.replace("/", "-");
        return url;
    }
}
