import { Button } from "@mui/material";
import React, { useState } from "react";

const BuyMeACoffee = () => {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div className={isVisible ? "" : "fixed bottom-4 right-4"}>
      {isVisible ? (
        <a
          href="https://buymeacoffee.com/matheusfelizardo"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none" }}
        >
          <div className="inline-flex items-center bg-yellow-400 text-black px-4 py-2 rounded-lg font-bold ml-6">
            <span className="mr-2 text-xl">☕</span>
            <span className="text-xs">Support me with a Coffee</span>
          </div>
        </a>
      ) : // <a
      //   href="https://buymeacoffee.com/matheusfelizardo"
      //   target="_blank"
      //   rel="noopener noreferrer"
      //   className="inline-flex items-center bg-yellow-400 text-black px-4 py-2 rounded-full w-10 h-10 justify-center font-bold fixed bottom-0 right-0"
      // >
      //   <span className="text-2xl">☕</span>
      // </a>
      null}
      {isVisible && (
        <Button
          size="small"
          onClick={() => setIsVisible(!isVisible)}
          className="text-xs text-gray-400 ml-1 "
        >
          Close
        </Button>
      )}
    </div>
  );
};

export default BuyMeACoffee;
