import { useAuth } from "../Context/AuthProvider";
import { IFriendList } from "../@types/friendBoxType";
interface Iprops {
  showMenu: boolean;
}

const FriendList = (props: Iprops) => {
  const ctx = useAuth();

  if (ctx?.friendList) {
    return (
      <ul className="flex flex-col">
        {ctx?.friendList?.map((friendBox: IFriendList) => (
          <li
            key={friendBox.id}
            className="flex gap-4 items-center transition-all hover:bg-neutral-700 rounded-lg p-1 px-2 cursor-pointer"
          >
            <img
              className="w-10 h-10 object-cover rounded-full"
              src={
                ctx?.user.id !== friendBox.fromUser.id
                  ? friendBox.fromUser.picture
                  : friendBox.toUser.picture
              }
              alt=""
            />
            {props.showMenu && (
              <span className="truncate ">
                {ctx?.user.id !== friendBox.fromUser.id
                  ? friendBox.fromUser.name
                  : friendBox.toUser.name}
              </span>
            )}
          </li>
        ))}
      </ul>
    );
  } else {
    return (
      <ul className="flex flex-col">
        <li className="flex gap-4 items-center transition-all hover:bg-neutral-700 rounded-lg p-1 px-2 cursor-pointer">
          <span className="w-10 h-10 object-cover rounded-full bg-green-500"></span>
          {props.showMenu && <span className="truncate ">Loading...</span>}
        </li>
        <li className="flex gap-4 items-center transition-all hover:bg-neutral-700 rounded-lg p-1 px-2 cursor-pointer">
          <span className="w-10 h-10 object-cover rounded-full bg-green-500"></span>
          {props.showMenu && <span className="truncate ">Loading...</span>}
        </li>
        <li className="flex gap-4 items-center transition-all hover:bg-neutral-700 rounded-lg p-1 px-2 cursor-pointer">
          <span className="w-10 h-10 object-cover rounded-full bg-green-500"></span>
          {props.showMenu && <span className="truncate ">Loading...</span>}
        </li>
        <li className="flex gap-4 items-center transition-all hover:bg-neutral-700 rounded-lg p-1 px-2 cursor-pointer">
          <span className="w-10 h-10 object-cover rounded-full bg-green-500"></span>
          {props.showMenu && <span className="truncate ">Loading...</span>}
        </li>
      </ul>
    );
  }
};

export default FriendList;
