import { test, expect } from "@playwright/test";
import { HomePage } from "../src/pages/home.page";
import { LoginPage } from "../src/pages/login.page";
import { AccountPage } from "../src/pages/account.page";
import { vault } from '../src/utils/crypto-vault';
import { Credentials } from "../src/types/credentials";

test( 'login success', async ( { page } ) => {
    const password = vault.get( 'customer' );

    const credentials: Credentials = {
        email: 'customer@practicesoftwaretesting.com',
        password: 'xxx'
    }

    const homePage = new HomePage( page );
    const loginPage = new LoginPage( page );
    const accountPage = new AccountPage( page );

    await test.step( 'open de homepage', async () => {
        await homePage.goto();
    } );

    await test.step( 'login', async () => {
        await homePage.clickOnSignIn();
        await loginPage.login( credentials.email, password );
        await expect( accountPage.loginTitle ).toContainText( 'My account' );
    } );
} );