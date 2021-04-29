'use strict';
import {CronJob} from 'cron';
import getLastPost from "./facebook.js";
import config from "../data/config.js";
import fs from "fs";
import path from "path";
import {send} from './slack.js';

const historyFile = 'history.json'
const dataDir = process.env.DATA_DIR || 'data'
const historyPath = path.join(dataDir, historyFile);

console.log(`History will be saved to "${historyPath}"`)

if (!fs.existsSync(historyPath)) {
    fs.writeFileSync(historyPath, JSON.stringify({lastPostUtime: 0}))
}

const check = async () => {
    const res = await getLastPost(config.facebookPage);

    const history = JSON.parse(fs.readFileSync(historyPath, 'utf8'))
    if (history.lastPostUtime < res.utime) {
        send(`https://www.facebook.com${res.url}`)
        fs.writeFileSync(historyPath, JSON.stringify({lastPostUtime: res.utime}))
    }

    console.log(res);
}

if (process.env.DEBUG_CHECK) {
    check()
} else {
    const job = new CronJob('0 0 * * * *', check);
    job.start();
    console.log(`Next check schedule to: ${job.nextDates()}`)
}

