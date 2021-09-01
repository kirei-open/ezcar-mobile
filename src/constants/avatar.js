// import md5 from 'crypto-js/md5';
// import encHex from 'crypto-js/enc-hex';

const avatar = (name, size = '') => {
  // const objectHash = md5(email);
  // const emailString = objectHash.toString(encHex);
  // return `https://gravatar.com/avatar/${emailString}?s=${size}&d=retro`;
  let n = name;
  if (name && name.indexOf(' ') > -1) {
    n = name.split(' ').join('+');
  }
  return `https://ui-avatars.com/api/?name=${n}&size=${size}&background=3b54e7&color=fff`;
};

export default avatar;
