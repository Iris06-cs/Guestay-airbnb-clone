//date format
//year-month-day h:m:s
const dateFormat = (date) => {
  const dateStrs = date.toISOString().split("T");
  dateStrs[1] = dateStrs[1].split(".")[0];
  const formattedDate = dateStrs.join(" ");
  return formattedDate;
};

module.exports = { dateFormat };
