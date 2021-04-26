import React from "react";
//Library
import { CChartLine } from "@coreui/react-chartjs";
import { getStyle, hexToRgba } from "@coreui/utils";
//Logic
import { compareTwoDate } from "../../../../funcs/formatDate";

const brandInfo = getStyle("info") || "#20a8d8";

const MainChart = (attributes) => {
  const classDetails = attributes.classDetails;
  const rooms = attributes.rooms;

  const filterMessageBasedDate = () => {
    const dateArray = [];
    const messageArray = {};
    //Filter date
    for (var i = 0; i < rooms?.length; i++) {
      for (var j = 0; j < rooms[i].messages.length; j++) {
        if (
          dateArray.indexOf(
            new Date(
              rooms[i].messages[j].createdAt
            ).toDateString()
          ) === -1
        ) {
          dateArray.push(
            new Date(
              rooms[i].messages[j].createdAt
            ).toDateString()
          );
        }
      }
    }

    //Filter message
    for (var i = 0; i < rooms.length; i++) {
      for (var j = 0; j < dateArray.length; j++) {
        if (!messageArray[`${dateArray[j]}`]) {
          messageArray[`${dateArray[j]}`] = 0;
        }
        for (
          var k = 0;
          k < rooms[i].messages.length;
          k++
        ) {
          if (
            compareTwoDate(
              rooms[i].messages[k].createdAt,
              dateArray[j]
            )
          ) {
            messageArray[`${dateArray[j]}`] =
              messageArray[`${dateArray[j]}`] + 1;
          }
        }
      }
    }

    return {
      dateArray,
      messageArray,
    };
  };
  const filterResult = filterMessageBasedDate();

  const defaultDatasets = (() => {
    const length = filterResult.dateArray.length;

    const data1 = [];

    for (let i = 0; i < length; i++) {
      data1.push(filterResult.messageArray[`${filterResult.dateArray[i]}`]);
    }
    return [
      {
        label: "Sended messages in the day",
        backgroundColor: hexToRgba(brandInfo, 10),
        borderColor: brandInfo,
        pointHoverBackgroundColor: brandInfo,
        borderWidth: 2,
        data: data1,
      },
    ];
  })();

  const defaultOptions = (() => {
    return {
      maintainAspectRatio: false,
      legend: {
        display: false,
      },
      scales: {
        xAxes: [
          {
            gridLines: {
              drawOnChartArea: false,
            },
          },
        ],
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              maxTicksLimit: 5,
              stepSize: Math.ceil(250 / 5),
              max: 250,
            },
            gridLines: {
              display: true,
            },
          },
        ],
      },
      elements: {
        point: {
          radius: 0,
          hitRadius: 10,
          hoverRadius: 4,
          hoverBorderWidth: 3,
        },
      },
    };
  })();

  // render
  return (
    <CChartLine
      className="main_chart"
      {...attributes}
      datasets={defaultDatasets}
      options={defaultOptions}
      labels={filterResult.dateArray}
    />
  );
};

export default MainChart;
