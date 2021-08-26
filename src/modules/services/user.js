import qs from 'query-string';
import utils from '../utils';

const user = requests => ({
  list: query => {
    const params = {
      page: query && query.page ? query.page : 1,
      limit: query && query.limit ? query.limit : 10,
      q:
        query && query.q
          ? qs.stringify(query.q)
          : qs.stringify({ role: 'passenger' })
    };

    if (query.search) {
      params.search = query.search;
    }
    const url = `/user${utils.jsonToQueryString(params)}`;
    return requests.get(url);
  },
  get: id => requests.get(`/user/${id}`),
  create: payload => requests.post('/user', payload),
  update: (id, payload) => requests.put(`/user/${id}`, payload),
  delete: id => requests.delete(`/user/${id}`),
  minilist: (query = null) => {
    let url = '/user/mini-list';
    if (query) {
      url += utils.jsonToQueryString(query);
    }
    return requests.get(url);
  },
  search: query => {
    const params = {
      limit: query && query.limit ? query.limit : 5,
      q: query && query.q ? qs.stringify(query.q) : '',
      page: query && query.page ? query.page : 1
    };
    const url = `/user/search${utils.jsonToQueryString(params)}`;
    return requests.get(url);
  }
});

export default user;
