import { Locator, Page } from "@playwright/test";
import { BasePage } from "./base.page";

export class HomePage extends BasePage {
    private readonly signInButton: Locator

    constructor( page: Page ) {
        super( page );
        this.signInButton = page.locator( '[data-test="nav-sign-in"]' );
    }

    async clickOnSignIn () {
        await this.signInButton.click();
    }

}