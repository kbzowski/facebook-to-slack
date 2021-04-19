import puppeteer from 'puppeteer';

export const openBrowser = async () => {
    return await puppeteer.launch({
        headless: true,
        args: ["--start-maximized", "--no-sandbox", "--disable-setuid-sandbox"]
    });
}

export const createPage = async (browser) => {
    const page = await browser.newPage();

    // Science direct does not allow headless browsers... but if chrome introduce itself as non headless browser...
    let ua = await page.evaluate('navigator.userAgent');
    ua = ua.replace('HeadlessChrome', 'Chrome');

    await page.setUserAgent(ua);
    await page.setExtraHTTPHeaders({
        'accept-language': 'pl-PL;q=0.7,en;q=0.3'
    });

    await page.setJavaScriptEnabled(true);
    const viewport = {width: 1920, height: 1080};
    await page.setViewport(viewport);

    return page
};

export const openUrl = async (url, page) => {
    try {
        await page.goto(url, {
            waitUntil: 'networkidle0',
        });
        return true
    } catch (e) {
        console.error(e.message);
        return false
    }
}