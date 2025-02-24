import { expect } from '@playwright/test';

export async function openOrCloseMainMenu(page) {
    await page.locator('#main-burger-menu-button').click();
    await expect(page.getByRole('menu')).toBeVisible();
}

export async function checkTheNumberOfMenuItems(
    page,
    numberOfMenuItems: number,
) {
    await expect(page.getByRole('menuitem')).toHaveCount(numberOfMenuItems);
}

export async function checkSocialNetworkIcons(page, networks: string[]) {
    for (const network of networks) {
        const socialNetworkIcon = await page.locator(
            `xpath=//button[@aria-label='Share article on ${network}']`,
        );
        await expect(socialNetworkIcon).toBeEnabled();
    }
}

export async function sectionOnTheBlogPage(page, selectors: string[]) {
    for (const selector of selectors) {
        const sectionName = await page.locator(`#${selector}`);
        expect(sectionName).toBeVisible();
    }
}

export async function expectBackgroundColorToHaveCss(page, rgb: string) {
    const backgroundColor = await page.locator('xpath=/html/body/div[1]');
    expect(backgroundColor).toHaveCSS('background-color', rgb);
}
