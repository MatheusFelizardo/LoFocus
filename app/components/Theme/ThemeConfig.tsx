import { useThemeStore } from "@/app/stores/useThemeStore";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import React from "react";
import ThemeLibrary from "./ThemeLibrary";
import { ColorLens } from "@mui/icons-material";

const ThemeConfig = () => {
  const { isConfigOpen, setIsConfigOpen } = useThemeStore();

  return (
    <>
      <Dialog open={isConfigOpen} onClose={() => setIsConfigOpen(false)}>
        <DialogTitle>
          <Box className="flex items-center gap-1">
            <ColorLens className="w-8 h-8" />
            <Typography>Theme Configuration</Typography>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Box>
            {/* Add your theme configuration options here */}
            <ThemeLibrary />
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ThemeConfig;
