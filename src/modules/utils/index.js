import md5 from 'crypto-js/md5';
import encHex from 'crypto-js/enc-hex';
import moment from 'moment';
// import routeNames from '../../web/routes/name';
// import config from '../constants/config';

const jsonToQueryString = json =>
  `?${Object.keys(json)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(json[key])}`)
    .join('&')}`;

const gravatar = (email, size) => {
  const objectHash = md5(email);
  const emailString = objectHash.toString(encHex);
  return `https://gravatar.com/avatar/${emailString}?s=${size}&d=retro`;
};

// const pageTitle = (location, match) => {
//   let name = null;
//   if (routeNames[match.path]) {
//     name = routeNames[match.path];
//   } else if (routeNames[location.pathname]) {
//     name = routeNames[location.pathname];
//   } else {
//     const snippet = location.pathname.split('/').filter(i => i);
//     const url = `/${snippet.slice(0, snippet.length - 1).join('/')}/:id`;
//     if (routeNames[url]) {
//       name = routeNames[url];
//     }
//   }
//   return name;
// };

// const pageHeader = (location, match) => {
//   const name = pageTitle(location, match);
//   return name ? `${name} | ${config.appName}` : config.appName;
// };

const profileUrl = user => `/user/${user.role.replace('_', '-')}/${user._id}`;

const fleetUrl = fleet => `/fleet/${fleet ? fleet._id : ''}`;

/**
 * The "mean" is the "average" you're used to, where you add up all the numbers
 * and then divide by the number of numbers.
 *
 * For example, the "mean" of [3, 5, 4, 4, 1, 1, 2, 3] is 2.875.
 *
 * @param {Array} numbers An array of numbers.
 * @return {Number} The calculated average (or mean) value from the specified
 *     numbers.
 */
const mean = numbers => {
  let total = 0;
  let i = 0;
  for (i = 0; i < numbers.length; i += 1) {
    total += numbers[i];
  }
  return total / numbers.length;
};

/**
 * The "median" is the "middle" value in the list of numbers.
 *
 * @param {Array} numbers An array of numbers.
 * @return {Number} The calculated median value from the specified numbers.
 */
const median = numbers => {
  // median of [3, 5, 4, 4, 1, 1, 2, 3] = 3
  let med = 0;
  const numsLen = numbers.length;
  numbers.sort();

  if (numsLen % 2 === 0) {
    // is even
    // average of two middle numbers
    med = (numbers[numsLen / 2 - 1] + numbers[numsLen / 2]) / 2;
  } else {
    // is odd
    // middle number only
    med = numbers[(numsLen - 1) / 2];
  }

  return med;
};

/**
 * The "mode" is the number that is repeated most often.
 *
 * For example, the "mode" of [3, 5, 4, 4, 1, 1, 2, 3] is [1, 3, 4].
 *
 * @param {Array} numbers An array of numbers.
 * @return {Array} The mode of the specified numbers.
 */
const mode = numbers => {
  // as result can be bimodal or multi-modal,
  // the returned result is provided as an array
  // mode of [3, 5, 4, 4, 1, 1, 2, 3] = [1, 3, 4]
  let mod = [];
  let count = [];
  let i = 0;
  let number = 0;
  let maxIndex = 0;

  for (i = 0; i < numbers.length; i += 1) {
    number = numbers[i];
    count[number] = (count[number] || 0) + 1;
    if (count[number] > maxIndex) {
      maxIndex = count[number];
    }
  }

  for (i in count) {
    if (count.hasOwnProperty(i)) {
      if (count[i] === maxIndex) {
        mod.push(Number(i));
      }
    }
  }

  return mod.toString();
};

/**
 * The "range" of a list a numbers is the difference between the largest and
 * smallest values.
 *
 * For example, the "range" of [3, 5, 4, 4, 1, 1, 2, 3] is [1, 5].
 *
 * @param {Array} numbers An array of numbers.
 * @return {Array} The range of the specified numbers.
 */
const range = numbers => {
  numbers.sort();
  return `${numbers[0]} - ${numbers[numbers.length - 1]}`;
};

export default {
  jsonToQueryString,
  gravatar,
  // pageTitle,
  // pageHeader,
  profileUrl,
  fleetUrl,
  mean,
  median,
  mode,
  range
};
