export interface IMessage {
  id: number;
  sentDate: string;
  contentText: string;
  fromUserId: number;
  toUserId: number;
  friendBoxId: number;
  isRead: boolean;
  isDeleted: boolean;
  fromUser: {
    id: number;
    name: string;
    picture: string;
  };
}
