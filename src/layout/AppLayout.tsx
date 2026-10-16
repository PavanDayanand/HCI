import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import DynamicFormOutlinedIcon from "@mui/icons-material/DynamicFormOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import type { MouseEvent, ReactNode } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import hciLogo from "../assets/hci-logo.png";
import hciMark from "../assets/hci-mark.png";
import type { AppRole } from "../role/roleContext.ts";
import { useRole } from "../role/useRole.ts";
import { useColorMode } from "../theme/useColorMode.ts";

const openWidth = 248;
const closedWidth = 76;

type NavItem = {
  label: string;
  to: string;
  icon: ReactNode;
};

export function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { mode, toggleMode } = useColorMode();
  const { role, setRole } = useRole();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [roleMenuEl, setRoleMenuEl] = useState<HTMLElement | null>(null);

  const sidebarWidth = collapsed ? closedWidth : openWidth;

  const navItems: NavItem[] =
    role === "admin"
      ? [{ label: "Form Builder", to: "/admin/forms", icon: <DynamicFormOutlinedIcon fontSize="small" /> }]
      : [{ label: "Forms", to: "/forms", icon: <AssignmentOutlinedIcon fontSize="small" /> }];

  function closeMobileNav() {
    setMobileOpen(false);
  }

  function changeRole(nextRole: AppRole) {
    setRole(nextRole);
    setRoleMenuEl(null);
    navigate(nextRole === "admin" ? "/admin/forms" : "/forms");
    closeMobileNav();
  }

  function isSelected(path: string) {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  }

  const roleMenu = (
    <Menu
      anchorEl={roleMenuEl}
      open={Boolean(roleMenuEl)}
      onClose={() => setRoleMenuEl(null)}
      anchorOrigin={{ vertical: "top", horizontal: "left" }}
      transformOrigin={{ vertical: "bottom", horizontal: "left" }}
    >
      <MenuItem selected={role === "admin"} onClick={() => changeRole("admin")}>
        <ListItemIcon>
          <AdminPanelSettingsOutlinedIcon fontSize="small" />
        </ListItemIcon>
        Admin
      </MenuItem>
      <MenuItem selected={role === "user"} onClick={() => changeRole("user")}>
        <ListItemIcon>
          <PersonOutlinedIcon fontSize="small" />
        </ListItemIcon>
        User
      </MenuItem>
    </Menu>
  );

  const sidebar = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", px: collapsed ? 1 : 1.5, py: 1.5 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: collapsed ? "column" : "row",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          gap: 0.5,
          mb: 2.5,
          flexShrink: 0,
        }}
      >
        <IconButton onClick={() => setMobileOpen(true)} sx={{ display: { md: "none" } }} aria-label="Open navigation">
          <MenuIcon />
        </IconButton>
        <Box
          component="img"
          src={collapsed ? hciMark : hciLogo}
          alt="HCI Hutt City Intelligence"
          sx={{
            height: collapsed ? 32 : 44,
            width: "auto",
            maxWidth: collapsed ? 44 : 180,
            objectFit: "contain",
            display: "block",
            flexShrink: 0,
            bgcolor: "#fff",
            borderRadius: 1,
            p: 0.25,
            boxSizing: "content-box",
          }}
        />
        <Tooltip title={collapsed ? "Open sidebar" : "Collapse sidebar"}>
          <IconButton
            size="small"
            onClick={() => setCollapsed((open) => !open)}
            aria-label={collapsed ? "Open sidebar" : "Collapse sidebar"}
            sx={{ display: { xs: "none", md: "inline-flex" }, flexShrink: 0 }}
          >
            {collapsed ? <ChevronRightIcon fontSize="small" /> : <ChevronLeftIcon fontSize="small" />}
          </IconButton>
        </Tooltip>
      </Box>

      {!collapsed ? (
        <Typography
          variant="caption"
          sx={{ px: 1.25, mb: 0.75, color: "text.secondary", fontWeight: 600, letterSpacing: "0.06em" }}
        >
          WORKSPACE
        </Typography>
      ) : null}

      <List sx={{ p: 0, flex: 1 }}>
        {navItems.map((item) => {
          const selected = isSelected(item.to);
          return (
            <Tooltip key={item.to} title={collapsed ? item.label : ""} placement="right">
              <ListItemButton
                selected={selected}
                onClick={() => {
                  navigate(item.to);
                  closeMobileNav();
                }}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  minHeight: 36,
                  justifyContent: collapsed ? "center" : "flex-start",
                  px: collapsed ? 0.75 : 1.25,
                  width: "100%",
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: collapsed ? 0 : 28,
                    color: selected ? "text.primary" : "text.secondary",
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {!collapsed ? (
                  <ListItemText primary={item.label} slotProps={{ primary: { sx: { fontSize: 13.5, fontWeight: 500 } } }} />
                ) : null}
              </ListItemButton>
            </Tooltip>
          );
        })}
      </List>

      <Divider sx={{ mb: 1 }} />

      <Box
        sx={{
          display: "flex",
          flexDirection: collapsed ? "column" : "row",
          alignItems: "center",
          gap: 0.25,
        }}
      >
        <ListItemButton
          onClick={(event: MouseEvent<HTMLElement>) => setRoleMenuEl(event.currentTarget)}
          sx={{
            borderRadius: 2,
            minHeight: 48,
            px: collapsed ? 1 : 1,
            justifyContent: collapsed ? "center" : "flex-start",
            flex: 1,
          }}
        >
          <ListItemIcon sx={{ minWidth: collapsed ? 0 : 36, color: "text.secondary", justifyContent: "center" }}>
            {role === "admin" ? <AdminPanelSettingsOutlinedIcon /> : <PersonOutlinedIcon />}
          </ListItemIcon>
          {!collapsed ? (
            <>
              <ListItemText
                primary={role === "admin" ? "Admin" : "User"}
                secondary="Workspace role"
                slotProps={{
                  primary: { sx: { fontSize: 13.5, fontWeight: 600 } },
                  secondary: { sx: { fontSize: 12 } },
                }}
              />
              <KeyboardArrowDownIcon fontSize="small" sx={{ color: "text.secondary" }} />
            </>
          ) : null}
        </ListItemButton>
        <Tooltip title={mode === "light" ? "Dark mode" : "Light mode"}>
          <IconButton onClick={toggleMode} aria-label="Toggle color mode" size="small">
            {mode === "light" ? <DarkModeOutlinedIcon fontSize="small" /> : <LightModeOutlinedIcon fontSize="small" />}
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", bgcolor: "background.default" }}>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={closeMobileNav}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { width: openWidth, boxSizing: "border-box", border: 0 },
        }}
      >
        {sidebar}
      </Drawer>

      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          width: sidebarWidth,
          flexShrink: 0,
          flexDirection: "column",
          bgcolor: "background.paper",
          borderRight: 1,
          borderColor: "divider",
          overflow: "hidden",
          transition: "width 0.2s ease",
        }}
      >
        {sidebar}
      </Box>

      <Box component="main" sx={{ flex: 1, minWidth: 0, px: { xs: 2.5, md: 4 }, py: { xs: 2.5, md: 3.5 } }}>
        <Box sx={{ display: { md: "none" }, mb: 2 }}>
          <IconButton onClick={() => setMobileOpen(true)} aria-label="Open navigation">
            <MenuIcon />
          </IconButton>
        </Box>
        <Outlet />
      </Box>
      {roleMenu}
    </Box>
  );
}
