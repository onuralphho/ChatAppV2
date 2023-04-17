import { IFriendList } from "./friendBoxType";
import { IMessage } from "./messageType";

export interface IHubMessageResponse {
    hubMessageSent: IMessage
    friendship: IFriendList
    unreadMessageCount : number
}