export const getDate = (time) => {
  return new Date(time).toLocaleDateString("en-US");
}

export const getHourAndMinute = (time) => {
  return new Date(time)
    .toLocaleTimeString()
    .replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
};

export const compareWithNow = (time) => {
    const currentTime = new Date(time);
  const today = new Date();
  return (
    currentTime.getDate() == today.getDate() &&
    currentTime.getMonth() == today.getMonth() &&
    currentTime.getFullYear() == today.getFullYear()
  );
};

export const compareTwoDate = (time1, time2) => {
    return new Date(time1).toDateString() === new Date(time2).toDateString()
}