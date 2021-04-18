import React from "react";
// //scss
// import "./Card.scss";
//Library
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CLink,
  CBreadcrumb,
  CBreadcrumbItem,
  CImg,
} from "@coreui/react";
//Icons
import home from "../../../../assets/icons/home.png";
import class_icon from "../../../../assets/icons/class_manage.png";
import subject from "../../../../assets/icons/subject.png";
import term from "../../../../assets/icons/term.png";
//Components
import Item from "./ChooseItem";
import Card from "./Card";

const Sessions = ({
  data,
  selectedSubject,
  selectedTerm,
  selectedClass,
  selectSubject,
  selectTerm,
  selectClass,
  openClassDetails,
}) => {
  return (
    <div className="select_session_container">
      <CRow>
        <CCol xs="12">
          <CCard accentColor="primary">
            <CCardHeader className="card_header">
              <CBreadcrumb>
                <CBreadcrumbItem>
                  <CLink>
                    <CImg src={home} />
                  </CLink>
                </CBreadcrumbItem>
                {selectedSubject && (
                  <CBreadcrumbItem active={selectedTerm ? false : true}>
                    {selectedTerm ? (
                      <CLink>{selectedSubject}</CLink>
                    ) : (
                      <span>{selectedSubject}</span>
                    )}
                  </CBreadcrumbItem>
                )}
                {selectedTerm && (
                  <CBreadcrumbItem active={selectedClass ? false : true}>
                    {selectedClass ? (
                      <CLink>{selectedTerm}</CLink>
                    ) : (
                      <span>{selectedTerm}</span>
                    )}
                  </CBreadcrumbItem>
                )}
                {selectedClass && (
                  <CBreadcrumbItem active>
                    <span>{selectedClass}</span>
                  </CBreadcrumbItem>
                )}
              </CBreadcrumb>
            </CCardHeader>
            <CCardBody>
              <CRow>
                <Card content="Subjects" symbol={subject}>
                  {data && data.map((subject, index) => {
                    if (subject.name === selectedSubject) {
                      return (
                        <Item
                          type="subject"
                          content={subject.name}
                          index={index}
                          selectFunction={selectSubject}
                          active
                        />
                      );
                    } else {
                      return (
                        <Item
                          type="subject"
                          content={subject.name}
                          index={index}
                          selectFunction={selectSubject}
                        />
                      );
                    }
                  })}
                </Card>
                <Card content="Terms" symbol={term}>
                  {subject &&
                    data?.map((subject) => {
                      if (subject.name === selectedSubject) {
                        return (
                          <>
                            {subject.terms.map((term, index) => {
                              if (term.name === selectedTerm) {
                                return (
                                  <Item
                                    type="term"
                                    content={term.name}
                                    index={index}
                                    selectFunction={selectTerm}
                                    active
                                  />
                                );
                              } else {
                                return (
                                  <Item
                                    type="term"
                                    content={term.name}
                                    index={index}
                                    selectFunction={selectTerm}
                                  />
                                );
                              }
                            })}
                          </>
                        );
                      } else return <></>;
                    })}
                </Card>
                <Card content="Classes" symbol={class_icon}>
                  {term &&
                    data?.map((subject) => {
                      if (subject.name === selectedSubject) {
                        return (
                          <>
                            {subject.terms.map((term) => {
                              if (term.name === selectedTerm) {
                                return (
                                  <>
                                    {term.classes.map((classItem, index) => {
                                      if (classItem.name === selectedClass) {
                                        return (
                                          <Item
                                            type="class"
                                            content={classItem.name}
                                            index={index}
                                            selectFunction={selectClass}
                                            active
                                          />
                                        );
                                      } else {
                                        return (
                                          <Item
                                            type="class"
                                            content={classItem.name}
                                            index={index}
                                            classDetails={classItem}
                                            openClassDetails={openClassDetails}
                                            selectFunction={selectClass}
                                          />
                                        );
                                      }
                                    })}
                                  </>
                                );
                              } else return <></>;
                            })}
                          </>
                        );
                      } else return <></>;
                    })}
                </Card>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  );
};

export default Sessions;
