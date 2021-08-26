import React, { Component } from 'react';
import { Container, Button, Icon } from 'native-base';
import { GiftedChat } from 'react-native-gifted-chat';
import { Audio } from 'expo';
import { sendEvent, listenEvent, removeEvent } from '../modules/socket';

import definite from '../shared/assets/definite.mp3';
import AsyncStorage from '@react-native-async-storage/async-storage';

class OrderChat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
      page: 1,
      channel: null,
      user: ''
    };

    this.chatSound = undefined;
    this.setupChatSound = this.setupChatSound.bind(this);
    this.submitMessage = this.submitMessage.bind(this);
  }

  async componentDidMount() {
    const { orderId, loadChatList } = this.props;
    const { page } = this.state;
    const data = await AsyncStorage.getItem("user");
    const user = JSON.parse(data)
    this.setState({ user })

    await this.setupChatSound();

    sendEvent('subscribe order', {
      order: orderId,
      user: user._id
    });

    listenEvent('connected order chat', channel => {
      this.setState(
        {
          channel
        },
        () => {
          if (this.state.messages.length === 0) {
            loadChatList({
              page,
              limit: 20,
              q: {
                channel: channel._id
              }
            });
          }
        }
      );
    });

    listenEvent('receive order chat', chatmessage => {
      const messages = [
        {
          _id: chatmessage._id,
          text: chatmessage.message,
          user: {
            ...chatmessage.sender,
            avatar: chatmessage.sender.profile.photo || undefined
          },
          createdAt: chatmessage.createdAt
        }
      ];

      if (this.chatSound) {
        this.chatSound.playAsync();
      }

      this.setState(prevState => ({
        messages: GiftedChat.append(prevState.messages, messages)
      }));
    });
  }

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(this.props.chats) !== JSON.stringify(nextProps.chats)) {
      const { chatmessage } = nextProps.chats;

      if (chatmessage) {
        const messages = chatmessage.map(item => ({
          ...item,
          text: item.message,
          user: {
            ...item.sender,
            avatar: item.sender.profile.photo || undefined
          }
        }));
        this.setState(prevState => ({
          messages: GiftedChat.append(prevState.messages, messages)
        }));
      }
    }
  }

  componentWillUnmount() {
    const { orderId } = this.props;
    sendEvent('unsubscribe order', orderId);
    removeEvent('connected order chat');
    this.props.unloadChat();
  }

  async setupChatSound() {
    const soundObject = new Audio.Sound();
    try {
      await soundObject.loadAsync(definite);
      this.chatSound = soundObject;
    } catch (error) {
      console.log(error);
      this.chatSound = undefined;
    }
  }

  submitMessage(messages) {
    const { channel, user } = this.state;
    const { text } = messages[0];
    console.log(channel)

    if (text && channel) {
      // sendEvent('message order chat', {
      //   name: channel.name,
      //   chat: {
      //     sender: user._id,
      //     message: text,
      //     channel: channel._id
      //   }
      // });
      // const obj = {
      //   name: channel.name,
      //   chat: {
      //     sender: user._id,
      //     messages: text,
      //     channel: channel._id
      //   }
      // }
      // console.log(obj)

      // this.setState(previousState => ({
      //   messages: GiftedChat.append(previousState.messages, messages)
      // }));
    }
  }

  render() {
    const { user } = this.state

    return (
      <Container style={{ backgroundColor: '#ffffff' }}>
        <GiftedChat
          placeholder="Type a message"
          messages={this.state.messages}
          user={{
            ...user,
            avatar: user.profile ? user.profile.photo : undefined
          }}
          alwaysShowSend
          renderAvatarOnTop
          onSend={messages => this.submitMessage(messages)}
          renderSend={props => (
            <Button
              onPress={() => {
                props.onSend({ text: props.text.trim() }, true);
              }}
            >
              <Icon name="send" />
            </Button>
          )}
        />
      </Container>
    );
  }
}

export default OrderChat;
