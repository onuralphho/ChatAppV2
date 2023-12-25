import { useTranslation } from "react-i18next";
import { BsFillPersonFill, BsThreeDots } from "react-icons/bs";
import { MdOutlineDeleteForever } from "react-icons/md";
import { motion } from "framer-motion";
import { scaleEffect } from "../Constants/FramerMotionEffects/scaleEffect";
import { useState } from "react";
type Props = {
  showFriendSettings: boolean;
  openCloseTriger: () => void;
  closeTriger: () => void;
  setData: () => void;
};

const FriendSettingsDropdown = (props: Props) => {
  const { t } = useTranslation();
  const [spesificSetting, setSpesificSetting] = useState<boolean>(false)

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        setSpesificSetting(true)
        props.openCloseTriger();
      }}
      onMouseLeave={() => {
        props.closeTriger();
        setSpesificSetting(false)
      }}
      className="absolute top-1 right-1 rounded-md opacity-50 lg:opacity-0 group-hover:opacity-100 z-20 p-1 hover:bg-[#252525] transition-opacity "
    >
      <BsThreeDots size={20} />
      {props.showFriendSettings && (
        <motion.div
          variants={scaleEffect}
          initial="hidden"
          animate="visible"
          key={Math.random()}
          className={` ${props.showFriendSettings && spesificSetting ? '' :'hidden'} group-hover:flex   absolute p-1  flex-col gap-0.5 backdrop-blur-sm border border-[#252525] bg-[rgba(255,255,255,0.1)]  rounded-md top-7 right-0 text-white`}
        >
          <div
            onClick={props.setData}
            className="hover:bg-[#252525] hover:text-green-500 flex gap-1 items-center  px-2 py-1 rounded-md"
          >
            <BsFillPersonFill />
            {t("profile")}
          </div>
          <div className="hover:bg-[#252525] hover:text-red-500 flex gap-1 items-center px-2 py-1 rounded-md">
            <MdOutlineDeleteForever />
            {t("delete")}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default FriendSettingsDropdown;
