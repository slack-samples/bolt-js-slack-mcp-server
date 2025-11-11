# Slack MCP Server AI Agent Template (Bolt for JavaScript)

> ⚠️ **Beta Notice**: This template demonstrates MCP functionality that is currently in beta and not yet widely available to all developers. The functionality shown here is being tested and may change before general availability.


This Bolt for JavaScript template demonstrates how to build [AI Apps](https://docs.slack.dev/ai/) in Slack that leverage the Slack MCP server.

Models from [OpenAI](https://openai.com) are used and can be customized for prompts of all kinds.

## Setup

Before getting started, make sure you have a development workspace where you have permissions to install apps. If you don’t have one setup, go ahead and [create one](https://slack.com/create).

### Developer Program

Join the [Slack Developer Program](https://api.slack.com/developer-program) for exclusive access to sandbox environments for building and testing your apps, tooling, and resources created to help you build and grow.

## Installation

### Create a Slack App

1. Open [https://api.slack.com/apps/new](https://api.slack.com/apps/new) and
   choose "From an app manifest"
2. Choose the workspace you want to install the application to
3. Copy the contents of [manifest.json](./manifest.json) into the text box that
   says `*Paste your manifest code here*` (within the JSON tab) and click _Next_
4. Review the configuration and click _Create_

### Clone the project
```zsh
# Clone this project onto your machine
git clone https://github.com/slack-samples/bolt-js-slack-mcp-server.git
```

### Environment Variables

Before you can run the app, you'll need to store some environment variables.

1. Rename `.env.sample` to `.env`.
2. Open your apps setting page from [this list](https://api.slack.com/apps), click _Basic Information_ in the left hand menu, then copy the following values into your `.env` file:
```zsh
SLACK_CLIENT_ID=YOUR_APP_CLIENT_ID
SLACK_CLIENT_SECRET=YOUR_APP_CLIENT_SECRET
SLACK_SIGNING_SECRET=YOUR_APP_SIGNING_SECRET
SLACK_INSTALL_URL='https://<APP_INSTALLATION_URL>/slack/install'
```

_Note: the `SLACK_INSTALL_URL` is where users initiate the installation of the app into their workspace. For more information about this URL, please see the [OAuth](#oauth) section._

3. Unlock the OpenAI models from your OpenAI account dashboard by clicking [create a new secret key](https://platform.openai.com/api-keys), then save your OpenAI key into the `.env` file as `OPENAI_API_KEY` like so:
```zsh
OPENAI_API_KEY=YOUR_OPEN_API_KEY
```


### Local Project

```zsh
# Change into the project directory
cd bolt-js-slack-mcp-server

# Install dependencies
npm install

# Run Bolt server
npm start
```

### Linting

```zsh
# Run lint for code formatting and linting
npm run lint
```

## OAuth

This sample relies on the usage of user tokens, and therefore requires individual user installations to function as intended.

> **Reminder: the Bolt app must be running _and_ the following endpoints made available for the below URLs to be accessible when updating them in the app configuration.**

When using OAuth, Slack requires a public URL where it can send requests. In this template app, we've used [`ngrok`](https://ngrok.com/download). Checkout [this guide](https://ngrok.com/docs#getting-started-expose) for setting it up.

Start `ngrok` to access the app on an external network and create a redirect URL for OAuth.

```
ngrok http 3000
```

This output should include a forwarding address for `http` and `https` (we'll use `https`). It should look something like the following:

```
Forwarding   https://3cb89939.ngrok.io -> http://localhost:3000
```

Navigate to **OAuth & Permissions** in your app configuration and update the **Redirect URL**. The redirect URL should be set to your `ngrok` forwarding address with the `slack/oauth_redirect` path appended. For example:

```
https://3cb89939.ngrok.io/slack/oauth_redirect
```

Navigate to **Event Subscriptions** in your app configuration and update the **Request URL**. The request URL should be set to your `ngrok` forwarding address with the `slack/events` path appended. For example:

```
https://3cb89939.ngrok.io/slack/events
```

This public URL is also where users navigate to in order to install the app into their workspace. Like the **Redirect URL** and **Request URL**, Bolt sets the installation URL to be `slack/install` by default. For example:

```
https://3cb89939.ngrok.io/slack/install
```

## Usage
After installing the app into a workspace using the OAuth installtion flow, create a new chat (via DM) with the chatbot. 

Upon creation of the new chat, the user is prompted with two static options that demonstrate either sending a message to #general, or creating a new canvas – both as and on behalf of the user.

## Project Structure

### `manifest.json`

`manifest.json` is a configuration for Slack apps. With a manifest, you can create an app with a pre-defined configuration, or adjust the configuration of an existing app.

### `app.js`

`app.js` is the entry point for the application and is the file you'll run to start the server. This project aims to keep this file as thin as possible, primarily using it as a way to route inbound requests.

**`/listeners/assistant`**

Configures the new Slack Assistant features, providing a dedicated side panel UI for users to interact with the AI chatbot. This module includes:

- The `assistant-thread-started.js` file, which responds to new app threads with a list of suggested prompts.
- The `assistant-thread-context-changed.js` file, which updates the context to include information about where the conversation with the chatbot is occurring (i.e., in a DM or within a channel).
- The `user-message.js` file, which responds to user messages sent to app threads or from the **Chat** and **History** tab with an LLM generated response.