import qs from 'query-string';
import utils from '../utils';

const chat = requests => ({
  list: query => {
    const params = {
      page: query && query.page ? query.page : 1,
      limit: query && query.limit ? query.limit : 10,
      q: query && query.q ? qs.stringify(query.q) : qs.stringify({})
    };
    const url = `/chat${utils.jsonToQueryString(params)}`;
    return requests.get(url);
  }
});

export default chat;
