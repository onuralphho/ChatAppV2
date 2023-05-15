interface FriendUser {
  id: number;
  name: string;
  picture: string;
  feeling: string | null;
}

export interface IFriendList {
  id: number;
  fromUser: FriendUser;
  fromUserId: number;
  toUser: FriendUser;
  toUserId: number;
  updateTime: string;
  approved: boolean;
  lastMessage: string | undefined;
  lastMessageFrom: string | undefined;
  unreadMessageCount: number;
  typingStatus: boolean ;
}
