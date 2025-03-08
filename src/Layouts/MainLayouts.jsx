import React from "react";
import { Layout, Menu, Button } from "antd";
import { DashboardOutlined, UserOutlined, PoweroffOutlined, UserAddOutlined } from "@ant-design/icons";
import { Outlet, useNavigate } from "react-router-dom";

const { Header, Sider, Content } = Layout;

const MainLayout = () => {
  const navigate = useNavigate(); 

  const handleLogout = () => {
    // Borra todo el localStorage
    localStorage.clear();
    
    // Redirige al login
    navigate("/login");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider theme="dark" collapsible>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          onClick={({ key }) => {
            if (key === "1") navigate("/dashboard");
            if (key === "2") navigate("/dashboard/groups"); 
            if (key === "3") navigate("/dashboard/users"); 

          }}
          items={[
            { key: "1", icon: <DashboardOutlined />, label: "Dashboard" },
            { key: "2", icon: <UserOutlined />, label: "Groups" }, 
            { key: "3", icon: <UserAddOutlined />, label: "users" }, 

          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ background: "#fff", padding: 0, textAlign: "center", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0 }}>Task Manager</h2>
          <Button 
            type="primary" 
            icon={<PoweroffOutlined />} 
            onClick={handleLogout} 
            style={{ marginRight: "20px" }}
          >
            Cerrar sesión
          </Button>
        </Header>
        <Content style={{ margin: "16px", padding: "24px", background: "#fff" }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
