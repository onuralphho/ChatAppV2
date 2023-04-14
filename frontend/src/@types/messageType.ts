

export interface IMessage {
    id:number,
    sentDate:string,
    contentText:string,
    fromUserId:number,
    toUserId:number,
    friendBoxId:number
    fromUser: {
      id:number,
      name:string,
      picture:string
    }
  }