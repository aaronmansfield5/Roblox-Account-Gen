# Roblox Account Gen

[![Node.js](https://img.shields.io/badge/v21.1.0-43853D?style=flat&logo=node.js&logoColor=white&label=Node.js&message=Node.js)](https://nodejs.org/)
[![NPM](https://img.shields.io/badge/v10.2.0-CB3837?style=flat&logo=npm&logoColor=white&label=NPM&message=NPM)](https://www.npmjs.com/)
[![Discord.js](https://img.shields.io/badge/v14.14.1-5865F2?style=flat&logo=discord&logoColor=white&label=Discord.js&message=Discord.js)](https://discord.js.org/)
[![Puppeteer](https://img.shields.io/badge/v22.1.0-40B5A4?style=flat&logo=puppeteer&logoColor=white&label=Puppeteer&message=Puppeteer)](https://pptr.dev/)


## Overview
`roblox-account-gen` is a Node.js package designed to automate the generation of Roblox accounts using [Capsolver](https://www.capsolver.com/), [Puppeteer](https://pptr.dev/) and [Discord.js](https://discord.js.org/). It includes features such as account creation, solving [FunCAPTCHA](https://www.arkoselabs.com/) challenges, and notifying users through Discord webhooks.

## Prerequisites
Before using this package, make sure you have the following installed:

- Node.js
- npm (Node Package Manager)
- Discord.js
- Puppeteer

## Installation
1. Clone this repository:

```bash
git clone https://github.com/your-username/roblox-account-gen.git
```

2. Navigate to the project directory:
```bash
cd roblox-account-gen
```

3. Run install.bat

4. Set up your environment variables by creating a .env file in the root directory:
```env
WEBHOOK=<your_discord_webhook_url>
BOT_TOKEN=<your_discord_bot_token>
```

5. Add your CapSolver API key by editing `config.js` in the `extensions/CapSolver.Browser.Extension-chrome/assets/` directory:
```js
// extensions/CapSolver.Browser.Extension-chrome/assets/config.js
export const defaultConfig = {
  // API key
  apiKey: 'CAP-CEXXX',
...}
```

## Usage
1. Run the application:
```bash
node app.js
```

2. In your Discord server, use the following command to generate Roblox accounts:
```bash
$gen <amount>
```
Replace <amount> with the desired number of accounts to generate.

3. The generated accounts will be posted in the designated channel, and a notification will be sent to the user who triggered the command.

## Node Packages
- [dotenv](https://www.npmjs.com/package/dotenv)
- [puppeteer](https://www.npmjs.com/package/puppeteer)
- [puppeteer-extra](https://www.npmjs.com/package/puppeteer-extra)
- [puppeteer-extra-plugin-stealth](https://www.npmjs.com/package/puppeteer-extra-plugin-stealth)
- [user-agents](https://www.npmjs.com/package/user-agents)
- [discord.js](https://www.npmjs.com/package/discord.js)
- [node-bash-title](https://www.npmjs.com/package/node-bash-title)
