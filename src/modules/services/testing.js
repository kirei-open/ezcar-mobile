import qs from 'query-string';
import utils from '../utils';

const testing = requests => ({
  list: query => {
    const { page, limit, q, ...rest } = query;
    const params = {
      page: query && page ? page : 1,
      limit: query && limit ? limit : 10,
      q: query && q ? qs.stringify(q) : qs.stringify({}),
      ...rest
    };
    const url = `/testing${utils.jsonToQueryString(params)}`;
    return requests.get(url);
  },
  get: id => requests.get(`/testing/${id}`),
  summary: () => requests.get('/testing/summary'),
  create: payload => requests.post('/testing', payload),
  update: (id, payload) => requests.put(`/testing/${id}`, payload),
  command: (command, id, payload) =>
    requests.post(`/testing/${id}/${command}`, payload),
  check: id => requests.get(`/testing/check/${id}`)
});

export default testing;
