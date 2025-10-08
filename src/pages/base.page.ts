import { Page } from "@playwright/test";

export abstract class BasePage {
    readonly page: Page;

    constructor( page: Page ) {
        this.page = page;
    }

    async goto () {
        await this.page.goto( '' );
    }
}