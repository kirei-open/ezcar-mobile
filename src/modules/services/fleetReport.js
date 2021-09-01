import qs from 'query-string';
import utils from '../utils';

const fleetReport = requests => ({
  list: query => {
    const params = {
      page: query && query.page ? query.page : 1,
      limit: query && query.limit ? query.limit : 10,
      q: query && query.q ? qs.stringify(query.q) : qs.stringify({})
    };
    if (query.search) {
      params.search = query.search;
    }
    const url = `/fleet-report${utils.jsonToQueryString(params)}`;
    return requests.get(url);
  },
  get: id => requests.get(`/fleet-report/${id}`),
  create: payload => requests.post('/fleet-report', payload),
  update: (id, payload) => requests.put(`/fleet-report/${id}`, payload),
  delete: id => requests.delete(`/fleet-report/${id}`),
  minilist: (query = null) => {
    let url = '/fleet-report/mini-list';
    if (query) {
      url += utils.jsonToQueryString(query);
    }
    return requests.get(url);
  },
  search: query => {
    const params = {
      limit: query && query.limit ? query.limit : 5,
      q: query && query.q ? query.q : '',
      page: query && query.page ? query.page : 1
    };
    const url = `/fleet-report/search${utils.jsonToQueryString(params)}`;
    return requests.get(url);
  },
});

export default fleetReport;
