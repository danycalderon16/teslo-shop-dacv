import React, { useContext, useState } from "react";
import { Box, Divider, Drawer, IconButton, Input, InputAdornment, List, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from "@mui/material"
import  AccountCircleOutlined  from "@mui/icons-material/AccountCircleOutlined"
import  AdminPanelSettings  from "@mui/icons-material/AdminPanelSettings"
import  CategoryOutlined  from "@mui/icons-material/CategoryOutlined"
import  ConfirmationNumberOutlined  from "@mui/icons-material/ConfirmationNumberOutlined"
import  DashboardOutlined  from "@mui/icons-material/DashboardOutlined"
import  EscalatorWarningOutlined  from "@mui/icons-material/EscalatorWarningOutlined"
import  FemaleOutlined  from "@mui/icons-material/FemaleOutlined"
import  LoginOutlined  from "@mui/icons-material/LoginOutlined"
import  MaleOutlined  from "@mui/icons-material/MaleOutlined"
import  SearchOutlined  from "@mui/icons-material/SearchOutlined"
import  VpnKeyOutlined from "@mui/icons-material/VpnKeyOutlined"
import { AuthContext, UiContext } from "@/context";
import { useRouter } from "next/router";


export const SideMenu = () => {

  const router = useRouter();
  const { isMenuOpen, toggleSideMenu } = useContext(UiContext);
  const { isLoggedIn, user, logout } = useContext(AuthContext);

  const [searchTerm, setSearchTerm] = useState('');

  const onSearchTerm = () => {
    if (searchTerm.trim().length === 0) return;
    navigateTo(`/search/${searchTerm}`);
  }

  const navigateTo = (url: string) => {
    router.push(url);
    toggleSideMenu();
  }

  return (
    <Drawer
      open={isMenuOpen}
      anchor="right"
      sx={{ backdropFilter: "blur(4px)", transition: "all 0.5s ease-out" }}
      onClose={toggleSideMenu}
    >
      <Box sx={{ width: 250, paddingTop: 5 }}>
        <List>
          <ListItemButton>
            <Input
              autoFocus
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyUp={e => e.key === 'Enter' ? onSearchTerm() : null}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={onSearchTerm}>
                    <SearchOutlined />
                  </IconButton>
                </InputAdornment>
              }
            />
          </ListItemButton>

          {isLoggedIn &&
            (<>
              <ListItemButton>
                <ListItemIcon>
                  <AccountCircleOutlined />
                </ListItemIcon>
                <ListItemText primary={"Perfil"} />
              </ListItemButton>

              <ListItemButton onClick={() => navigateTo('/orders/history')}>
                <ListItemIcon>
                  <ConfirmationNumberOutlined />
                </ListItemIcon>
                <ListItemText primary={"Mis Ordenes"} />
              </ListItemButton>
            </>)
          }
          <ListItemButton sx={{ display: { xs: "", sm: "none" } }}
            onClick={() => navigateTo('/category/men')}>
            <ListItemIcon>
              <MaleOutlined />
            </ListItemIcon>
            <ListItemText primary={"Hombres"} />
          </ListItemButton>

          <ListItemButton sx={{ display: { xs: "", sm: "none" } }}
            onClick={() => navigateTo('/category/women')}>
            <ListItemIcon>
              <FemaleOutlined />
            </ListItemIcon>
            <ListItemText primary={"Mujeres"} />
          </ListItemButton>

          <ListItemButton sx={{ display: { xs: "", sm: "none" } }}
            onClick={() => navigateTo('/category/kid')}>
            <ListItemIcon>
              <EscalatorWarningOutlined />
            </ListItemIcon>
            <ListItemText primary={"Niños"} />
          </ListItemButton>

          {isLoggedIn ?
            <ListItemButton onClick={logout}>
              <ListItemIcon>
                <LoginOutlined />
              </ListItemIcon>
              <ListItemText primary={"Salir"} />
            </ListItemButton>
            :
            <ListItemButton onClick={() => navigateTo(`/auth/login?p=${router.asPath}`)}>
              <ListItemIcon>
                <VpnKeyOutlined />
              </ListItemIcon>
              <ListItemText primary={"Ingresar"} />
            </ListItemButton>
          }

          {
            user?.role === 'admin' &&
            (
              <>
                {/* Admin */}
                <Divider />

                <ListSubheader>Admin Panel</ListSubheader>

                <ListItemButton
                onClick={() => navigateTo('/admin/')}>
                  <ListItemIcon>
                    <DashboardOutlined />
                  </ListItemIcon>
                  <ListItemText primary={"Dashboard"} />
                </ListItemButton>

                <ListItemButton
                  onClick={() => navigateTo('/admin/products')}>
                  <ListItemIcon>
                    <CategoryOutlined />
                  </ListItemIcon>
                  <ListItemText primary={"Productos"} />
                </ListItemButton>

                <ListItemButton
                  onClick={() => navigateTo('/admin/orders')}>
                  <ListItemIcon>
                    <ConfirmationNumberOutlined />
                  </ListItemIcon>
                  <ListItemText primary={"Ordenes"} />
                </ListItemButton>

                <ListItemButton
                  onClick={() => navigateTo('/admin/users')}>
                  <ListItemIcon>
                    <AdminPanelSettings />
                  </ListItemIcon>
                  <ListItemText primary={"Usuarios"} />
                </ListItemButton>
              </>
            )
          }
        </List>
      </Box>
    </Drawer>
  );
};
