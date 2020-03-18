'use strict';
import schedule from 'node-schedule'
import getLastPost from "./facebook.js";
import config from "../data/config.js";
import fs from "fs"
import {send} from './slack.js'

const historyFile = 'data/history.json'

if (!fs.existsSync(historyFile)) {
    fs.writeFileSync(historyFile, JSON.stringify({lastPostUtime: 0}))
}

(async () => {

    const job = schedule.scheduleJob('0 * * * *', async () => {
        const res = await getLastPost(config.facebookPage);

        const history = JSON.parse(fs.readFileSync(historyFile, 'utf8'))
        if(history.lastPostUtime < res.utime){
            send(`https://www.facebook.com${res.url}`)
            fs.writeFileSync(historyFile, JSON.stringify({lastPostUtime: res.utime}))
        }

        console.log(res);
    });

    console.log('App started...')

})()

