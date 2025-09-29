import { Box, Typography } from "@mui/material";
import React from "react";

const BuyMeACoffee = () => {
  return (
    <Box className="flex justify-between items-center w-full">
      <Box className="text-xs">
        <span>Powered by </span>
        <a
          href="https://www.linkedin.com/in/matheus-felizardo/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Matheus Felizardo
        </a>
      </Box>
      <Box className="flex items-center ">
        <Typography variant="h6" color="white" gutterBottom className="text-xs">
          <span>Enjoying the app? </span>
          <a
            href="https://buymeacoffee.com/matheusfelizardo"
            target="_blank"
            rel="noopener noreferrer"
            className=" text-yellow-500 rounded-lg font-bold"
          >
            <span className="text-xs hover:underline">
              Support me with a Coffee
            </span>{" "}
            ☕
          </a>
        </Typography>
      </Box>
    </Box>
  );
};

export default BuyMeACoffee;
