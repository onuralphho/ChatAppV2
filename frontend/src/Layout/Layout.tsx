import React from "react";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <main className=" max-w-[1920px] mx-auto h-[100vh] h-[100dvh] overflow-hidden   ">
      {children}
    </main>
  );
};

export default Layout;
