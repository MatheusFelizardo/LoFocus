import { Backdrop, Box, CircularProgress } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const BackdropLoading = () => {
  return (
    <div className=" flex items-center justify-center p-4">
      <Box className="absolute top-0 left-0 px-4 py-5">
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
      </Box>
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={true}
        onClick={() => {
          return false;
        }}
      >
        <CircularProgress size="30px" color="inherit" />
      </Backdrop>
    </div>
  );
};

export default BackdropLoading;
