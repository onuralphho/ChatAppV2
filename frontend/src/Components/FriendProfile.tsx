import { Iprofile } from "../@types/Iprofile";
import CloseButton from "./UI/CloseButton";
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
      className="z-50 bg-[rgba(255,255,255,0.3)] backdrop-blur-sm border gap-2 border-[#363636] w-auto lg:mx-4 h-max  absolute flex flex-col justify-center items-center  p-10 inset-x-0 m-auto rounded-md text-white "
    >
      <CloseButton onTouch={props.close} color="[#363636]" />
      <img
        src={props.data.picture}
        className="h-auto w-40 rounded-full"
        alt=""
      />
      <h2 className="text-xl ">{props.data.name}</h2>
      <span className="italic">"{props.data.feelings}"</span>
    </motion.div>
  );
};

export default FriendProfile;
