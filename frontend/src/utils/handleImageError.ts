const defaultImg = (srcUrl = "", defaulSrc, className, altName, key = "") => {
  const handleImgOnError = (e) => {
    e.target.src = defaulSrc;
    e.target.onerror = null;
  };
  let myFakeUrl = /image\d+\.url/;

  const invalidSrc = [
    "Spot has no image yet",
    "Does not have a preview image",
    "No ReviewImages",
  ];
  if (invalidSrc.includes(srcUrl) || myFakeUrl.test(srcUrl))
    return (
      <img src={defaulSrc} alt="default" className={className} key={key} />
    );
  else
    return (
      <img
        onError={(e) => handleImgOnError(e)}
        className={className}
        src={srcUrl}
        alt={altName}
        key={key}
        // click
      />
    );
};

export default defaultImg;
