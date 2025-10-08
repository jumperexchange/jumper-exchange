import { expect, Page } from "@playwright/test";


export async function selectChain(page: Page , chain:string) {
    const chainFilter = page.getByTestId('earn-filter-chain-select');
    await chainFilter.click();
    await page.getByRole('option', { name: chain }).click();
}

export async function verifyNoSelectedChainsAreVisible(page: Page , chain1:string , chain2:string) {
    await page.waitForLoadState('load')
    await page.waitForTimeout(3000);
    const earnOpportunitiesContainer = page.locator('xpath=//div[@class="MuiBox-root mui-1l9m50j"]/following-sibling::div[1]');
    await expect(earnOpportunitiesContainer).toBeVisible();
    const childElements = earnOpportunitiesContainer.locator('*');
    const childCount = await childElements.count();
    
    console.log(`Checking ${childCount} elements for chains: ${chain1}, ${chain2}`);
    
    for (let i = 0; i < childCount; i++) {
        const childElement = childElements.nth(i);
        const textContent = await childElement.textContent();
        if(textContent) {
            const lowerText = textContent.toLowerCase();
            const chain1Regex = new RegExp(`\\b${chain1.toLowerCase()}\\b`);
            const chain2Regex = new RegExp(`\\b${chain2.toLowerCase()}\\b`);
            if (lowerText.match(chain1Regex) || lowerText.match(chain2Regex)) {
                console.log(`Found matching text in element ${i}: "${textContent}"`);
            }
            expect(lowerText).not.toMatch(chain1Regex);
            expect(lowerText).not.toMatch(chain2Regex);
        }
    }
}

export async function selectProtocol(page: Page, protocol: string) {
    const protocolFilter = page.getByTestId('earn-filter-protocol-select');
    await protocolFilter.click();
    await page.getByRole('option', { name: protocol }).click();
}

export async function verifyNoSelectedProtocolsAreVisible(page: Page, protocol1: string) {
    await page.waitForLoadState('load');
    await page.waitForTimeout(3000);
    const earnOpportunitiesContainer = page.locator('xpath=//div[@class="MuiBox-root mui-1l9m50j"]/following-sibling::div[1]');
    await expect(earnOpportunitiesContainer).toBeVisible();
    const childElements = earnOpportunitiesContainer.locator('*');
    const childCount = await childElements.count();
    
    console.log(`Checking ${childCount} elements for protocol: ${protocol1}`);
    
    for (let i = 0; i < childCount; i++) {
        const childElement = childElements.nth(i);
        const textContent = await childElement.textContent();
        if(textContent) {
            const lowerText = textContent.toLowerCase();
            const protocol1Regex = new RegExp(`\\b${protocol1.toLowerCase()}\\b`);
            if (lowerText.match(protocol1Regex)) {
                console.log(`Found matching text in element ${i}: "${textContent}"`);
            }
            expect(lowerText).not.toMatch(protocol1Regex);
        }
    }
}

