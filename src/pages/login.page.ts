import { Locator, Page } from "@playwright/test";
import { BasePage } from "./base.page";

export class LoginPage extends BasePage {
    private readonly emailInput: Locator;
    private readonly passwordInput: Locator;
    private readonly signInButton: Locator;

    constructor( page: Page ) {
        super( page );
        this.emailInput = page.getByTestId( 'email' );
        this.passwordInput = page.getByTestId( 'password' );
        this.signInButton = page.getByTestId( 'login-submit' );

    }

    async goto () {
        await this.page.goto( '/login' );
    }

    async login ( email: string, password: string ) {
        await this.emailInput.fill( email );
        await this.passwordInput.fill( password );
        // await this.passwordInput.evaluate( ( input: HTMLInputElement, password ) => {
        //     input.value = password;
        // }, process.env.MY_PASSWORD! );
        await this.signInButton.click();
    }


}