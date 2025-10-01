import * as React from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import ConfigModal from "./ConfigModal";
import { usePomodoroStore } from "../stores/usePomodoro";
import { ColorLens, History } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import ThemeConfig from "./Theme/ThemeConfig";
import { useThemeStore } from "../stores/useThemeStore";

const CustomAvatar = () => {
  const { data: session } = useSession();
  if (session?.user?.image) {
    return (
      <Image
        src={session.user.image}
        alt="User Avatar"
        width={32}
        height={32}
        className="rounded-full"
      />
    );
  }
  if (session?.user?.name) {
    return session.user.name.charAt(0).toUpperCase();
  }
  return "U";
};

export default function AccountMenu() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { isLoading } = usePomodoroStore();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const { setIsConfigOpen } = useThemeStore();
  const [showConfig, setShowConfig] = React.useState(false);

  return (
    <React.Fragment>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <CustomAvatar />
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {/* <MenuItem onClick={handleClose}>
          <Avatar /> My account
        </MenuItem>
        <Divider /> */}

        <MenuItem
          onClick={() => {
            setIsConfigOpen(true);
          }}
        >
          <ListItemIcon>
            <ColorLens fontSize="small" />
          </ListItemIcon>
          Themes
        </MenuItem>

        <MenuItem
          onClick={() => {
            router.push("/dashboard");
          }}
        >
          <ListItemIcon>
            <History fontSize="small" />
          </ListItemIcon>
          Activity
        </MenuItem>

        <MenuItem
          onClick={() => {
            setShowConfig(true);
            handleClose();
          }}
        >
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={() => signOut({ callbackUrl: "/auth/signin" })}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      {!isLoading && (
        <ConfigModal showConfig={showConfig} setShowConfig={setShowConfig} />
      )}

      <ThemeConfig />
    </React.Fragment>
  );
}
