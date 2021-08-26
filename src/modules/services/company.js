import qs from 'query-string';
import utils from '../utils';

const company = requests => ({
  list: query => {
    const params = {
      page: query && query.page ? query.page : 1,
      limit: query && query.limit ? query.limit : 10,
      q: query && query.q ? qs.stringify(query.q) : qs.stringify({})
    };
    
    if (query.search) {
      params.search = query.search;
    }
    const url = `/company${utils.jsonToQueryString(params)}`;
    return requests.get(url);
  },
  get: id => requests.get(`/company/${id}`),
  create: payload => requests.post('/company', payload),
  update: (id, payload) => requests.put(`/company/${id}`, payload),
  delete: id => requests.delete(`/company/${id}`),
  search: query => {
    const params = {
      limit: query && query.limit ? query.limit : 5,
      q: query && query.q ? query.q : '',
      page: query && query.page ? query.page : 1
    };
    const url = `/company/search${utils.jsonToQueryString(params)}`;
    return requests.get(url);
  },
  minilist: (query = null) => {
    let url = '/company/mini-list';
    if (query) {
      url += utils.jsonToQueryString(query);
    }
    return requests.get(url);
  }
});

export default company;
