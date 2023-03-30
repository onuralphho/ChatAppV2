import React from "react";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div>
      <main className="container mx-auto   ">{children}</main>
    </div>
  );
};

export default Layout;
