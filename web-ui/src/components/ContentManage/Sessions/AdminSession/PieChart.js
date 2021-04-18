import React from "react";
//Library
import { CCard, CCardBody, CCardHeader } from "@coreui/react";
import { CChartPie } from "@coreui/react-chartjs";

const PieChart = ({ classDetails }) => {
  const getClassNamesWithMessage = () => {
    const rooms = [];
    const messages = [];
    for (var i = 0; i < classDetails.rootRoom.rooms.length; i++) {
      rooms.push(classDetails.rootRoom.rooms[i].name);
      messages.push(classDetails.rootRoom.rooms[i].messages.length);
    }

    return {
      rooms,
      messages,
    };
  };

  const classNameWithmessage = getClassNamesWithMessage();

  const generateRandomColor = () => {
    const colorArray = [];

    for (var i = 0; i < classNameWithmessage.rooms.length; i++) {
      var randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
      while (colorArray.indexOf(randomColor) !== -1) {
        randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
      }
      colorArray.push(randomColor);
    }

    return colorArray;
  };

  return (
    <CCard>
      <CCardHeader>
        <h4 id="class_name" className="card-title mb-0">
          Message groups pie chart
        </h4>
      </CCardHeader>
      <CCardBody>
        <CChartPie
          datasets={[
            {
              backgroundColor: generateRandomColor(),
              data: classNameWithmessage.messages,
            },
          ]}
          labels={classNameWithmessage.rooms}
          options={{
            tooltips: {
              enabled: true,
            },
          }}
        />
      </CCardBody>
    </CCard>
  );
};

export default PieChart;
