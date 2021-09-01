import qs from 'query-string';
import utils from '../utils';

const order = requests => ({
  list: query => {
    const { page, limit, q, ...rest } = query;
    const params = {
      page: query && page ? page : 1,
      limit: query && limit ? limit : 10,
      q: query && q ? qs.stringify(q) : qs.stringify({}),
      ...rest
    };
    const url = `/order${utils.jsonToQueryString(params)}`;
    return requests.get(url);
  },
  get: id => requests.get(`/order/${id}`),
  summary: query => {
    const { q, ...rest } = query;

    const params = {
      q: query && q ? qs.stringify(q) : qs.stringify({}),
      ...rest
    };
    const url = `/order/summary${utils.jsonToQueryString(params)}`;
    return requests.get(url);
  },
  create: payload => requests.post('/order', payload),
  update: (id, payload) => requests.put(`/order/${id}`, payload),
  command: (command, id, payload) =>
    requests.post(`/order/${id}/${command}`, payload),
  check: id => requests.get(`/order/check/${id}`),
  utilization: query => {
    const { page, limit, tab, q, ...rest } = query;

    const params = {
      page: query && page ? page : 1,
      limit: query && limit ? limit : 10,
      tab: tab && tab ? tab : 'Taken',
      q: query && q ? qs.stringify(q) : qs.stringify({}),
      ...rest
    };

    const url = `/order/utilization${utils.jsonToQueryString(params)}`;
    return requests.get(url);
  }
});

export default order;
