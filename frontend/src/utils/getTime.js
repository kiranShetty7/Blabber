import moment from "moment";

export const getTime = (time) => {
  const currentTime = moment();
  const Time = moment(time);

  const diffMinutes = currentTime.diff(Time, "minutes");
  const diffHours = currentTime.diff(Time, "hours");
  const diffDays = currentTime.diff(Time, "days");

  if (diffMinutes < 2) {
    return "Just now";
  } else if (diffMinutes >= 2 && diffHours < 24) {
    return Time.format("HH:mm:A");
  } else if (diffHours >= 24 && diffHours < 48) {
    return "Yesterday";
  } else {
    return Time.format("HH-MMM-YYYY");
  }
};
