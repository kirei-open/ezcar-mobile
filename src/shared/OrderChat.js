import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { CHAT_LOAD, CHAT_UNLOAD } from '../modules/constants/actions';
import request from '../modules/request';

const OrderChat = ({
  UiComponent,
  user,
  chats,
  loadChatList,
  unloadChat,
  ...rest
}) => (
  <UiComponent
    user={user}
    chats={chats}
    loadChatList={loadChatList}
    unloadChat={unloadChat}
    {...rest}
  />
);

OrderChat.propTypes = {
  UiComponent: PropTypes.func.isRequired,
  chats: PropTypes.shape({}),
  user: PropTypes.shape({})
};

OrderChat.defaultProps = {
  chats: {},
  user: null
};

const mapStateToProps = state => ({
  user: state.auth.user,
  chats: state.chat.list
});

const mapDispatchToProps = dispatch => ({
  loadChatList: query =>
    dispatch({ type: CHAT_LOAD, payload: request.chat.list(query) }),
  unloadChat: () => dispatch({ type: CHAT_UNLOAD })
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderChat);
