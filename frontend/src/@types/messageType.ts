
export interface IMessage {
  id: number;
  sentDate: string;
  contentText: string;
  contentImageUrl: string | undefined;
  fromUserId: number | undefined;
  toUserId: number | undefined;
  friendBoxId: number | undefined;
  isRead: boolean;
  isDeleted: boolean;
  fromUser: {
    id: number | undefined;
    name: string | undefined;
    picture: string | undefined;
  };
  animationType?: "shake" |  "scale" | "colorful" | undefined;
}
