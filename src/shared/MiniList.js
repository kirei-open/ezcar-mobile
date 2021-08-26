import React from 'react';
import { connect } from 'react-redux';
import request from '../modules/request';
import {
  MINILIST_COMPANY_LOAD,
  MINILIST_COMPANY_UNLOAD,
  MINILIST_DIVISION_LOAD,
  MINILIST_DIVISION_UNLOAD,
  MINILIST_FLEET_LOAD,
  MINILIST_POOL_LOAD,
  MINILIST_POOL_UNLOAD,
  MINILIST_FLEET_UNLOAD
} from '../modules/constants/actions';

function MiniList(UiComponent) {
  class BaseMiniList extends React.Component {
    render() {
      return <UiComponent {...this.props} />;
    }
  }

  const mapStateToProps = state => ({
    user: state.auth.user,
    companies: state.miniList.companies,
    divisions: state.miniList.divisions,
    pools: state.miniList.pools,
    fleets: state.miniList.fleets
  });

  const mapDispatchToProps = dispatch => ({
    getCompanies: () =>
      dispatch({
        type: MINILIST_COMPANY_LOAD,
        payload: request.company.minilist()
      }),
    unloadCompanies: () => dispatch({ type: MINILIST_COMPANY_UNLOAD }),
    getDivisions: query =>
      dispatch({
        type: MINILIST_DIVISION_LOAD,
        payload: request.division.minilist(query)
      }),
    unloadDivisions: () => dispatch({ type: MINILIST_DIVISION_UNLOAD }),
    getPools: query =>
      dispatch({
        type: MINILIST_POOL_LOAD,
        payload: request.pool.minilist(query)
      }),
    unloadPools: () => dispatch({ type: MINILIST_POOL_UNLOAD }),
    getFleets: query =>
      dispatch({
        type: MINILIST_FLEET_LOAD,
        payload: request.fleet.minilist(query)
      }),
    unloadFleets: () => dispatch({ type: MINILIST_FLEET_UNLOAD })
  });

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(BaseMiniList);
}

export default MiniList;
