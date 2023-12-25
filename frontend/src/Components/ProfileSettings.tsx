import { HiArrowUturnLeft } from "react-icons/hi2";
import { useAuth } from "../Context/AuthProvider";
import React, { useEffect, useRef, useState } from "react";
import { Fetcher } from "../utils/Fetcher";
import { useAlertContext } from "../Context/AlertProvider";
import { AVATAR_DATA } from "../Constants/avatarData";
import { useTranslation } from "react-i18next";
import LanguageSelector from "./UI/GeneralUI/LanguageSelector";
import PasswordChangeForm from "./UI/ProfileUI/PasswordChangeForm";
import FileInput from "./UI/GeneralUI/FileInput";
import { S3MediaSender } from "../utils/S3MediaSender";

interface IProfileProps {
    closeProfile: Function;
    openWelcome: Function;
}

const ProfileSettings = (props: IProfileProps) => {
    const { t } = useTranslation();

    const ctx = useAuth();
    const alertCtx = useAlertContext();

    const [nameInput, setNameInput] = useState<string | undefined>(
        ctx?.user?.name
    );
    const [emailInput, setEmailInput] = useState<string | undefined>(
        ctx?.user?.email
    );
    const [pictureInput, setPictureInput] = useState<string | undefined>(
        ctx?.user?.picture
    );
    const [dropdownShown, setDropdownShown] = useState<boolean>(false);
    const [showPasswordChange, setShowPasswordChange] =
        useState<boolean>(false);

    const [fileInput, setFileInput] = useState<File | undefined>(undefined);
    const [previewImage, setPreviewImage] = useState<string | undefined>(
        undefined
    );

    const dropDownRef = useRef<HTMLButtonElement>(null);

    const closePasswordChange = () => {
        setShowPasswordChange(false);
    };

    const nameChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNameInput(e.target.value);
    };

    const fileInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = () => {
                setFileInput(file);
                setPreviewImage(reader.result as string);
            };

            reader.readAsDataURL(file);
        }
    };

    const submitFormHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const jwt = ctx?.getCookie("jwt");

        var awsS3ImgUrl;

        if (fileInput) {
            awsS3ImgUrl = await S3MediaSender(fileInput);
        }

        const res = await Fetcher({
            body: {
                Id: ctx?.user && ctx.user.id,
                Name: nameInput?.toLowerCase(),
                Email: emailInput,
                Picture: awsS3ImgUrl ? awsS3ImgUrl : pictureInput,
            },
            method: "PUT",
            url: "/api/users/update",
            token: jwt,
        });
        const data = await res.json();
        if (data.status !== 400) {
            ctx?.setUser((prev) => {
                if (prev) {
                    return {
                        ...prev,
                        name: data.sessionUser.name,
                        picture: data.sessionUser.picture,
                        updateTime: data.sessionUser.updateTime,
                    };
                }
                return prev;
            });
        }

        alertCtx?.alertStarter(data.detail);
    };

    useEffect(() => {
        let clickOutSideHandler = (e: MouseEvent) => {
            if (!dropDownRef.current?.contains(e.target as Node)) {
                setDropdownShown(false);
            }
        };

        document.addEventListener("mousedown", clickOutSideHandler);
        return () => {
            document.removeEventListener("mousedown", clickOutSideHandler);
        };
    }, []);

    return (
        <>
            <div className="bg-[#363636] flex-1 overflow-hidden h-full fade-in">
                <div className="pt-12 flex p-4 flex-col h-full relative">
                    <div className="w-[500px] rounded-full aspect-square absolute bg-green-600 lg:-right-40 lg:-bottom-60 -bottom-32 -right-60"></div>
                    <div className="w-[500px] rounded-full aspect-square absolute bg-purple-600 -left-60 -top-60  "></div>
                    <div className="absolute bottom-2 right-2">
                        <LanguageSelector />
                    </div>
                    <div className="flex p-2  items-center">
                        <button
                            className="bg-green-500 px-2 rounded-md absolute bottom-2 lg:hidden "
                            onClick={() => {
                                props.closeProfile();
                                props.openWelcome();
                            }}>
                            <HiArrowUturnLeft size={35} className="" />
                        </button>
                    </div>

                    <form
                        onSubmit={submitFormHandler}
                        className="sm:w-max bg-[#2525252a] backdrop-blur-lg border border-neutral-600 rounded-md p-2 ">
                        <div className="flex max-lg:flex-col  gap-4  h-full ">
                            <div className="flex flex-col items-center  gap-2 ">
                                <img
                                    src={
                                        previewImage
                                            ? previewImage
                                            : pictureInput
                                    }
                                    className="rounded-full w-40 aspect-square  flex-1 object-cover "
                                    alt=""
                                />

                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setDropdownShown((prev) => !prev);
                                        }}
                                        className="relative z-10 cursor-pointer  select-none shadow px-6  bg-[#252525] hover:bg-[#292929] text-white text-sm font-medium rounded-md p-2.5"
                                        ref={dropDownRef}>
                                        <span>{t("select_avatar")}</span>
                                        <div
                                            className={`${
                                                !dropdownShown
                                                    ? "h-0 border-0 p-0 "
                                                    : "h-56 p-1"
                                            } bg-[#252525]  transition-all flex flex-col gap-1 overflow-hidden absolute left-0 top-11 w-full rounded-md `}>
                                            {AVATAR_DATA.map((item, index) => (
                                                <div
                                                    key={index}
                                                    onClick={() => {
                                                        setPictureInput(
                                                            item.url
                                                        );
                                                    }}
                                                    className=" hover:bg-[#363636] rounded-md p-1 flex items-center gap-2 bg-[#252525]">
                                                    <img
                                                        src={item.url}
                                                        alt=""
                                                        className="h-8"
                                                    />
                                                    <span>{item.title}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </button>
                                    <FileInput
                                        fileInputChangeHandler={
                                            fileInputChangeHandler
                                        }
                                        styleTw="bg-[#252525] h-full flex items-center px-2 rounded-md text-green-500 hover:bg-[#292929] "
                                    />
                                </div>
                            </div>
                            <div className="flex lg:flex-col gap-2 justify-between">
                                <div className="flex flex-col">
                                    <input
                                        className="bg-transparent text-2xl outline-green-500 max-w-[150px]  border rounded-md border-neutral-600 px-1"
                                        value={nameInput}
                                        onChange={nameChangeHandler}
                                    />
                                    <span className=" italic opacity-60">
                                        {"( "}
                                        {ctx?.user && ctx.user.email}
                                        {" )"}
                                    </span>
                                    <span
                                        onClick={() => {
                                            setShowPasswordChange(true);
                                        }}
                                        className="underline opacity-80 text-green-400 hover:text-green-300 cursor-pointer">
                                        {t("change_password")}
                                    </span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <button
                                        type="submit"
                                        className="bg-green-500 w-max px-2 text-lg rounded-md">
                                        {t("submit")}
                                    </button>
                                    <span className="italic opacity-60 text-xs ">
                                        {t("last_update") + ": ( "}
                                        {
                                            ctx?.user?.updateTime
                                                .toString()
                                                .split("T")[1]
                                                .split(".")[0]
                                                .split(":")[0]
                                        }
                                        {":"}
                                        {
                                            ctx?.user?.updateTime
                                                .toString()
                                                .split("T")[1]
                                                .split(".")[0]
                                                .split(":")[1]
                                        }
                                        {"  "}
                                        {
                                            ctx?.user?.updateTime
                                                .toString()
                                                .split("T")[0]
                                        }
                                        {" )"}
                                    </span>
                                </div>
                            </div>
                            {showPasswordChange ? (
                                <PasswordChangeForm
                                    closePasswordChange={closePasswordChange}
                                />
                            ) : (
                                ""
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ProfileSettings;
