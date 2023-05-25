/**
 * Copyright UUV.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { chromium } from "playwright-chromium";
import fs from "fs";

let translator: any;
let uuvCssContent: any;
export class UuvAssistant {

    private initReactDomRootElementFn() {
        return () => {
            window.onload = function() {
                if (window.location === window.parent.location) {
                    console.log("DOMContentLoaded");
                    const rootElement = document.createElement("div");
                    const event = translator !== undefined ? new CustomEvent("UUVAssistantReadyToLoad", {
                        detail: {
                            translator: translator
                        }
                    }) : new Event("UUVAssistantReadyToLoad");
                    rootElement.id = "uvv-assistant-root";
                    document.body.appendChild(rootElement);
                    document.dispatchEvent(event);

                    const style = document.createElement("style");
                    style.type = "text/css";
                    style.innerHTML = uuvCssContent;
                    document.getElementsByTagName("head")[0].appendChild(style);
                }
            };
        };
    }

    public async start(translatorFn?: (el: HTMLElement) => string) {
        const { chromium } = require("playwright-chromium");
        const argv = require("minimist")(process.argv.slice(2));
        const conf = require("./conf.json");

        const browser = await chromium.launch({ headless: false });
        const browserContext = await browser.newContext({ viewport: null });
        const page = await browserContext.newPage();

        const translatorDeclaration = translatorFn ?
            `var translator = ${translatorFn.toString()}; console.log('translator'); console.log(translator);` :
            "var translator = null;";

        const cssContentDeclaration = `\n var uuvCssContent = "${fs.readFileSync(__dirname + conf.cssFile).toString()}"`;
        await console.log(cssContentDeclaration);
        await browserContext.addInitScript({
            content: `${translatorDeclaration}${cssContentDeclaration}`
        });
        await console.log(this.initReactDomRootElementFn());
        await browserContext.addInitScript(this.initReactDomRootElementFn());
        await browserContext.addInitScript({
            path: `${__dirname}${conf.reactScript}`
        });
        await console.log(fs.readFileSync(`${__dirname}${conf.reactScript}`));
        await page.goto(argv.targetUrl);
    }
}
