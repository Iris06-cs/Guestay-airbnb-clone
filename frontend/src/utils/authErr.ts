const authErr = (data, setErr) => {
  if (data && data.statusCode === 401) {
    setErr(true);
  }
};
export default authErr;
