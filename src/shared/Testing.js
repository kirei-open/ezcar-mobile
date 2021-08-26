import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { TESTING_LOAD, 
         TESTING_UNLOAD,
         TESTING_SINGLE_LOAD,
         TESTING_CREATE,
         TESTING_REMOVE,
         FLEET_CREATE,
         FLEET_REMOVE, } from '../modules/constants/actions';
import request from '../modules/request';

const Testing = ({
  UiComponent,
  list,
  user,
  token,
  getTesting,
  onTestingUnload,
  getSingleTesting,
  createTesting,
  removeTesting,
  ...rest
}) => (
  <UiComponent
    user={user}
    token={token}
    list={list}
    getTesting={getTesting}
    onTestingUnload={onTestingUnload}    
    getSingleTesting={getSingleTesting}
    createTesting={createTesting}    
    removeTesting={removeTesting}
    {...rest}
  />
);

Testing.propTypes = {
  UiComponent: PropTypes.func.isRequired,
  list: PropTypes.shape({}),
  user: PropTypes.shape({}),
  token: PropTypes.string
};

Testing.defaultProps = {
  list: {},
  user: null,
  token: ''
};

const mapStateToProps = state => ({
  list: state.testing.list,
  user: state.auth.user,
  token: state.app.token,
});

const mapDispatchToProps = dispatch => ({
  getTesting: query =>
    dispatch({ type: TESTING_LOAD, payload: request.testing.list(query) }),
  onTestingUnload: () => dispatch({ type: TESTING_UNLOAD }),
  getSingleTesting: id =>
    dispatch({ type: TESTING_SINGLE_LOAD, payload: request.testing.get(id) }),
  createTesting: payload =>
    dispatch({
      type: TESTING_CREATE,
      payload: request.testing.create(payload)
    }),
  removeTesting: id =>
    dispatch({ type: TESTING_REMOVE, payload: request.testing.delete(id) }),

  createFleet: payload =>
    dispatch({
      type: FLEET_CREATE,
      payload: request.fleet.create(payload)
    }),  
  removeFleet: id =>
    dispatch({ type: FLEET_REMOVE, payload: request.fleet.delete(id) }),  
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Testing);
