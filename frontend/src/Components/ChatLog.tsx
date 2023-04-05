import { RiChatSmile3Fill } from "react-icons/ri";

const ChatLog = () => {
  return (
    <div className=" bg-[#363636] flex-1  h-full fade-in">
      {/* TEMP */}
      <div className="flex ">
        <div className="  w-full p-2 flex items-center gap-3">
          <img
            className="w-10 h-10 object-cover rounded-full"
            src="data:image/jpeg;base64,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"
            alt=""
          />
          <span className="text-xl">John Doe</span>
        </div>
      </div>
      {/* Log */}
      <div className="flex max-lg:h-[calc(100%-55px)] h-[calc(100%-40px)] flex-col">
        <div className=" flex-1">
          
        </div>
        {/* TEMP  */}
        <form className=" relative  ">
          <label className=" focus-within:border-green-600 bg-white text-[#252525] left-0 right-0 py-2 pl-9  max-lg:bottom-0 bottom-4 absolute  border-4 ">
            <div className="relative">
              <RiChatSmile3Fill
                size={20}
                className="absolute -left-7 text-green-500 top-0.5"
              />
              <input
                type="text"
                placeholder="Say Hi!"
                className="bg-transparent w-full outline-none  "
              />
            </div>
          </label>
        </form>
      </div>
    </div>
  );
};

export default ChatLog;
