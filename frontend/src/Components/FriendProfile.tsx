import { Iprofile } from "../@types/Iprofile";
import CloseButton from "./UI/GeneralUI/CloseButton";
import { motion } from "framer-motion";
import { scaleEffect } from "../Constants/FramerMotionEffects/scaleEffect";
type Props = {
  data: Iprofile;
  close: () => void;
};

const FriendProfile = (props: Props) => {
  return (
    <motion.div
      variants={scaleEffect}
      initial="hidden"
      animate="visible"
      className="z-50 bg-[rgba(255,255,255,0.35)] gap-4 overflow-hidden backdrop-blur-sm border pb-4  border-purple-500 w-auto lg:mx-4 h-auto absolute flex flex-col justify-center items-center inset-x-0 m-auto rounded-md text-white "
    >
      <CloseButton onTouch={props.close} color="[#363636]" />
      <img src={props.data.picture} className="h-auto w-full bg-white" alt="" />
      <div className="flex gap-3 ">
        <h2 className="text-xl ">{props.data.name}</h2>
        {props.data.feelings && (
          <div className="relative ">
            <span className="italic text-sm h-auto bg-white text-[#252525] px-2 py-2 rounded ">
              {props.data.feelings}
            </span>
            <div className="absolute w-5 aspect-square  -z-[1] bg-white  rotate-45 top-0 -left-1"></div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default FriendProfile;
