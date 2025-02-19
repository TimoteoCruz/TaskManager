import React from "react";
import { Layout, Menu } from "antd";
import { DashboardOutlined, UserOutlined, SettingOutlined } from "@ant-design/icons";
import { Outlet } from "react-router-dom";

const { Header, Sider, Content } = Layout;

const MainLayout = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider theme="dark" collapsible>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={[
            { key: "1", icon: <DashboardOutlined />, label: "Dashboard" },
            { key: "2", icon: <UserOutlined />, label: "Perfil" },
            { key: "3", icon: <SettingOutlined />, label: "Configuración" },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ background: "#fff", padding: 0, textAlign: "center" }}>
          <h2>Task Manager</h2>
        </Header>
        <Content style={{ margin: "16px", padding: "24px", background: "#fff" }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
export default MainLayout;
