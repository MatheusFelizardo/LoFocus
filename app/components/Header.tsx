import Image from "next/image";
import Link from "next/link";
import React from "react";
import TaskRegister from "./TaskRegister";
import AccountMenu from "./AccountMenu";

type HeaderProps = {
  middleContent?: React.ReactNode;
};

const Header = ({ middleContent }: HeaderProps) => {
  return (
    <header className="flex items-center justify-between p-4 w-full gap-2">
      <div>
        <Link href="/">
          <Image
            src="/logo.svg"
            alt="LoFocus logo"
            width={150}
            height={50}
            className="w-[120px]"
            arial-label="LoFocus Logo"
          />
        </Link>
      </div>
      {middleContent && (
        <div className="flex-1 flex items-center justify-center">
          {middleContent}
        </div>
      )}

      <AccountMenu />
    </header>
  );
};

export default Header;
