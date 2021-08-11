"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmbedPaginator = void 0;
const array_paginator_1 = require("array-paginator");
const discord_js_1 = require("discord.js");
class EmbedPaginator {
    constructor(channel, pages = [], options) {
        this.channel = channel;
        this.pager = new array_paginator_1.Paginator(pages, 1);
        this.summoner = options.summoner;
        this.message = null;
        // this.emojis = {
        // 	first: '⏮️',
        // 	previous: '◀️',
        // 	next: '▶️',
        // 	last: '⏭️',
        // 	all: ['⏮️', '◀️', '▶️', '⏭️'],
        // }
        this.init();
    }
    async init() {
        // Verifications :
        if (this.pager.total < 2)
            throw new Error('A Pagination Embed must contain at least 2 pages');
        // Send the message
        this.message = await this.channel.send({ embeds: this.pager.first(), components: [this.getComponents()] });
        // React to the message
        // for (const emoji in this.emojis) {
        // 	if (emoji === 'all') continue;
        // 	await this.message!.react(this.emojis[emoji])
        // }
        this.listenReactions();
    }
    getComponents() {
        const row = new discord_js_1.MessageActionRow()
            .addComponents(new discord_js_1.MessageButton()
            .setLabel('First')
            .setCustomId('first')
            .setStyle('SECONDARY')
            .setDisabled(this.pager.hasFirst() ? false : true))
            .addComponents(new discord_js_1.MessageButton()
            .setLabel('Previous')
            .setCustomId('previous')
            .setStyle('SECONDARY')
            .setDisabled(this.pager.hasPrevious() ? false : true))
            .addComponents(new discord_js_1.MessageButton()
            .setLabel('Next')
            .setCustomId('next')
            .setStyle('SECONDARY')
            .setDisabled(this.pager.hasNext() ? false : true))
            .addComponents(new discord_js_1.MessageButton()
            .setLabel('Last')
            .setCustomId('last')
            .setStyle('SECONDARY')
            .setDisabled(this.pager.hasLast() ? false : true));
        return row;
    }
    listenReactions() {
        const filter = (i) => i.message.id === this.message.id && i.user.id === this.summoner;
        const collector = this.channel.createMessageComponentCollector({ filter: filter });
        collector.on('collect', async (i) => {
            switch (i.customId) {
                case 'first':
                    if (this.pager.first())
                        this.changePage(this.pager.first(), i);
                    break;
                case 'previous':
                    if (this.pager.hasPrevious())
                        this.changePage(this.pager.previous(), i);
                    break;
                case 'next':
                    if (this.pager.hasNext())
                        this.changePage(this.pager.next(), i);
                    break;
                case 'last':
                    if (this.pager.last())
                        this.changePage(this.pager.last(), i);
                    break;
            }
        });
    }
    changePage(page, interaction) {
        interaction.update({
            embeds: page,
            components: [this.getComponents()]
        });
    }
}
exports.EmbedPaginator = EmbedPaginator;
;
