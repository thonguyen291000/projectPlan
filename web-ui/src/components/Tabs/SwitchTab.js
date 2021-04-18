import React, { useEffect, useState } from "react";
//Components
import ChatTab from "./ChatTab/ChatTab";
import ProfileTab from "./ProfileTab/ProfileTab";
import SettingsTab from "./SettingsTab/SettingsTab";
//Redux
import { useSelector } from "react-redux";
//Const
import { tabs } from "../../const/tabs";

const SwitchTab = ({openChatContent}) => {
  const [tab, setTab] = useState("");
  const tabFromRedux = useSelector((state) => state.data.tab);

  //Switch tab
  useEffect(() => {
    setTab(tabFromRedux);
  }, [tabFromRedux]);

  switch (tab) {
    case tabs[0].name:
      return <ProfileTab/>
    case tabs[1].name:
      return <ChatTab openChatContent={openChatContent}/>
    case tabs[2].name:
      return <SettingsTab/>
    default:
      return <></>
  }
};

export default SwitchTab;
