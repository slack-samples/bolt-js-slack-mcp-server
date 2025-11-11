/**
 * The `assistant_thread_started` event is sent when a user opens the Assistant container.
 * This can happen via DM with the app or as a side-container within a channel.
 *
 * @param {Object} params
 * @param {import("@slack/types").AssistantThreadStartedEvent} params.event - The assistant thread started event.
 * @param {import("@slack/logger").Logger} params.logger - Logger instance.
 * @param {import("@slack/bolt").SayFn} params.say - Function to send messages.
 * @param {Function} params.setSuggestedPrompts - Function to set suggested prompts.
 * @param {Function} params.saveThreadContext - Function to save thread context.
 *
 * @see {@link https://docs.slack.dev/reference/events/assistant_thread_started}
 */
export const assistantThreadStarted = async ({ logger, say, setSuggestedPrompts, saveThreadContext }) => {
  try {
    /**
     * Since context is not sent along with individual user messages, it's necessary to keep
     * track of the context of the conversation to better assist the user. Sending an initial
     * message to the user with context metadata facilitates this, and allows us to update it
     * whenever the user changes context (via the `assistant_thread_context_changed` event).
     * The `say` utility sends this metadata along automatically behind the scenes.
     * !! Please note: this is only intended for development and demonstrative purposes.
     */
    await say('Hi, how can I help?');

    await saveThreadContext();

    /**
     * Provide the user up to 4 optional, preset prompts to choose from.
     *
     * The first `title` prop is an optional label above the prompts that
     * defaults to 'Try these prompts:' if not provided.
     *
     * @see {@link https://docs.slack.dev/reference/methods/assistant.threads.setSuggestedPrompts}
     */
    await setSuggestedPrompts({
      title: 'See the Slack MCP Server in action:',
      prompts: [
        {
          title: 'Send a message to #general on my behalf',
          message:
            'Send a message on my behalf to #general, indicating the demo worked and the possibilities are endless!',
        },
        {
          title: 'Create a canvas for team standup',
          message: 'Create a general template for a team standup',
        },
      ],
    });
  } catch (e) {
    logger.error(e);
  }
};
