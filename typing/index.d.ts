import { Paginator } from 'array-paginator';
import { MessageActionRow } from "discord.js";
import type { Message, ButtonInteraction, TextChannel } from 'discord.js';
import type { IOptions } from './ts/interfaces';
export declare class EmbedPaginator {
    channel: TextChannel;
    pager: Paginator<any>;
    summoner: string;
    message: Message | null;
    constructor(channel: TextChannel, pages: any[], options: IOptions);
    init(): Promise<void>;
    getComponents(): MessageActionRow;
    listenReactions(): void;
    changePage(page: any, interaction: ButtonInteraction): void;
}
