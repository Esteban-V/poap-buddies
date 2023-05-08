# POAP Buddies Discord Bot

POAP Buddies is a Discord bot designed for checking common POAPs (Proof of Attendance Protocol) between two Ethereum addresses or ENS names. Built using TypeScript, it's an easy-to-use tool for discovering mutual POAPs and learning more about the history of your interactions with others in the Ethereum community.

## Feature

- **/checkbud Command**: A command for the Discord server that allows users to compare POAPs between two Ethereum addresses or ENS names. Upon execution, the bot generates a summary of common POAPs, including additional information such as the oldest shared POAP.

## Setup & Installation

1. Clone this repository:
```
git clone https://github.com/Esteban-V/poap-buddies
```

2. Change the working directory to the project folder:
```
cd poap-buddies
```

3. Install dependencies:
```
npm install
```

4. Create a `.env` file in the project root and add your Discord bot token:
```
GUILD_ID=<GUILD_ID>
DISCORD_TOKEN=<DISCORD_TOKEN>
POAP_API_BASE_URL=https://api.poap.tech
POAP_API_KEY=<POAP_API_KEY>
```

5. Compile TypeScript to JavaScript:
```
npm run build
```

6. Start the bot:

## Usage

To use the `/checkbud` command, follow the syntax below:

```
/checkbud <address1> <address2>
```

- `<address1>`: The first Ethereum address or ENS name.
- `<address2>`: The second Ethereum address or ENS name.

Example:
```
/checkbud estok.eth poap.eth
```

After executing the command, the bot will provide a summary of the POAPs shared between the given addresses, along with additional information such as the oldest common POAP.

## Contributing

We welcome contributions! Feel free to open issues and submit pull requests to improve the project.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.
