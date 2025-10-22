import { ColorLens } from "@mui/icons-material";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useThemeStore } from "@/app/stores/useThemeStore";
import ThemeLibrary from "./ThemeLibrary";

const ThemeConfig = () => {
  const { isConfigOpen, setIsConfigOpen } = useThemeStore();

  return (
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
  );
};

export default ThemeConfig;
