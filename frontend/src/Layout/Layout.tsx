import React from "react";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div
      className=" mx-auto h-[100vh]  bg-[#f8f8f8]  overflow-hidden   "
      style={{ height: "100dvh" }}
    >
      {children}
    </div>
  );
};

export default Layout;
