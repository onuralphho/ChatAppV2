interface FriendUser{
    id:number;
    name:string;
    picture:string;

}


export interface IFriendList {
    id:number
    fromUser: FriendUser;
    fromUserId: number;
    toUser: FriendUser;
    toUserId: number;
    updateTime: Date;
    approved:boolean;
  }