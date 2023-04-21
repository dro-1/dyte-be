const getAuthToken = () => {
  return new Buffer(
    `${process.env.ORGANISATION_ID}:${process.env.API_KEY}`
  ).toString("base64");
};

module.exports = {
  getAuthToken,
};
