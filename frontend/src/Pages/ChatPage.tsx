import { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { Fetcher } from "../utils/Fetcher";
import ChatLog from "../Components/ChatLog";
import SideBar from "../Components/SideBar";
import ProfileSettings from "../Components/ProfileSettings";
import Welcome from "../Components/Welcome";
import Notification from "../Components/Notification";
import { useConnectionContext } from "../Context/ConnectionProvider";
import { sleep } from "../utils/sleep";
import { INotification } from "../@types/notificationInterface";
import { IHubMessageResponse } from "../@types/hubMessageResponse";
import { IFriendList } from "../@types/friendBoxType";
import { ITalkingTo } from "../@types/talkingTo";

const ChatPage = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [notification, setNotification] = useState<INotification | undefined>(
    undefined
  );

  const notificationAudio = new Audio(
    "https://assets.mixkit.co/active_storage/sfx/2870/2870-preview.mp3"
  );
  notificationAudio.volume = 0.2;

  const messageAudio = new Audio(
    "https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3"
  );
  messageAudio.volume = 0.2;

  const conCtx = useConnectionContext();
  const ctx = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const friendRequestListener = async (friendBox: IFriendList) => {
      ctx?.setFriendList((prev) => [...(prev || []), friendBox]);
    };
    const approveFriendListener = async (friendBox: IFriendList) => {
      console.log(friendBox);

      ctx?.setFriendList((prev) => {
        if (prev) {
          const updatedList = prev.map((friend) => {
            if (friend.id === friendBox.id) {
              return {
                ...friend,
                approved: friendBox.approved,
              };
            }
            return friend;
          });
          return updatedList;
        }
        return prev;
      });
    };

    const connection = conCtx?.connection;

    if (connection) {
      connection.on("RecieveFriend", friendRequestListener);
      connection.on("ApproveFriend", approveFriendListener);
      return () => {
        connection.off("RecieveFriend", friendRequestListener);
        connection.off("ApproveFriend", approveFriendListener);
      };
    }
  }, [conCtx?.connection]);

  useEffect(() => {
    const receiveMessage = async (hubMessageResponse: IHubMessageResponse) => {
      if (
        ctx?.talkingTo?.friendBoxId ===
        hubMessageResponse.hubMessageSent.friendBoxId
      ) {
        messageAudio.play();
        await Fetcher({
          method: "GET",
          url: "/api/messages/read/" + ctx.talkingTo?.friendBoxId,
          token: ctx?.getCookie("jwt"),
        });

        ctx?.setFriendList((prev) => {
          const updatedFriendList = prev?.map((friendship) => {
            if (friendship.id === ctx.talkingTo?.friendBoxId) {
              return {
                ...friendship,
                unreadMessageCount: 0,
                lastMessage: hubMessageResponse.hubMessageSent.contentText,
                lastMessageFrom:
                  hubMessageResponse.hubMessageSent.fromUser.name,
              };
            }
            return friendship;
          });
          return updatedFriendList;
        });
      } else {
        notificationAudio.play();

        ctx?.setFriendList((prev) => {
          let friend = prev?.find(
            (f) => f.id === hubMessageResponse.friendship.id
          );
          if (friend) {
            friend.updateTime = hubMessageResponse.friendship.updateTime;
            friend.unreadMessageCount = hubMessageResponse.unreadMessageCount;
            friend.lastMessage = hubMessageResponse.hubMessageSent.contentText;
            friend.lastMessageFrom =
              hubMessageResponse.hubMessageSent.fromUser.name;
            return [...(prev || [])];
          }
          return prev || [];
        });
      }

      ctx?.setMessages((prev) => [
        ...(prev || []),
        hubMessageResponse.hubMessageSent,
      ]);

      if (
        (ctx?.talkingTo &&
          ctx.talkingTo.id !== hubMessageResponse.hubMessageSent.fromUserId) ||
        !ctx?.talkingTo
      ) {
        setNotification({
          shown: true,
          message: hubMessageResponse.hubMessageSent,
          talkingTo: {
            friendBoxId: hubMessageResponse.hubMessageSent.friendBoxId,
            id: hubMessageResponse.hubMessageSent.fromUserId,
            isApproved: true,
            name: hubMessageResponse.hubMessageSent.fromUser.name,
            picture: hubMessageResponse.hubMessageSent.fromUser.picture,
          },
        });

        await sleep(2000);
        setNotification({
          shown: false,
          message: hubMessageResponse.hubMessageSent,
          talkingTo: {
            friendBoxId: hubMessageResponse.hubMessageSent.friendBoxId,
            id: hubMessageResponse.hubMessageSent.fromUserId,
            isApproved: true,
            name: hubMessageResponse.hubMessageSent.fromUser.name,
            picture: hubMessageResponse.hubMessageSent.fromUser.picture,
          },
        });
      }
    };

    const connection = conCtx?.connection;

    if (connection) {
      connection.on("RecieveMessage", receiveMessage);

      return () => {
        connection.off("RecieveMessage", receiveMessage);
      };
    }
  }, [ctx?.talkingTo, conCtx?.connection]);

  useEffect(() => {
    const loginHub = async () => {
      if (ctx?.user?.id) {
        console.log(
          "JoinRoom isteği atildi. Payload",
          ctx?.user?.id.toString()
        );
        await conCtx?.connection?.invoke("JoinRoom", {
          UserId: ctx.user?.id.toString(),
        });
      }
    };

    loginHub();
  }, [ctx?.user?.id,conCtx?.connection]);

  useEffect(() => {
    const getUser = async () => {
      const jwt = ctx?.getCookie("jwt");

      if (!jwt) {
        navigate("/");
        return;
      }

      const sessionData = await Fetcher({
        body: null,
        method: "GET",
        url: "/api/authentication/session",
        token: jwt,
      });

      if (sessionData?.status !== 401) {
        ctx?.setUser(sessionData);
      }

      const friendsData = await Fetcher({
        body: null,
        method: "GET",
        url: "/api/friendboxes/friends",
        token: jwt,
      });

      ctx?.setFriendList(friendsData);
    };

    getUser();
  }, []);

  const closeProfile = () => {
    setShowProfile(false);
  };
  const openProfile = () => {
    setShowProfile(true);
    setShowWelcome(false);
  };

  const closeWelcome = () => {
    setShowWelcome(false);
  };

  const openWelcome = () => {
    setShowWelcome(true);
    setShowProfile(false);
  };

  if (ctx?.user) {
    return (
      <div className="flex   lg:p-5 lg:px-10   xl:px-20  2xl:px-40   text-white h-full ">
        <div className="flex w-full relative max-w-[1920px] mx-auto lg:rounded-xl  overflow-hidden shadow-lg shadow-[rgba(0,0,0,0.5)]">
          {/* Notification */}

          <Notification
            notification={notification}
            closeProfile={closeProfile}
            closeWelcome={closeWelcome}
          />

          {/* SideBar */}
          <SideBar
            openProfile={openProfile}
            closeProfile={closeProfile}
            openWelcome={openWelcome}
            closeWelcome={closeWelcome}
          />

          {/* ChatLog */}
          {showProfile ? (
            <ProfileSettings closeProfile={closeProfile} openWelcome={openWelcome} />
          ) : showWelcome ? (
            <Welcome  closeWelcome={closeWelcome}/>
          ) : ctx.talkingTo && ctx.talkingTo.isApproved ? (
            <ChatLog talkingTo={ctx.talkingTo} messages={ctx.messages} />
          ) : null}
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex lg:p-5 lg:px-10  xl:px-20  2xl:px-40   text-white h-full ">
        <div
          className={`flex  w-full max-w-[1920px] mx-auto lg:rounded-xl overflow-hidden shadow-lg shadow-[rgba(0,0,0,0.5)]`}
        >
          <div
            className={` p-2  bg-[#252525]  overflow-hidden relative  w-64 `}
          >
            <ul className="flex flex-col gap-1 ">
              <li className="flex gap-4 animate-pulse items-center transition-all bg-neutral-700 rounded-lg p-1 px-2 cursor-pointer">
                <span className="w-10 h-10 rounded-full  bg-green-500"></span>
                <span className="dots  gap-1">
                  <span className="w-2 bg-neutral-400"></span>
                  <span className="w-2 bg-neutral-400"></span>
                  <span className="w-2 bg-neutral-400"></span>
                </span>
              </li>
              <li className="flex gap-4 animate-pulse items-center transition-all bg-neutral-700 rounded-lg p-1 px-2 cursor-pointer">
                <span className="w-10 h-10 rounded-full  bg-green-500"></span>
                <span className="dots  gap-1">
                  <span className="w-2 bg-neutral-400"></span>
                  <span className="w-2 bg-neutral-400"></span>
                  <span className="w-2 bg-neutral-400"></span>
                </span>
              </li>
              <li className="flex gap-4 animate-pulse items-center transition-all bg-neutral-700 rounded-lg p-1 px-2 cursor-pointer">
                <span className="w-10 h-10 rounded-full  bg-green-500"></span>
                <span className="dots  gap-1">
                  <span className="w-2 bg-neutral-400"></span>
                  <span className="w-2 bg-neutral-400"></span>
                  <span className="w-2 bg-neutral-400"></span>
                </span>
              </li>
              <li className="flex gap-4 animate-pulse items-center transition-all bg-neutral-700 rounded-lg p-1 px-2 cursor-pointer">
                <span className="w-10 h-10 rounded-full  bg-green-500"></span>
                <span className="dots  gap-1">
                  <span className="w-2 bg-neutral-400"></span>
                  <span className="w-2 bg-neutral-400"></span>
                  <span className="w-2 bg-neutral-400"></span>
                </span>
              </li>
              <li className="flex gap-4 animate-pulse items-center transition-all bg-neutral-700 rounded-lg p-1 px-2 cursor-pointer">
                <span className="w-10 h-10 rounded-full  bg-green-500"></span>
                <span className="dots  gap-1">
                  <span className="w-2 bg-neutral-400"></span>
                  <span className="w-2 bg-neutral-400"></span>
                  <span className="w-2 bg-neutral-400"></span>
                </span>
              </li>
              <li className="flex gap-4 animate-pulse items-center transition-all bg-neutral-700 rounded-lg p-1 px-2 cursor-pointer">
                <span className="w-10 h-10 rounded-full  bg-green-500"></span>
                <span className="dots  gap-1">
                  <span className="w-2 bg-neutral-400"></span>
                  <span className="w-2 bg-neutral-400"></span>
                  <span className="w-2 bg-neutral-400"></span>
                </span>
              </li>
              <li className="flex gap-4 animate-pulse items-center transition-all bg-neutral-700 rounded-lg p-1 px-2 cursor-pointer">
                <span className="w-10 h-10 rounded-full  bg-green-500"></span>
                <span className="dots  gap-1">
                  <span className="w-2 bg-neutral-400"></span>
                  <span className="w-2 bg-neutral-400"></span>
                  <span className="w-2 bg-neutral-400"></span>
                </span>
              </li>
            </ul>
            <div className="bg-green-500 h-12 flex absolute bottom-0 py-2 left-0 right-0"></div>
          </div>

          <div className="bg-[#363636] flex-1 flex items-center  justify-center h-full">
            <span className="dots  gap-5">
              <span className="w-7 bg-green-500"></span>
              <span className="w-7 bg-green-500"></span>
              <span className="w-7 bg-green-500"></span>
            </span>
          </div>
        </div>
      </div>
    );
  }
};

export default ChatPage;
