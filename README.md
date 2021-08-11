# Discord embed paginator

This module is a paginator of embeds using discord.js V13 and array-paginator module.

## Getting started

### Prerequisites

- Node.js 16.6.0 or newer is required.

- Discord.js V13.0.0 is required.

### Installation

With npm

```sh-session
npm install @discord-util/paginator
```

With yarn

```sh-session
yarn add @discord-util/paginator
```

### Usage

Create a new instance of the EmbedPaginator class.

Parameters :

- Channel : The channel of the paginator (type : `TextChannel|ThreadChannel`)
- Data : A list of embeds to display (type : `Array<MessageEmbed>`)
- Options : The options (type : `Options`)

Options :

|   Name   |  Type  |      Description       | Default | Required |
| :------: | :----: | :--------------------: | :-----: | :------: |
| summoner | string | The id of the summoner |  None   |   yes    |

## Example

```js
const { Client, MessageEmbed } = require("discord.js");
const { EmbedPaginator } = require("../dist/index");
const embed = new MessageEmbed()
  .setTitle("Hi")
  .setColor("orange")
  .setDescription("Hello");
const embed = new MessageEmbed()
  .setTitle("Hello world")
  .setColor("blue")
  .setDescription("Hello world !");
const data = [embed, embed2];

const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });
client.on("messageCreate", async (msg) => {
  const args = msg.content.split(" ");
  if (args[0] != "!help") return;
  new EmbedPaginator(msg.channel, data, {
    summoner: msg.member.id,
    maxPerPage: 1,
  });
});
client.login("");
```
