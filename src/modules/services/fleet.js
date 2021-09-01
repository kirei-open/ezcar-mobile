import qs from 'query-string';
import utils from '../utils';

const fleet = requests => ({
  list: query => {
    const params = {
      page: query && query.page ? query.page : 1,
      limit: query && query.limit ? query.limit : 10,
      q: query && query.q ? qs.stringify(query.q) : qs.stringify({})
    };
    if (query.search) {
      params.search = query.search;
    }

    if (Object.prototype.hasOwnProperty.call(query, 'operate')) {
      params.operate = query.operate;
    }
    if (Object.prototype.hasOwnProperty.call(query, 'duty')) {
      params.duty = query.duty;
    }
    const url = `/fleet${utils.jsonToQueryString(params)}`;
    console.log(url)
    return requests.get(url);
  },
  getKeys: query => {
    const params = {
      page: query && query.page ? query.page : 1,
      limit: query && query.limit ? query.limit : 1000,
      q: query && query.q ? qs.stringify(query.q) : qs.stringify({})
    };

    if (query.search) {
      params.search = query.search;
    }

    if (Object.prototype.hasOwnProperty.call(query, 'operate')) {
      params.operate = query.operate;
    }
    if (Object.prototype.hasOwnProperty.call(query, 'duty')) {
      params.duty = query.duty;
    }

    const url = `/fleet/get-keys${utils.jsonToQueryString(params)}`;
    console.log(url)
    return requests.get(url);
  },
  get: id => requests.get(`/fleet/${id}`),
  create: payload => requests.post('/fleet', payload),
  update: (id, payload) => requests.put(`/fleet/${id}`, payload),
  delete: id => requests.delete(`/fleet/${id}`),
  search: query => {
    const params = {
      limit: query && query.limit ? query.limit : 5,
      q: query && query.q ? query.q : '',
      page: query && query.page ? query.page : 1
    };
    const url = `/fleet/search${utils.jsonToQueryString(params)}`;
    console.log(url)
    return requests.get(url);
  },
  minilist: (query = null) => {
    let url = '/fleet/mini-list';
    if (query) {
      url += utils.jsonToQueryString(query);
    }
    console.log(url)
    return requests.get(url);
  },
  history: query => {
    const url = `/fleet/history${utils.jsonToQueryString(query)}`;
    console.log(url)
    return requests.get(url);
  },
  analysis: ({ startDate, endDate }) =>
    requests.get(`/fleet/analysis?startDate=${startDate}&endDate=${endDate}`),
  analysis1: query => {
    const { q, ...rest } = query;

    const params = {
      q: query && q ? qs.stringify(q) : qs.stringify({}),
      ...rest
    };

    const url = `/fleet/analysis1${utils.jsonToQueryString(params)}`;
    return requests.get(url);
  },
  utilization: query => {
    const { page, limit, tab, q, ...rest } = query;

    const params = {
      page: query && page ? page : 1,
      limit: query && limit ? limit : 10,
      tab: tab && tab ? tab : 'Vehicle',
      q: query && q ? qs.stringify(q) : qs.stringify({}),
      ...rest
    };

    const url = `/fleet/utilization${utils.jsonToQueryString(params)}`;
    return requests.get(url);
  },
  analysis_detail: query => {
    console.log('analysis_detail', query);
    const { page, limit, tab, q, ...rest } = query;

    const params = {
      // page: query && page ? page : 1,
      // limit: query && limit ? limit : 10,
      tab: tab && tab ? tab : '',
      q: query && q ? qs.stringify(q) : qs.stringify({}),
      ...rest
    };

    const url = `/fleet/analysis_detail${utils.jsonToQueryString(params)}`;
    return requests.get(url);
  }
});

export default fleet;
