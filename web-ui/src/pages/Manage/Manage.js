import React from "react";
//Components
import Header from "../../components/HeaderManage/Header";
import Footer from "../../components/FooterManage/Footer";
import Content from "../../components/ContentManage/Content";

const Manage = () => {
  return (
    <div className="c-app c-default-layout">
      <div className="c-wrapper">
        <Header />
        <div className="c-body">
          <Content />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Manage;
