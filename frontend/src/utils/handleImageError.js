import demoSpotImg from "../images/demoSpotImg.png";

const defaultImg = (srcUrl, className, altName, key = "") => {
  const handleImgOnError = (e) => {
    e.target.src = demoSpotImg;
    e.target.onerror = null;
  };
  let myFakeUrl = /image\d+\.url/;

  const invalidSrc = [
    "Spot has no image yet",
    "Does not have a preview image",
    "",
  ];
  if (invalidSrc.includes(srcUrl) || myFakeUrl.test(srcUrl))
    return (
      <img src={demoSpotImg} alt="default" className={className} key={key} />
    );
  else
    return (
      <img
        onError={(e) => handleImgOnError(e)}
        className="spot-photo-img"
        src={srcUrl}
        alt={altName}
        key={key}
        // click
      />
    );
};

export default defaultImg;
