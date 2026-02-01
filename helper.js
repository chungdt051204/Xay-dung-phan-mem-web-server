//Hàm chuyển base64 thành base64url để đảm bảo an toàn url
const base64url = (str) => {
  return btoa(str).replace(/\+/, "-").replace(/\//, "-").replace(/\=/, "");
};
module.exports = base64url;
