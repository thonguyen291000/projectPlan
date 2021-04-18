import React from "react";
//Library
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CImg,
  CListGroup,
} from "@coreui/react";

const Card = ({ symbol, content, children }) => {
  return (
    <CCol xs="12" sm="6" md="4" className="card_body_container">
      <CCard accentColor="info" className="card_body">
        <CCardHeader className="sub_card_header">
          <CImg src={symbol} />
          <span>{content}</span>
        </CCardHeader>
        <CCardBody className="sub_card_body">
          <CListGroup>{children}</CListGroup>
        </CCardBody>
      </CCard>
    </CCol>
  );
};

export default Card;
