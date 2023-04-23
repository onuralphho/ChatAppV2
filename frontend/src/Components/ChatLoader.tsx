const ChatLoader = (props:any) => {
  return (
    <div className={` flex max-md:pr-2  rounded-lg gap-3 p-1  w-max  items-end ${props.reverse&&'flex-row-reverse'} `}>
      <div className="w-8 h-8 chat_loader relative overflow-hidden border-t-[1px] border-l-[1px] border-[#6b6b6b]  bg-[rgba(0,0,0,0.2)] rounded-full"></div>
      <div className="chat_loader relative overflow-hidden flex w-32 lg:w-52 border-t-[1px] border-l-[1px] border-[#6b6b6b] gap-2 flex-col  h-14 bg-[rgba(0,0,0,0.2)] p-2  rounded-lg ">
        <div className="relative overflow-hidden bg-black opacity-30 w-full rounded-md h-4 "></div>
        <div className="relative overflow-hidden bg-black opacity-30 w-20 lg:w-40 rounded-md h-4 "></div>
        <div className="relative overflow-hidden bg-black opacity-30 w-24 lg:w-44 rounded-md h-4 "></div>
      </div>
    </div>
  );
};

export default ChatLoader;
