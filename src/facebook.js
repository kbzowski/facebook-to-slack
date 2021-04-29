import {createPage, openBrowser, openUrl} from "./helpers.js";

const getLastPost = async (address) => {
    const browser = await openBrowser();
    const page = await createPage(browser);
    await openUrl(address, page);

    page.evaluate(_ => {
        window.scrollBy(0, window.innerHeight);
    });

    const closeBtn = await page.$('#expanding_cta_close_button');
    if (closeBtn) {
        await closeBtn.evaluate(btn => btn.click());
    }

    await page.waitForSelector('._5pcq')
    const timestampHandler = await (await page.$$('._5pcq'))[0];
    let url = await page.evaluate(
        link => link.getAttribute('href'),
        timestampHandler
    )

    url = url.substring(0, url.indexOf("?"))

    const nodeChildren = await page.evaluateHandle(el => el.children, timestampHandler);

    const utime = await page.evaluate(
        e => e[0].getAttribute('data-utime'),
        nodeChildren
    )

    // const contentHandler = await (await page.$$('._5pbx'))[0];
    // let content = await page.evaluate(el => el.textContent, contentHandler)
    await page.close();
    await browser.close();

    return {
        utime: parseInt(utime),
        url,
    }
}

export default getLastPost