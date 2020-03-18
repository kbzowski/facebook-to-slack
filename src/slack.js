import Slack from 'slack'
import config from "../data/config.js";


export const send = (text) => {
    const bot = new Slack({token: config.slackToken})
    bot.chat.postMessage({text, channel: config.channel}, (err, data) => {
        if(err)
            console.error(err)
    })
}