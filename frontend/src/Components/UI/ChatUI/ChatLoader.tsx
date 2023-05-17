const ChatLoader = (props:any) => {
  return (
    <div className={` flex max-md:pr-2  rounded-lg gap-3 p-1  w-max  items-end ${props.reverse&&'flex-row-reverse'} `}>
      <div className="w-8 h-8 chat_loader relative overflow-hidden border-t-[1px] border-l-[1px] border-[#6b6b6b]  bg-[rgba(0,0,0,0.2)] rounded-full"></div>
      <div className="chat_loader relative overflow-hidden flex w-32 lg:w-52 border-t-[1px] border-l-[1px] border-[#6b6b6b] gap-2 flex-col  h-14 bg-[rgba(0,0,0,0.2)] p-2  rounded-lg ">
        <div className="relative w-full h-4 overflow-hidden bg-black rounded-md opacity-30 "></div>
        <div className="relative w-20 h-4 overflow-hidden bg-black rounded-md opacity-30 lg:w-40 "></div>
        <div className="relative w-24 h-4 overflow-hidden bg-black rounded-md opacity-30 lg:w-44 "></div>
      </div>
    </div>
  );
};

export default ChatLoader;
