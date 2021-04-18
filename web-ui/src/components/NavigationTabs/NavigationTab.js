import React, { useEffect } from "react";
//Redux
import { useDispatch } from "react-redux";
import { setTabNavigation } from "../../redux/actions/dataAction";

const TabNavigation = ({ name, icon, selectedTab, selectedIcon }) => {
  const dispatch = useDispatch();

  //Switch tab
  useEffect(() => {
    if (name === selectedTab) {
      handlecChosenTab();
    }
  }, [selectedTab]);

  const handlecChosenTab = () => {
    const tabs = document.getElementsByClassName("li_tab_a");
    for (var i = 0; i < tabs.length; i++) {
      if (tabs[i].id === name) {
        dispatch(setTabNavigation(name));
        tabs[i].className += " active";

        tabs[i].children[0].src = selectedIcon;
      } else {
        tabs[i].className = "li_tab_a";
        tabs[i].children[0].src = tabs[i].children[0].id;
      }
    }
  };

  return (
    <a id={name} className="li_tab_a" onClick={handlecChosenTab}>
      <img className="li_tab_a_img" id={icon} src={icon} />
    </a>
  );
};

export default TabNavigation;
