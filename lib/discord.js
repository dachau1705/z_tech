import { Channel, Client, EmbedBuilder, Events, IntentsBitField } from "discord.js";
import { convertError, dateNowDataBase, removeBuffer } from "./utils";
export class MY_Discord {
    static web_hook_id = process.env.WEB_HOOK_URL
    static threads = {}
    static webhookClient = null
    static messageQueue = [];

    static cli = new Client({
        intents: [
            IntentsBitField.Flags.Guilds,
            IntentsBitField.Flags.GuildMessages
        ]
    });

    /**
     *
     * @type {null|Channel}
     */
    static channel = null

    static in_run = false

    static async cli_ready() {
        try {

            await new Promise((resolve, reject) => {
                this.cli.login("MTE1NzUzNDY5NjQ2OTcxMjkzNg.GqNPQE.WWHjkt59bli0R2kQPsDWGT8GRa1x_QoNygcP1E")
                this.cli.on("ready", async (e, listener) => {
                    this.channel = this.cli.channels.cache.get(process.env.DISCORD_CHANNEL_ID);
                    this.channel.threads.cache.each(x => this.threads[x.name] = x.id)
                    this.webhookClient = (await this.channel.fetchWebhooks()).first()
                    await this.channel.send({ content: "** Discord server start **" })
                    this.cli.removeListener(Events.ClientReady, () => { });
                    resolve()
                })
            })
            this.in_run = true
            while (this.messageQueue.length > 0) {
                const { method, args } = this.messageQueue.shift();
                await this[method](...args);
            }
        } catch (e) {

        }

    }

    static async createThread(name) {
        if (this.in_run === false) return
        return this.channel.threads.create({
            name: name,
            reason: 'log key',
        })

    }

    /**
     *
     * @param name
     * @param data
     * @return {void}
     */
    static async addLog(name, data) {
        if (this.in_run === false) {
            this.messageQueue.push({ method: 'addLog', args: [name, data] });
            return
        }
        if (this.threads[name] === undefined) {
            const thread = await this.createThread(name)
            this.threads[name] = thread.id
        }
        return this.send(new EmbedBuilder().setDescription(`
             ===================================
             ${JSON.stringify(data)}
             ===================================
             ${dateNowDataBase(true)}
            `).setColor("#048cfc"), this.threads[name])
    }
    /**
     *
     * @param title
     * @param error {string|Error}
     * @param url
     * @param params
     * @return {void}
     */
    static sendError(title, error, url = "", params = "{}") {
        if (!this.in_run) {
            this.messageQueue.push({ method: 'sendError', args: [title, error, url, params] });
            return
        }
        let error_string = JSON.stringify(convertError(error))
        if (params?.file) {
            params.file = removeBuffer(params.file)
        }
        else if (params?.files) {
            params.files = removeBuffer(params.files)
        }

        return this.send(new EmbedBuilder()
            .setDescription(`
        **TT ERROR:${title}  **
        ===================================
        **${typeof error === "string" ? error : error_string.length < 3000 ? error_string : error_string.slice(0, 3000) + " continue ...."}**
        ===================================
        ** ${typeof params === "string" ? params : JSON.stringify(params)}**
        ===================================        
        ** ${dateNowDataBase()}**
        ===================================
        ** ${url}**
        `)

            .setColor("#fc0404")
        )
    }

    /**
     *
     * @param title
     * @param message
     * @param url
     * @return {void}
     * */
    static sendMess(title, message, url = "") {
        if (!this.in_run) {
            this.messageQueue.push({ method: 'sendMess', args: [title, message, url] });
            return
        }
        return this.send(new EmbedBuilder()
            .setDescription(`
        **TT MESS:${title}  **
        ===================================
        **${typeof message === "string" ? message : JSON.stringify(message)}**
        ===================================
        ** ${dateNowDataBase()}**
        ===================================
        ** ${url}**
        `)
            .setColor("#0cfc04")
        )
    }

    static send(embed, threadId) {
        if (process.env.SEND_DISCORD === "false") return
        return this.webhookClient.send({
            avatarURL: "https://e1.pxfuel.com/desktop-wallpaper/309/9/desktop-wallpaper-69318-anime-forum-avatars-cool-profile-anime.jpg",
            embeds: [embed],
            threadId
        })
    }
}