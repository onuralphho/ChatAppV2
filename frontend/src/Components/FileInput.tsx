import { motion } from "framer-motion";
import React from "react";
import { scaleEffect } from "../Constants/FramerMotionEffects/scaleEffect";
import { HiPhoto } from "react-icons/hi2";

type Props = {
    fileInputChangeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
    styleTw:string;
};

const FileInput = (props: Props) => {
  return (
    <motion.div
      variants={scaleEffect}
      initial="hidden"
      animate="visible"
      className={props.styleTw}
    >
      <label
        onClick={(e) => {
          e.stopPropagation();
        }}
        htmlFor="file-upload"
        className=" overflow-hidden cursor-pointer "
      >
        <HiPhoto size={30} className="" />
        <input
          id="file-upload"
          type="file"
          size={2}
          className="hidden opacity-0"
          accept="image/png, image/webp, image/*"
          onChange={props.fileInputChangeHandler}
        />
      </label>
    </motion.div>
  );
};

export default FileInput;
