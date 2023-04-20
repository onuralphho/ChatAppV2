import { IFriendList } from "../@types/friendBoxType";
import { useAuth } from "../Context/AuthProvider";
import { Fetcher } from "../utils/Fetcher";

const Welcome = (props: any) => {
  const ctx = useAuth();

  return (
    <div className="bg-[#363636] flex-1 h-full fade-in">
      <div className="h-full flex flex-col justify-around items-center gap-4 px-2 ">
        <span>
          <span className="text-6xl"> Welcome</span>{" "}
          <span className="text-5xl salute">👋</span>
        </span>
        <div className="flex flex-col ">
          <h2>Last Chats</h2>
          <div className="flex gap-2 ">
            {ctx?.friendList &&
              ctx.friendList.slice(0, 2).map((friendlist: IFriendList) => (
                <div
                  key={friendlist.id}
                  onClick={async () => {
                    props.closeWelcome();
                    ctx.setTalkingTo({
                      friendBoxId: friendlist.id,
                      isApproved: friendlist.approved,
                      picture:
                        ctx.user?.id === friendlist.fromUserId
                          ? friendlist.toUser.picture
                          : friendlist.fromUser.picture,
                      name:
                        ctx.user?.id === friendlist.fromUserId
                          ? friendlist.toUser.name
                          : friendlist.fromUser.name,
                      id:
                        ctx.user?.id === friendlist.fromUserId
                          ? friendlist.toUserId
                          : friendlist.fromUserId,
                    });

                    const res = await Fetcher({
                      method: "GET",
                      url: "/api/messages/" + friendlist.id,
                      token: ctx?.getCookie("jwt"),
                    });

                    ctx?.setMessages(res);

                    await Fetcher({
                      method: "GET",
                      url: "/api/messages/read/" + friendlist.id,
                      token: ctx?.getCookie("jwt"),
                    });

                    ctx?.setFriendList((prev) => {
                      const updatedFriendList = prev?.map((friendship) => {
                        if (friendship.id === friendlist.id) {
                          return {
                            ...friendship,
                            unreadMessageCount: 0,
                          };
                        }
                        return friendship;
                      });
                      return updatedFriendList;
                    });
                  }}
                  className="flex gap-2  bg-neutral-600 px-2 py-2 rounded-md hover:bg-neutral-400 transition-all cursor-pointer"
                >
                  <img
                    src={
                      ctx.user?.id === friendlist.fromUser.id
                        ? friendlist.toUser.picture
                        : friendlist.fromUser.picture
                    }
                    className="w-12 object-contain rounded-full"
                    alt=""
                  />
                  <div className="flex flex-col justify-center">
                    <span>
                      {ctx.user?.id === friendlist.fromUser.id
                        ? friendlist.toUser.name
                        : friendlist.fromUser.name}
                    </span>
                    <span className="text-xs opacity-75 truncate w-28">
                      {friendlist.lastMessage &&
                        friendlist.lastMessageFrom +
                          ":" +
                          friendlist.lastMessage}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
