import React from "react";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div>
      <main className=" max-w-[1920px] mx-auto h-[100svh] h-[100vh] overflow-hidden   ">{children}</main>
    </div>
  );
};

export default Layout;
