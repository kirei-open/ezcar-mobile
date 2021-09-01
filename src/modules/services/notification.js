import utils from '../utils';

const notification = requests => ({
  shortList: () => requests.get('/notification/short'),
  read: () => requests.post('/notification/read'),
  longList: query => {
    const params = {
      page: query && query.page ? query.page : 1,
      limit: query && query.limit ? query.limit : 10
    };
    const url = `/notification${utils.jsonToQueryString(params)}`;
    return requests.get(url);
  }
});

export default notification;
