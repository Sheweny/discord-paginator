import { Paginator } from 'array-paginator';
import { MessageActionRow, MessageButton } from "discord.js";
import type { Message, ButtonInteraction, TextChannel } from 'discord.js';
import type { IOptions, IObject } from './ts/interfaces';

export class EmbedPaginator {
	channel: TextChannel;
	pager: Paginator<any>;
	summoner: string;
	// emojis: IObject
	message: Message | null
	constructor(channel: TextChannel, pages = [], options: IOptions) {
		this.channel = channel
		this.pager = new Paginator(pages, 1)
		this.summoner = options.summoner
		this.message = null;
		// this.emojis = {
		// 	first: '⏮️',
		// 	previous: '◀️',
		// 	next: '▶️',
		// 	last: '⏭️',
		// 	all: ['⏮️', '◀️', '▶️', '⏭️'],
		// }
		this.init()
	}
	async init() {
		// Verifications :
		if (this.pager.total < 2) throw new Error('A Pagination Embed must contain at least 2 pages')
		// Send the message

		this.message = await this.channel.send({ embeds: this.pager.first()!, components: [this.getComponents()] })
		// React to the message
		// for (const emoji in this.emojis) {
		// 	if (emoji === 'all') continue;
		// 	await this.message!.react(this.emojis[emoji])
		// }
		this.listenReactions()
	}
	getComponents() {
		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setLabel('First')
					.setCustomId('first')
					.setStyle('SECONDARY')
					.setDisabled(this.pager.hasFirst() ? false : true)
			)
			.addComponents(
				new MessageButton()
					.setLabel('Previous')
					.setCustomId('previous')
					.setStyle('SECONDARY')
					.setDisabled(this.pager.hasPrevious() ? false : true)
			)
			.addComponents(
				new MessageButton()
					.setLabel('Next')
					.setCustomId('next')
					.setStyle('SECONDARY')
					.setDisabled(this.pager.hasNext() ? false : true)
			)
			.addComponents(
				new MessageButton()
					.setLabel('Last')
					.setCustomId('last')
					.setStyle('SECONDARY')
					.setDisabled(this.pager.hasLast() ? false : true)
			)
		return row
	}
	listenReactions() {
		const filter = (i: ButtonInteraction) => i.message.id === this.message!.id && i.user.id === this.summoner
		const collector = this.channel.createMessageComponentCollector({ filter: filter })
		collector.on('collect', async (i: ButtonInteraction) => {
			switch (i.customId) {
				case 'first':
					if (this.pager.first())
						this.changePage(this.pager.first(), i)
					break;
				case 'previous':
					if (this.pager.hasPrevious())
						this.changePage(this.pager.previous(), i)
					break;
				case 'next':
					if (this.pager.hasNext())
						this.changePage(this.pager.next(), i)
					break;
				case 'last':
					if (this.pager.last())
						this.changePage(this.pager.last(), i)
					break;
			}
		});
	}
	changePage(page: any, interaction: ButtonInteraction) {
		interaction.update({
			embeds: page,
			components: [this.getComponents()]
		})
	}
};