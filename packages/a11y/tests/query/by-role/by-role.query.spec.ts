import { Browser, Page } from "puppeteer";
import { injectUvvA11YAndLoadUrl } from "../../commons-test";
import * as path from "path";

describe("Query - ByRole", () => {
    let browser: Browser;
    let page: Page;

    beforeEach(async () => {
        const context = await injectUvvA11YAndLoadUrl(path.join(__dirname, "by-role.html"));
        browser = context.browser;
        page = context.page;
    });

    afterEach(async () => {
        await browser?.close();
    });

    async function executeQuery(role: string, attributes: string[] = []) {
        return await page.evaluate(async (role: string, attributes: string[]) => {
            // @ts-ignore
            const byRoleQuery = new uuvA11y.ByRoleQuery(role, attributes);
            const elements = await byRoleQuery.execute();
            return elements.map(element => element.getAttribute("data-testid"));
        }, role, attributes);
    }

    it("should return elements with only role specified", async () => {
        const elementDataTestId: string[] = await executeQuery("img");
        await expect(elementDataTestId).toBeTruthy();
        await expect(elementDataTestId).toEqual(["simple-img", "another-simple-img", "div-as-img"]);
    });

    it("should return elements with role and attributes specified", async () => {
        const elementDataTestId: string[] = await executeQuery("img", ["some-attr"]);
        await expect(elementDataTestId).toBeTruthy();
        await expect(elementDataTestId).toEqual(["simple-img", "div-as-img"]);
    });
});
