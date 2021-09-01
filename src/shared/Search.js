import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { SEARCH_LOAD, SEARCH_UNLOAD } from '../modules/constants/actions';

const Search = ({
  UiComponent,
  result,
  count,
  getSearchResult,
  onSearchUnload
}) => (
  <UiComponent
    result={result}
    count={count}
    getSearchResult={getSearchResult}
    onSearchUnload={onSearchUnload}
  />
);

Search.propTypes = {
  UiComponent: PropTypes.func.isRequired,
  result: PropTypes.shape({}),
  count: PropTypes.number
};

Search.defaultProps = {
  result: {},
  count: 0
};

const mapStateToProps = state => ({
  result: state.search.result,
  count: state.search.count
});

const mapDispatchToProps = dispatch => ({
  getSearchResult: (searchField, payload) =>
    dispatch({
      type: SEARCH_LOAD,
      payload,
      searchField
    }),
  onSearchUnload: () => dispatch({ type: SEARCH_UNLOAD })
});

export default connect(mapStateToProps, mapDispatchToProps)(Search);
