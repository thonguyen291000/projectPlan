import React from "react";
import { CFooter } from "@coreui/react";

const Footer = () => {
  return (
    <CFooter className="footer" fixed={false}>
      <span className="mr-1">
        &copy; Copyright by <b>Nguyen Tho</b>
      </span>
    </CFooter>
  );
};

export default React.memo(Footer);
