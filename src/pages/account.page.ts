import { Locator, Page } from "@playwright/test";

export class AccountPage {
    readonly loginTitle: Locator;

    constructor( page: Page ) {
        this.loginTitle = page.getByTestId( 'page-title' );
    }

}