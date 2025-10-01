"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography, Drawer, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const BuyMeACoffee = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("buyMeACoffeeDismissed");
    if (!dismissed) {
      setOpen(true);
      const timer = setTimeout(() => {
        handleClose();
      }, 20000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setOpen(false);
    sessionStorage.setItem("buyMeACoffeeDismissed", "true");
  };

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={handleClose}
      slotProps={{
        paper: {
          sx: {
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            backgroundColor: "#1e1e1e",
            padding: 3,
            textAlign: "center",
          },
        },
      }}
    >
      <IconButton
        size="small"
        onClick={handleClose}
        sx={{ color: "white", position: "absolute", top: 8, right: 8 }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>

      <Typography variant="body2" sx={{ color: "white", mb: 1 }}>
        <span className="font-bold">LoFocus</span> is powered by{" "}
        <a
          href="https://www.linkedin.com/in/matheus-felizardo/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline"
        >
          Matheus Felizardo
        </a>
      </Typography>

      <Typography variant="body2" sx={{ color: "white", mb: 2 }}>
        To support development and future updates, consider{" "}
        <a
          href="https://buymeacoffee.com/matheusfelizardo"
          target="_blank"
          rel="noopener noreferrer"
          className="text-yellow-400 font-bold hover:underline"
        >
          buying a coffee ☕
        </a>
      </Typography>

      <Typography variant="caption" sx={{ color: "gray" }}>
        Or drop suggestions at{" "}
        <a
          href="mailto:matheus.felizardo2@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:underline"
        >
          matheus.felizardo2@gmail.com
        </a>
      </Typography>
    </Drawer>
  );
};

export default BuyMeACoffee;
