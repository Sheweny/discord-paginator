import { Paginator } from 'array-paginator';
import type { Message, MessageReaction, TextChannel, User } from 'discord.js';
import type { IOptions, IObject } from './ts/interfaces';

export class EmbedPaginator {
	channel: TextChannel;
	pager: Paginator<any>;
	summoner: string;
	emojis: IObject
	message: Message | null
	constructor(channel: TextChannel, pages = [], options: IOptions) {
		this.channel = channel
		this.pager = new Paginator(pages, 1)
		this.summoner = options.summoner
		this.message = null;
		this.emojis = {
			first: '⏮️',
			previous: '◀️',
			next: '▶️',
			last: '⏭️',
			all: ['⏮️', '◀️', '▶️', '⏭️'],
		}
		this.init()
	}
	async init() {
		// Verifications :
		if (this.pager.total < 2) throw new Error('A Pagination Embed must contain at least 2 pages')
		// Send the message
		this.message = await this.channel.send({ embeds: this.pager.first()! })
		// React to the message
		for (const emoji in this.emojis) {
			if (emoji === 'all') continue;
			await this.message!.react(this.emojis[emoji])
		}
		this.listenReactions()
	}

	listenReactions() {
		const filter = (reaction: MessageReaction, user: User) => user.id === this.summoner && this.emojis.all.includes(reaction.emoji.name)
		const collector = this.message!.createReactionCollector(filter, { time: 1000 * 60 * 15 })
		collector.on('collect', (e) => {
			e.users.cache.map(u => {
				if (u.id != this.message!.author.id) e.users.remove(u)
			});
			switch (e.emoji.name) {
				case this.emojis.first:
					if (this.pager.first())
						this.changePage(this.pager.first())
					break;
				case this.emojis.previous:
					if (this.pager.hasPrevious())
						this.changePage(this.pager.previous())
					break;
				case this.emojis.next:
					if (this.pager.hasNext())
						this.changePage(this.pager.next())
					break;
				case this.emojis.last:
					if (this.pager.last())
						this.changePage(this.pager.last())
					break;

			}
		})
	}
	changePage(page: any) {
		if (page) this.message!.edit({ embeds: page })
	}
};