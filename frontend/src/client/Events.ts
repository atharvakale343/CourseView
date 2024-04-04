/**
 * Singleton class for event handling, allowing subscription to, publishing of,
 * and unsubscribing from events. This class implements the singleton pattern to
 * ensure that only one instance exists throughout the application.
 */
export class Events {
  /**
   * @private
   * @static
   * @type {Events|null} The single instance of the Events class.
   */
  static #instance: Events | null = null;

  /**
   * Retrieves the singleton instance of the Events class, creating it if it
   * does not already exist.
   *
   * @returns {Events} The singleton instance of the Events class.
   */

  static events() {
    if (!Events.#instance) {
      Events.#instance = new Events();
    }
    return Events.#instance;
  }

  /**
   * @private
   * @type {Object<string, Function[]>} Object holding arrays of callback
   * functions for each event.
   */
  #subscribers: { [event: string]: Function[] } = {};

  /**
   * Initializes a new instance of the Events class, primarily for internal use
   * due to the singleton pattern.
   */
  constructor() {
    this.#subscribers = {};
  }

  /**
   * Subscribes a callback function to a specific event.
   * @param {string} event The name of the event to subscribe to.
   * @param {Function} callback The callback function to be executed when the
   * event is published.
   */
  subscribe(event: string, callback: Function) {
    if (!this.#subscribers[event]) {
      this.#subscribers[event] = [];
    }
    this.#subscribers[event].push(callback);
  }

  /**
   * Unsubscribes a callback function from a specific event.
   * @param {string} event The name of the event to unsubscribe from.
   * @param {Function} callback The callback function to be removed from the
   * event's subscription list.
   */
  unsubscribe(event: string, callback: Function) {
    if (this.#subscribers[event]) {
      this.#subscribers[event] = this.#subscribers[event].filter(
        (cb) => cb !== callback
      );
    }
  }

  /**
   * Publishes a message to all subscribers of a specific event, executing their
   * callbacks asynchronously.
   * @param {string} event The name of the event to publish.
   * @param {*} message The message or data to be passed to the callback
   * functions of the subscribers.
   *
   * @returns {Promise<void>} A promise that resolves once all callback
   * functions have been executed.
   */
  async publish(event: string, message: any): Promise<void> {
    if (this.#subscribers[event]) {
      await Promise.all(
        this.#subscribers[event].map(async (callback) => {
          await callback(message);
        })
      );
    }
  }
}
