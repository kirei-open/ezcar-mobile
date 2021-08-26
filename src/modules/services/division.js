import qs from 'query-string';
import utils from '../utils';

const division = requests => ({
  list: query => {
    const params = {
      page: query && query.page ? query.page : 1,
      limit: query && query.limit ? query.limit : 10,
      q: query && query.q ? qs.stringify(query.q) : qs.stringify({})
    };

    if (query.search) {
      params.search = query.search;
    }
    const url = `/division${utils.jsonToQueryString(params)}`;
    return requests.get(url);
  },
  get: id => requests.get(`/division/${id}`),
  create: payload => requests.post('/division', payload),
  update: (id, payload) => requests.put(`/division/${id}`, payload),
  delete: id => requests.delete(`/division/${id}`),
  search: query => {
    const params = {
      limit: query && query.limit ? query.limit : 5,
      q: query && query.q ? query.q : '',
      page: query && query.page ? query.page : 1
    };
    const url = `/division/search${utils.jsonToQueryString(params)}`;
    return requests.get(url);
  },
  minilist: (query = null) => {
    let url = '/division/mini-list';
    if (query) {
      url += utils.jsonToQueryString(query);
    }
    return requests.get(url);
  }
});

export default division;
