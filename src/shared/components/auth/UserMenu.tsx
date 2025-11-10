"use client";

import { useAuth } from "shared/hooks/useAuth";
import { Dropdown, Avatar } from "antd";
import { UserOutlined, LogoutOutlined, SettingOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import Link from "next/link";
import { Routers } from "../router";

export function UserMenu() {
  const { user, signOut, isAuthenticated } = useAuth();
  
  if (!isAuthenticated || !user) {
    return null;
  }
  
  const items: MenuProps["items"] = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: (
        <Link href="/profile">
          <div className="px-2 py-1">
            <div className="font-medium">{user.name}</div>
            <div className="text-xs text-gray-500">{user.email}</div>
          </div>
        </Link>
      ),
    },
    {
      type: "divider",
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: <Link href="/settings">Cài đặt</Link>,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      danger: true,
      onClick: () => signOut(Routers.LOGIN),
    },
  ];
  
  return (
    <Dropdown menu={{ items }} placement="bottomRight" arrow>
      <div className="cursor-pointer flex items-center gap-2 hover:opacity-80 transition-opacity">
        <Avatar 
          src={user.image} 
          icon={<UserOutlined />}
          size="default"
        />
        <span className="hidden md:inline text-sm font-medium">
          {user.name}
        </span>
      </div>
    </Dropdown>
  );
}

