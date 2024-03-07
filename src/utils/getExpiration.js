const getExpiration = (day) => {
  const currentDate = new Date();
  const expirationDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() + day
  ).toISOString();
  return expirationDate;
};

module.exports = getExpiration;
