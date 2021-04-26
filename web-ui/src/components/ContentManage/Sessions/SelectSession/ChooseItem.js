import React from "react";
//Library
import { CBadge, CImg, CListGroupItem } from "@coreui/react";
//Icons
import right_arrow from "../../../../assets/icons/right_arrow.png";

const ChooseItem = ({
  content,
  active,
  selectFunction,
  type,
  openClassDetails,
  classDetails,
}) => {
  const handleItemChoose = () => {
    if (openClassDetails) {
      openClassDetails(classDetails);
    }
    selectFunction(content);
  };

  return (
    <CListGroupItem
      action
      style={{ color: "black" }}
      active={active ? true : false}
      onClick={handleItemChoose}
      className="list_group_item"
    >
      {type === "term" ? content.split("-")[1] : content}
      <CBadge className="float-right">
        <CImg
          src={right_arrow}
          className={`right_arrow_${type}`}
          id={`right_arrow_${content}`}
        />
      </CBadge>
    </CListGroupItem>
  );
};

export default ChooseItem;
