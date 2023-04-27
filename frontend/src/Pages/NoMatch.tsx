import { useState } from "react";
import { useNavigate } from "react-router-dom";
const NoMatch = () => {
  const [lights,setLights]= useState(false)
  const navigate = useNavigate()

  return <div className="relative w-full h-full flex justify-center items-center bg-black overflow-hidden">
    <div className={`${lights ?'w-[700px] ' :'w-52 animate-pulse '} transition-all aspect-square absolute margin-auto bg-white rounded-full z-0 blur-3xl  `}></div>
    <div className="flex flex-col items-center gap-8 text-white z-10 mix-blend-difference">
      <span className="text-6xl lg:text-8xl ">404</span>
      <span className="text-lg lg:text-3xl text-center">Oops! You went to dark side</span>
      <button onMouseOut={() => {
        setLights(false)
      }} onMouseOver={() => {
        setLights(true)
      }} onClick={() => {
        navigate('/chats')
      }} onTouchStart={() => {
        setLights(true)
      }} onTouchEnd={() => {
        setLights(false)
      }} className="text-lg select-none border-2 p-2 px-4 rounded-md font-bold">Lights On</button>
    </div>

  </div>;
};

export default NoMatch;
