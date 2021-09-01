import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
// import { Avatar } from 'antd';
import {
  Container,
  Content,
  Card,
  CardItem,
  Body,
  Text,
  List,
  ListItem,
  Left,
  Right
} from 'native-base';
import UserImage from '../components/UserImage';

const style = StyleSheet.create({
  cardHeader: {
    backgroundColor: '#F0EFF5',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    paddingTop: 10,
    paddingBottom: 10
  },
  cardHeaderText: {
    fontSize: 15,
    fontWeight: 'bold'
  },
  containerNormal: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: -250,
    marginTop: -30,
    marginBottom: -30
  },
  miniContainer: {
    marginBottom: -250
  },
  modal: {
    backgroundColor: 'rgba(0,0,0,.8)',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },
  flexCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  container1: {
    flex: 1
  },
  userImage: {
    left: -10
  }
});

class FleetContribAnalysis extends Component {
  render() {
    const { analysis } = this.props;
    const {
      mostFleetOrders,
      mostFleetMaintenances,
      mostFleetAccidents,
      mostFleetDriver
    } = analysis;

    return (
      <Container>
        <Content padder>
          <Card>
            <CardItem header style={style.cardHeader}>
              <Body>
                <Text style={style.cardHeaderText}>Most Fleet Ordered</Text>
              </Body>
            </CardItem>
            <CardItem style={style.containerNormal}>
              {mostFleetOrders &&
                mostFleetOrders.length > 0 && (
                  <List
                    dataArray={mostFleetOrders}
                    contentContainerStyle={{ backgroundColor: '#ffffff' }}
                    renderRow={(item, index) => (
                      <ListItem
                        key={item._id}
                        avatar
                        last={index === mostFleetOrders.length - 1}
                        onPress={() => {
                          // go to driver's profile
                        }}
                      >
                        <Left style={{ flex: 0.1 }}>
                          <UserImage user={item} size="small" mode="square" />
                        </Left>
                        <Body>
                          <Text>{item.name}</Text>
                        </Body>
                        <Right>
                          <Text>{item.total}</Text>
                        </Right>
                      </ListItem>
                    )}
                  />
                )}
            </CardItem>
          </Card>
          <Card>
            <CardItem header style={style.cardHeader}>
              <Body>
                <Text style={style.cardHeaderText}>
                  Most Fleet Got Maintenance
                </Text>
              </Body>
            </CardItem>
            <CardItem style={style.containerNormal}>
              {mostFleetMaintenances &&
                mostFleetMaintenances.length > 0 && (
                  <List
                    dataArray={mostFleetMaintenances}
                    contentContainerStyle={{ backgroundColor: '#ffffff' }}
                    renderRow={(item, index) => (
                      <ListItem
                        key={item._id}
                        avatar
                        last={index === mostFleetMaintenances.length - 1}
                        onPress={() => {
                          // go to driver's profile
                        }}
                      >
                        <Left style={{ flex: 0.1 }}>
                          <UserImage user={item} size="small" mode="square" />
                        </Left>
                        <Body>
                          <Text>{item.name}</Text>
                        </Body>
                        <Right>
                          <Text>{item.total}</Text>
                        </Right>
                      </ListItem>
                    )}
                  />
                )}
            </CardItem>
          </Card>
          <Card>
            <CardItem header style={style.cardHeader}>
              <Body>
                <Text style={style.cardHeaderText}>
                  Most Fleet Got Accident
                </Text>
              </Body>
            </CardItem>
            <CardItem style={style.containerNormal}>
              {mostFleetAccidents &&
                mostFleetAccidents.length > 0 && (
                  <List
                    dataArray={mostFleetAccidents}
                    contentContainerStyle={{ backgroundColor: '#ffffff' }}
                    renderRow={(item, index) => (
                      <ListItem
                        key={item._id}
                        avatar
                        last={index === mostFleetAccidents.length - 1}
                        onPress={() => {
                          // go to driver's profile
                        }}
                      >
                        <Left style={{ flex: 0.1 }}>
                          <UserImage user={item} size="small" mode="square" />
                        </Left>
                        <Body>
                          <Text>{item.name}</Text>
                        </Body>
                        <Right>
                          <Text>{item.total}</Text>
                        </Right>
                      </ListItem>
                    )}
                  />
                )}
            </CardItem>
          </Card>

          <Card>
            <CardItem header style={style.cardHeader}>
              <Body>
                <Text style={style.cardHeaderText}>
                  Most Contribution by Driver
                </Text>
              </Body>
            </CardItem>
            <CardItem style={style.containerNormal}>
              {mostFleetDriver &&
                mostFleetDriver.length > 0 && (
                  <List
                    dataArray={mostFleetDriver}
                    contentContainerStyle={{ backgroundColor: '#ffffff' }}
                    renderRow={(item, index) => (
                      <ListItem
                        key={item._id}
                        avatar
                        last={index === mostFleetDriver.length - 1}
                        onPress={() => {
                          // go to driver's profile
                        }}
                      >
                        <Left style={{ flex: 0.1 }}>
                          <UserImage
                            user={item}
                            size="small"
                            mode="square"
                            styleContainer={style.userImage}
                          />
                        </Left>
                        <Body>
                          <Text>{item.name}</Text>
                        </Body>
                        <Right>
                          <Text>{item.total}</Text>
                        </Right>
                      </ListItem>
                    )}
                  />
                )}
            </CardItem>
          </Card>
        </Content>
      </Container>
    );
  }
}

export default FleetContribAnalysis;
