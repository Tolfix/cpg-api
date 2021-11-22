import events from "events";
import { MainOnEvents } from "../Interfaces/Events/on/MainOnEvents";

class MainEvent extends events.EventEmitter
{
  public emit<K extends keyof MainOnEvents>(event: K, args: MainOnEvents[K]): boolean
  {
    return super.emit(event, args);
  }

  public on<K extends keyof MainOnEvents>(eventName: K, listener: (args: MainOnEvents[K]) => void)
  {
      return super.on(eventName, listener);
  }
}
const mainEvent = new MainEvent();
export default mainEvent;