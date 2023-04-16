import { IMessage } from "./messageType";
import { ITalkingTo } from "./talkingTo";

export interface INotification {
    
    shown: boolean;
    talkingTo?: ITalkingTo;
    message?: IMessage;
}