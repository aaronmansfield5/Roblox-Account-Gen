require('dotenv').config();
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const puppeteerVanilla = require('puppeteer');
const {
    addExtra
} = require('puppeteer-extra');
const puppeteer = addExtra(puppeteerVanilla);
const path = require("path");
const UserAgent = require("user-agents");
const {
    fetchUsername
} = require('./utilities/username');
const setTitle = require('node-bash-title');
const {
    Client,
    Events,
    GatewayIntentBits,
} = require('discord.js');
const prefix = "$"

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages]
});

function sleep(s) {
    return new Promise(resolve => setTimeout(resolve, s * 1000));
}

function randomString(len) {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890!.<>();:@#~"
    let genned = ""

    let counter = 0
    while (counter < len) {
        genned += charset.charAt(Math.floor(Math.random() * charset.length));
        counter++;
    }

    return genned;
}

async function sendWebhook(details) {
    try {
        const response = await fetch(process.env.WEBHOOK, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                embeds: [{
                    name: 'Account Created',
                    title: 'Account Created',
                    fields: [{
                        name: 'Username',
                        value: details.user,
                        inline: false
                    }, {
                        name: 'Password',
                        value: `||${details.password}||`,
                        inline: false
                    }],
                    color: 0x00AB66
                }],
            }),
        });

        if (!response.ok) {
            new Error(`\x1b[1m\x1b[31mHTTP error! Status: ${response.status}`);
        }
    } catch (error) {
        console.error('\x1b[1m\x1b[31mError sending message:', error.message);
    }
}

async function genAccounts(amount) {
    for (let i = 1; i <= amount; i++) {
        console.log(`\x1b[1m\x1b[32mROBLOX \x1b[33m| \x1b[37mAttempting to create account \x1b[36m${i} \x1b[37mof \x1b[36m${amount}\x1b[90m`)
        const username = await fetchUsername()
        const data = {
            user: username,
            password: randomString(15)
        }

        const userAgent = new UserAgent({
            deviceCategory: 'desktop'
        });

        const cfg = {
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-infobars',
                '--window-position=0,0',
                '--window-size=1366,768',
                '--disable-features=IsolateOrigins,site-per-process,SitePerProcess',
                '--flag-switches-begin --disable-site-isolation-trials --flag-switches-end',
                `--user-agent=${userAgent.toString()}`,
                `--load-extension=${path.join(__dirname, 'extensions/CapSolver.Browser.Extension-chrome')}`
            ],
            defaultViewport: null,
            ignoreHTTPSErrors: true,
            headless: false,
        };

        const browser = await puppeteer.launch(cfg);
        const page = await browser.newPage();

        await page.setViewport({
            width: userAgent.data.viewportWidth,
            height: userAgent.data.viewportHeight,
            deviceScaleFactor: 1,
            hasTouch: false,
            isLandscape: false,
            isMobile: false,
        });

        await page.setJavaScriptEnabled(true);
        await page.setDefaultNavigationTimeout(0);

        await page.evaluateOnNewDocument(() => {
            Object.defineProperty(navigator, 'webdriver', {
                get: () => false,
            });
        });

        await page.evaluateOnNewDocument(() => {
            window.chrome = {
                runtime: {},
            };
        });

        await page.evaluateOnNewDocument(() => {
            const originalQuery = window.navigator.permissions.query;
            return window.navigator.permissions.query = (parameters) => (
                parameters.name === 'notifications' ?
                Promise.resolve({
                    state: Notification.permission
                }) :
                originalQuery(parameters)
            );
        });

        await page.evaluateOnNewDocument(() => {
            Object.defineProperty(navigator, 'plugins', {
                get: () => [1, 2, 3, 4, 5],
            });
        });

        await page.evaluateOnNewDocument(() => {
            Object.defineProperty(navigator, 'languages', {
                get: () => ['en-US', 'en'],
            });
        });

        let captchaSolvedExecuted = false;
        await page.exposeFunction('captchaSolved', async (e) => {
            if (!captchaSolvedExecuted) {
                captchaSolvedExecuted = true;
                console.log("\x1b[1m\x1b[37mSolved \x1b[32mFunCAPTCHA");
                await sendWebhook(data);
                console.log(`\x1b[1m\x1b[32mROBLOX \x1b[33m| \x1b[37mAccount \x1b[36m${i} \x1b[37mof \x1b[36m${amount}\x1b[37m created!\x1b[90m`);
                await page.waitForNavigation();
                await sleep(.5);
                await browser.close();
                await page.removeExposedFunction('captchaSolved');
            }
        });


        await page.goto('https://www.roblox.com/');

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        await page.select('#MonthDropdown', months[Math.floor(Math.random() * months.length)]);
        const days = ["10", "11", "12", "13", "14", "15", "16", "17", "18"];
        await page.select('#DayDropdown', days[Math.floor(Math.random() * days.length)]);
        const years = ["2000", "2001", "2002", "2003", "2004", "2005"];
        await page.select('#YearDropdown', years[Math.floor(Math.random() * years.length)]);

        await page.type('#signup-username', data.user);
        await page.type('#signup-password', data.password);

        try {
            await page.click('#cookie-banner-wrapper > div.cookie-banner > div:nth-child(2) > div > div > button.btn-cta-lg.cookie-btn.btn-primary-md.btn-min-width');
        } catch (e) {
            console.log('Terms and Conditions not required!')
        }

        await sleep(1.5);

        await page.waitForSelector('#signup-button');
        await page.click('#signup-button');

        try {
            const el = await page.waitForSelector('#arkose-iframe', {
                visible: true,
                timeout: 5000
            });

            if (el) {
                console.log("\x1b[1m\x1b[37mSolving \x1b[32mFunCAPTCHA")
            }

        } catch (error) {
            i--;
            await browser.close(); 
        }
    }
}

genAccounts(1)