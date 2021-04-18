import React from "react";
//Library
import { CContainer, CFade } from "@coreui/react";
//Components
import Sessions from "./Sessions";

const Content = () => {
  return (
    <main className="c-main">
      <CContainer fluid>
        <CFade>
          <Sessions />
        </CFade>
      </CContainer>
    </main>
  );
};

export default Content;
