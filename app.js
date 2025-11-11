import { App, FileInstallationStore, LogLevel } from '@slack/bolt';
import 'dotenv/config';
import { Assistant } from '@slack/bolt';
import { assistantThreadContextChanged } from './listeners/assistant/assistant-thread-context-changed.js';
import { assistantThreadStarted } from './listeners/assistant/assistant-thread-started.js';
import { userMessage } from './listeners/assistant/user-message.js';

const app = new App({
  logLevel: LogLevel.DEBUG,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  clientId: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
  stateSecret: process.env.SLACK_STATE_SECRET,
  scopes: ['assistant:write', 'channels:history', 'chat:write', 'groups:history', 'im:history', 'mpim:history'],
  installerOptions: {
    userScopes: ['chat:write', 'canvases:write'],
  },
  // FileInstallationStore is intended for development purposes only.
  // For production, you should use a database to store installations.
  installationStore: new FileInstallationStore({ baseDir: './installations' }),
});

// Initialize the Assistant
const assistant = new Assistant({
  threadStarted: assistantThreadStarted,
  threadContextChanged: assistantThreadContextChanged,
  userMessage: userMessage,
});

app.assistant(assistant);

/** Start Bolt App */
(async () => {
  try {
    await app.start(process.env.PORT || 3000);
    app.logger.info('⚡️ Bolt app is running! ⚡️');
  } catch (error) {
    app.logger.error('Unable to start App', error);
  }
})();
