import request from "request";
import events from "events";
import { MainOnEvents } from "../Interfaces/Events/MainOnEvents.interface";
import ConfigModel from "../Database/Models/Configs.model";
import { Webhook_Secret } from "../Config";

class MainEvent extends events.EventEmitter
{
  public emit<K extends keyof MainOnEvents>(event: K, args: MainOnEvents[K]): boolean
  {
    // Webhook
    // It sends webhooks specified url
    (async () =>
    {
      // Grabs the URLS from config
      const URLS = (await ConfigModel.find())[0].webhooks_urls;
      // // // // // // // // // //
      if (URLS.length > 0)
        for (const URL of URLS)
          request.post(URL, {
            json: {
              event: event,
              data: args,
              secret: Webhook_Secret,
            }
          });
      // // // // // // // // // //
    })();
    return super.emit(event, args);
  }

  public on<K extends keyof MainOnEvents>(eventName: K, listener: (args: MainOnEvents[K]) => void)
  {
      return super.on(eventName, listener);
  }
}
const mainEvent = new MainEvent();
export default mainEvent;