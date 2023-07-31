import {
    CustomWebpackBrowserSchema,
    TargetOptions
} from "@angular-builders/custom-webpack";
import * as path from "path";
import * as SvgSpriteLoader from "svg-sprite-loader/plugin";
import * as webpack from "webpack";

const srcDir = path.resolve(__dirname, "src").replace(/\\/g, "/");
const iconsDir = path.posix.join(srcDir, "icons");

export default (
    config: webpack.Configuration,
    options: CustomWebpackBrowserSchema,
    targetOptions: TargetOptions
) => {

    config.resolve ??= {};
    config.resolve.alias ??= {};
    (config.resolve.alias as any)["@icons"] = path.posix.join(iconsDir, "svgs");

    config.module ??= {};
    config.module.rules ??= [];
    config.module.rules.unshift({
        test: /\.svg$/,
        use: [
            {
                loader: "svg-sprite-loader",
                options: {
                    // extract: true,
                    spriteFilename: "assets/sprite.[hash].svg",
                    symbolId: "icon-[name]"
                }
            },
            {
                loader: "svgo-loader",
                options: {
                    configFile: path.posix.join(iconsDir, "svgo.config.js")
                }
            }
        ]
    });

    config.plugins ??= [];
    config.plugins.unshift(new SvgSpriteLoader() as any);

    return config;
};
