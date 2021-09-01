import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import request from '../modules/request';
import {
  COMPANY_LIST_LOAD,
  COMPANY_UNLOAD,
  COMPANY_CREATE,
  COMPANY_REMOVE,
  COMPANY_UPDATE,
  COMPANY_SINGLE_LOAD
} from '../modules/constants/actions';

const Company = ({
  UiComponent,
  list,
  single,
  user,
  inProgress,
  reload,
  getCompanyList,
  getSingleCompany,
  createCompany,
  updateCompany,
  removeCompany,
  onCompanyUnload
}) => (
  <UiComponent
    user={user}
    list={list}
    single={single}
    reload={reload}
    getCompanyList={getCompanyList}
    getSingleCompany={getSingleCompany}
    createCompany={createCompany}
    updateCompany={updateCompany}
    removeCompany={removeCompany}
    inProgress={inProgress}
    onCompanyUnload={onCompanyUnload}
  />
);

Company.propTypes = {
  UiComponent: PropTypes.func.isRequired,
  list: PropTypes.shape({}),
  single: PropTypes.shape({}),
  user: PropTypes.shape({}),
  inProgress: PropTypes.bool,
  reload: PropTypes.bool
};

Company.defaultProps = {
  list: {},
  single: {},
  user: null,
  inProgress: false,
  reload: false
};

const mapStateToProps = state => ({
  list: state.company.list,
  single: state.company.single,
  inProgress: state.company.inProgress,
  user: state.auth.user,
  reload: state.app.reload
});

const mapDispatchToProps = dispatch => ({
  getCompanyList: query =>
    dispatch({ type: COMPANY_LIST_LOAD, payload: request.company.list(query) }),
  getSingleCompany: id =>
    dispatch({ type: COMPANY_SINGLE_LOAD, payload: request.company.get(id) }),
  createCompany: payload =>
    dispatch({
      type: COMPANY_CREATE,
      payload: request.company.create(payload)
    }),
  updateCompany: (id, payload) =>
    dispatch({
      type: COMPANY_UPDATE,
      payload: request.company.update(id, payload)
    }),
  removeCompany: id =>
    dispatch({ type: COMPANY_REMOVE, payload: request.company.delete(id) }),
  onCompanyUnload: () => dispatch({ type: COMPANY_UNLOAD })
});

export default connect(mapStateToProps, mapDispatchToProps)(Company);
