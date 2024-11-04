import { MoonOutlined, SunOutlined } from "@ant-design/icons";
import { Dropdown, MenuProps, Switch } from "antd";
import { useContext } from "react";
import { BiLogOut } from "react-icons/bi";
import { FaUserAstronaut } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { ThemeContext } from "../../config/context/ThemeContext";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../store/slice/userSlice";

const AppHeader = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
  };
  const items: MenuProps["items"] = [
    {
      label: <p>User name</p>,
      key: "0",
      className: "!cursor-default",
    },
    {
      type: "divider",
    },
    {
      label: (
        <Link onClick={handleLogout} to={"/"} className="!text-red-500">
          Logout
        </Link>
      ),
      key: "3",
      icon: <BiLogOut className="!text-red-500" size={20} />,
    },
  ];

  return (
    <div className="flex h-full justify-end items-center gap-5">
      <Dropdown
        menu={{ items }}
        trigger={["click"]}
        arrow
        placement="bottom"
        overlayStyle={{ width: 200 }}
      >
        <div className="flex cursor-pointer gap-2">
          <FaUserAstronaut size={20} className="!h-fit dark:!text-white" />
          <IoIosArrowDown size={20} className="!h-fit dark:!text-white" />
        </div>
      </Dropdown>
      <Switch
        size="default"
        onChange={toggleTheme}
        checkedChildren={<MoonOutlined />}
        unCheckedChildren={<SunOutlined />}
        defaultChecked={isDarkMode}
        className="w-12"
      />
    </div>
  );
};

export default AppHeader;
