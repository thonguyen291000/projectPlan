import React from "react";
//Library
import { CCard, CCardBody, CCardHeader } from "@coreui/react";
import { CChartPie } from "@coreui/react-chartjs";
import BarLoader from "react-spinners/BarLoader";

const PieChart = ({ classDetails, rooms, override, loading }) => {
  const getClassNamesWithMessage = () => {
    const newRooms = [];
    const messages = [];
    for (var i = 0; i < rooms.length; i++) {
      newRooms.push(rooms[i].name.split("|")[0]);
      messages.push(rooms[i].messages.length);
    }

    return {
      rooms: newRooms,
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
        {loading ? (
          <BarLoader
            color="#000000"
            loading={true}
            css={override}
            width="100%"
          />
        ) : (
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
        )}
      </CCardBody>
    </CCard>
  );
};

export default PieChart;
