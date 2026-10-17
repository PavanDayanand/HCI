import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import DynamicFormOutlinedIcon from "@mui/icons-material/DynamicFormOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
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
  SvgIcon,
  Typography,
} from "@mui/material";
import { useState } from "react";
import type { MouseEvent, ReactNode } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
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
      ? [
          { label: "Form Builder", to: "/admin/forms", icon: <DynamicFormOutlinedIcon fontSize="small" /> },
          { label: "Analytics", to: "/admin/analytics", icon: <BarChartOutlinedIcon fontSize="small" /> },
        ]
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
        <Box sx={{ minWidth: 0, px: collapsed ? 0 : 1.25, py: 0.5, textAlign: collapsed ? "center" : "left" }}>
          <Typography sx={{ fontSize: collapsed ? 18 : 24, fontWeight: 700, letterSpacing: "-0.055em", lineHeight: 1.15 }}>
            HCI
          </Typography>
          {!collapsed ? (
            <Typography sx={{ fontSize: 11, color: "text.secondary", mt: 0.5, lineHeight: 1.3 }}>
              Hutt City Intelligence
            </Typography>
          ) : null}
        </Box>
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
                  borderRadius: "9px",
                  border: 1,
                  borderColor: selected ? "divider" : "transparent",
                  mb: 0.5,
                  minHeight: 42,
                  justifyContent: collapsed ? "center" : "flex-start",
                  px: collapsed ? 0.75 : 1.25,
                  width: "100%",
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: collapsed ? 0 : 28,
                    color: selected ? "primary.main" : "text.secondary",
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
          aria-label={`Switch workspace role, current role: ${role}`}
          aria-haspopup="menu"
          onClick={(event: MouseEvent<HTMLElement>) => setRoleMenuEl(event.currentTarget)}
          sx={{
            borderRadius: 2,
            minHeight: 48,
            px: 1,
            minWidth: 0,
            justifyContent: collapsed ? "center" : "flex-start",
            flex: collapsed ? "none" : 1,
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
          position: "sticky",
          top: 0,
          height: "100dvh",
          overflow: "hidden",
          transition: "width 0.2s ease",
        }}
      >
        {sidebar}
      </Box>

      <Box sx={{ flex: 1, minWidth: 0, minHeight: "100dvh", display: "flex", flexDirection: "column", p: { xs: 1, md: 1.5 }, pt: { xs: 0, md: 0 }, pl: { md: 0 } }}>
          <Box
            component="header"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              minHeight: 64,
              flexShrink: 0,
              px: { xs: 1, md: 2 },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box sx={{ display: { xs: "none", md: "block" } }}>
                <Tooltip title={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
                  <IconButton
                    aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                    aria-expanded={!collapsed}
                    onClick={() => setCollapsed((current) => !current)}
                    sx={{ border: 1, borderColor: "divider", borderRadius: "9px", width: 36, height: 36 }}
                  >
                    <SidebarIcon expanded={!collapsed} />
                  </IconButton>
                </Tooltip>
              </Box>
              <IconButton
                onClick={() => {
                  setCollapsed(false);
                  setMobileOpen(true);
                }}
                aria-label="Open navigation"
                aria-expanded={mobileOpen}
                sx={{ display: { md: "none" }, border: 1, borderColor: "divider", borderRadius: "9px", width: 36, height: 36 }}
              >
                <SidebarIcon expanded={false} />
              </IconButton>
            </Box>
            <Tooltip title={mode === "light" ? "Dark mode" : "Light mode"}>
              <IconButton onClick={toggleMode} aria-label="Toggle color mode" size="small" sx={{ width: 36, height: 36 }}>
                {mode === "light" ? <DarkModeOutlinedIcon sx={{ fontSize: 19 }} /> : <LightModeOutlinedIcon sx={{ fontSize: 19 }} />}
              </IconButton>
            </Tooltip>
          </Box>
        <Box
          component="main"
          sx={{
            flex: 1,
            minWidth: 0,
            bgcolor: "background.paper",
            border: 1,
            borderColor: "divider",
            borderRadius: "18px",
            px: { xs: 2, md: 4 },
            py: { xs: 3, md: 3.5 },
          }}
        >
          <Outlet />
        </Box>
      </Box>
      {roleMenu}
    </Box>
  );
}

// The panel outline stays consistent; the arrow shows the next action.
function SidebarIcon({ expanded }: { expanded: boolean }) {
  return (
    <SvgIcon sx={{ fontSize: 20 }} viewBox="0 0 24 24">
      <rect x="3" y="4" width="18" height="16" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 4v16" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path
        d={expanded ? "m16 9-3 3 3 3" : "m14 9 3 3-3 3"}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  );
}
