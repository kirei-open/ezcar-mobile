import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import request from '../modules/request';
import {
    APP_SET_LOCATION,
    FLEET_LIST_LOAD,
    FLEET_UNLOAD,
    FLEET_LIST_KEYS,
    FLEET_LIST_FILTER
} from '../modules/constants/actions';

const Home = ({
    UiComponent,
    loaded,
    location,
    setLocation,
    user,
    getFleetList,
    list,
    onFleetUnload,
    getFleetKeys,
    keys,
    filter,
    ...rest
}) => (
    <UiComponent
        location={location}
        loaded={loaded}
        setLocation={setLocation}
        user={user}
        getFleetList={getFleetList}
        list={list}
        onFleetUnload={onFleetUnload}
        getFleetKeys={getFleetKeys}
        keys={keys}
        filter={filter}
        {...rest}
    />
);

Home.propTypes = {
    UiComponent: PropTypes.func.isRequired,
    location: PropTypes.shape({
      lat: PropTypes.number.isRequired,
      long: PropTypes.number.isRequired
    }),
    user: PropTypes.shape({}),
    loaded: PropTypes.bool,
    list: PropTypes.shape({}),
    keys: PropTypes.array,
    filter: PropTypes.shape({})
};

Home.defaultProps = {
    location: {},
    user: null,
    loaded: false,
    list: {},
    keys: [],
    filter: {}
};

const mapStateToProps = state => ({
    list: state.fleet.list,
    keys: state.fleet.keys,
    location: state.app.location,
    user: state.auth.user,
    loaded: state.auth.loaded,
    filter: state.fleet.filter
});

const mapDispatchToProps = dispatch => ({
    getFleetList: query =>
        dispatch({
        type: FLEET_LIST_LOAD,
        payload: request.fleet.list(query)
        }),
    setLocation: payload => dispatch({ type: APP_SET_LOCATION, payload }),
    onFleetUnload: () => dispatch({ type: FLEET_UNLOAD }),
    getFleetKeys: query =>
        dispatch({
        type: FLEET_LIST_KEYS,
        payload: request.fleet.getKeys(query)
        }),
    setFleetFilter: payload =>
        console.log(payload)
        // dispatch({
        // type: FLEET_LIST_FILTER,
        // payload
        // })
});
  
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home);

