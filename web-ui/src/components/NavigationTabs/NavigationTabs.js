import React, { useEffect, useState } from "react";
//Components
import NavigationTab from "./NavigationTab";
//Redux
import { useSelector } from "react-redux";
//Const 
import {tabs} from "../../const/tabs";

const NavigationTabs = () => {
  const [selectedTab, setSelectedTab] = useState("Profile");
  var tabFromRedux = useSelector((state) => state.data.tab);
  useEffect(() => {
    setSelectedTab(tabFromRedux);
  }, [tabFromRedux]);

  return (
    <div className="tabs_navigation_container">
      <ul className="ul_tabs">
        {tabs.map((tab, index) => (
          <li data-tip={tab.name} className="li_tab" key={index}>
            <NavigationTab name={tab.name} icon={tab.icon} selectedTab={selectedTab} selectedIcon={tab.activeIcon}/>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NavigationTabs;
