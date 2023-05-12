import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MdLanguage } from "react-icons/md";
import TrFlag from "../../../Assets/tr.svg";
import EngFlag from "../../../Assets/gb.svg";
const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [languageSelectorShow, setLanguageSelector] = useState<boolean>(false);
  return (
    <div
      onMouseEnter={() => {
        setLanguageSelector(true);
      }}
      onMouseLeave={() => {
        setLanguageSelector(false);
      }}
      className="flex relative w-max z-20  justify-center hover:bg-[#252525]  rounded-md rounded-t-none px-3 p-1 cursor-pointer"
    >
      {languageSelectorShow && (
        <div className="absolute  flex flex-col  left-0 -top-[4.5rem] p-1 w-full bg-[#252525] text-center rounded-t-md ">
          <span
            onClick={() => {
              i18n.changeLanguage("tr");
            }}
            className="flex gap-2 justify-center  hover:bg-[#e30a17] p-1 rounded-t-sm"
          >
            <img src={TrFlag} className="w-5 rounded" alt="Turkey flag" />
            <span>Türkçe</span>
          </span>
          <span
            onClick={() => {
              i18n.changeLanguage("en");
            }}
            className="flex gap-2 justify-center  hover:bg-[#012169] p-1"
          >
            <img
              src={EngFlag}
              className="w-5 rounded"
              alt="Great britain flag"
            />
            <span>English</span>
          </span>
        </div>
      )}
      <span className="flex gap-2 items-center justify-center ">
        <MdLanguage size={30} className="" />
        {i18n.language === "tr"
          ? "Türkçe"
          : i18n.language === "en" || i18n.language === "en-US"
          ? "English"
          : "English"}
      </span>
    </div>
  );
};

export default LanguageSelector;
