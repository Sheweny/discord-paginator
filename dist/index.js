"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmbedPaginator = void 0;
const array_paginator_1 = require("array-paginator");
class EmbedPaginator {
    constructor(channel, pages = [], options) {
        this.channel = channel;
        this.pager = new array_paginator_1.Paginator(pages, 1);
        this.summoner = options.summoner;
        this.message = null;
        this.emojis = {
            first: '⏮️',
            previous: '◀️',
            next: '▶️',
            last: '⏭️',
            all: ['⏮️', '◀️', '▶️', '⏭️'],
        };
        this.init();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            // Verifications :
            if (this.pager.total < 2)
                throw new Error('A Pagination Embed must contain at least 2 pages');
            // Send the message
            this.message = yield this.channel.send({ embeds: this.pager.first() });
            // React to the message
            for (const emoji in this.emojis) {
                if (emoji === 'all')
                    continue;
                yield this.message.react(this.emojis[emoji]);
            }
            this.listenReactions();
        });
    }
    listenReactions() {
        const filter = (reaction, user) => user.id === this.summoner && this.emojis.all.includes(reaction.emoji.name);
        const collector = this.message.createReactionCollector(filter, { time: 1000 * 60 * 15 });
        collector.on('collect', (e) => {
            e.users.cache.map(u => {
                if (u.id != this.message.author.id)
                    e.users.remove(u);
            });
            switch (e.emoji.name) {
                case this.emojis.first:
                    if (this.pager.first())
                        this.changePage(this.pager.first());
                    break;
                case this.emojis.previous:
                    if (this.pager.hasPrevious())
                        this.changePage(this.pager.previous());
                    break;
                case this.emojis.next:
                    if (this.pager.hasNext())
                        this.changePage(this.pager.next());
                    break;
                case this.emojis.last:
                    if (this.pager.last())
                        this.changePage(this.pager.last());
                    break;
            }
        });
    }
    changePage(page) {
        if (page)
            this.message.edit({ embeds: page });
    }
}
exports.EmbedPaginator = EmbedPaginator;
;
