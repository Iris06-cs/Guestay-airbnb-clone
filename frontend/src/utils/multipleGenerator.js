const multipleGenerator = (num, content = []) => {
  let arr = [];
  for (let i = 0; i < num; i++) {
    if (content.length) arr.push(content[i]);
    else arr.push(i);
  }

  return arr;
};
export default multipleGenerator;
