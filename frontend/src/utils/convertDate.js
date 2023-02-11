const converDate = (dateStr) => {
  let year = dateStr.split("-")[0];
  let month = dateStr.split("-")[1];
  const months = {
    "01": "January",
    "02": "February",
    "03": "March",
    "04": "April",
    "05": "May",
    "06": "June",
    "07": "July",
    "08": "August",
    "09": "September",
    10: "October",
    11: "November",
    12: "December",
  };

  month = months[month];
  return { year, month };
};
export default converDate;
