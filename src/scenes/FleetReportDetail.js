import React, { Component } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import uuidv1 from 'uuid/v1';
import moment from 'moment';
// import 'moment/locale/id';
import {
  Container,
  Content,
  Card,
  CardItem,
  Left,
  Right,
  Body,
  Text,
  Spinner,
  Thumbnail,
  Badge,
  Header,
  Title,
  Button
} from 'native-base';

import { Actions } from 'react-native-router-flux';
import config from '../modules/constants/config';
import AccidentMap from '../containers/AccidentMap';
import BackButton from '../components/BackButton';
import navigationStyle from '../constants/navigation';

const FleetCardGrid = ({ title, rightComponent, infos }) => (
  <Card>
    <CardItem
      header
      style={{ borderBottomWidth: 1, borderBottomColor: '#ccc' }}
    >
      <Left style={{ flex: 0.7 }}>
        <Text style={{ marginLeft: 0 }}>{title}</Text>
      </Left>
      <Right style={{ flex: 0.3 }}>{rightComponent}</Right>
    </CardItem>
    {infos.map(({ name, value }, index) => (
      <CardItem key={uuidv1()} footer={index === infos.length - 1}>
        <Left style={{ flex: 0.3 }}>
          <Text note style={{ marginLeft: 0 }}>
            {name}
          </Text>
        </Left>
        <Body>
          <Text>{value}</Text>
        </Body>
      </CardItem>
    ))}
  </Card>
);

const MaintenanceCard = ({ title, infos }) => (
  <Card>
    <CardItem
      header
      style={{ borderBottomWidth: 1, borderBottomColor: '#ccc' }}
    >
      <Text style={{ marginLeft: 0 }}>{title}</Text>
    </CardItem>
    {infos.map(({ name, condition, value, action, info }) => (
      <CardItem key={uuidv1()}>
        <Body style={{ flex: 0.7 }}>
          <Text style={{ marginLeft: 0 }}>{name}</Text>
          <Text>{value}</Text>
          {!!action && <Text>{action}</Text>}
          {!!info && <Text note>{info}</Text>}
        </Body>
        {typeof condition !== 'undefined' && (
          <Right style={{ flex: 0.3 }}>
            <Badge
              style={{
                height: 24,
                backgroundColor: condition ? '#4BE1AB' : '#FE5339'
              }}
            >
              <Text
                style={{
                  color: '#ffffff',
                  fontSize: 12,
                  lineHeight: 22
                }}
              >
                {condition ? 'Good' : 'Bad'}
              </Text>
            </Badge>
          </Right>
        )}
      </CardItem>
    ))}
  </Card>
);

const AccidentCard = ({ title, labels, values }) => (
  <Card>
    <CardItem
      header
      style={{ borderBottomWidth: 1, borderBottomColor: '#ccc' }}
    >
      <Text style={{ marginLeft: 0 }}>{title}</Text>
    </CardItem>
    {values.map(value => (
      <CardItem
        key={uuidv1()}
        style={{
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          borderBottomWidth: 1,
          borderBottomColor: '#ccc'
        }}
      >
        {labels.map(({ name, key }) => (
          <View key={uuidv1()}>
            <Text note>{name}</Text>
            <Text>{value[key]}</Text>
          </View>
        ))}
      </CardItem>
    ))}
  </Card>
);

class FleetReportDetail extends Component {
  componentWillMount() {
    console.log('FleetReportDetail willMount');
    const { reportId } = this.props;

    this.props.getSingleReport(reportId);
  }

  componentWillUnmount() {
    this.props.unmountSingleReport();
  }

  _renderRightButton = () => {
    const { user, single } = this.props;

    if (
      user &&
      single &&
      single.createdBy &&
      user._id === single.createdBy._id
    ) {
      return (
        <Button
          transparent
          onPress={() => Actions.editreport({ reportId: single._id })}
          style={{ paddingLeft: 0, paddingRight: 0 }}
        >
          <Text style={navigationStyle.navbarProps.titleStyle}>Edit</Text>
        </Button>
      );
    }

    return <Button transparent />;
  };

  render() {
    console.log('FleetReportDetail render');

    const { single } = this.props;

    return (
      <Container>
        <Header style={navigationStyle.navbarProps.navigationBarStyle}>
          <Left style={{ flex: 0.5 }}>
            <BackButton iconStyle={{ color: this.props.tintColor }} />
          </Left>
          <Body style={{ flex: 1 }}>
            <Title style={navigationStyle.navbarProps.titleStyle}>
              Report Detail
            </Title>
          </Body>
          <Right style={{ flex: 0.5 }}>{this._renderRightButton()}</Right>
        </Header>
        <Content>
          {typeof single === 'object' && Object.keys(single).length > 0 ? (
            <View style={{ padding: 12 }}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                {/* <Thumbnail
                  large
                  source={{ uri: single.updatedBy.profile.photo }}
                /> */}
                <Text>{single.updatedBy.name}</Text>
                <Text>{single.title}</Text>
                <Text note style={{ color: '#273D52' }}>
                  Last updated:{' '}
                  {moment(single.updatedAt).format('DD MMMM YYYY')}
                </Text>
              </View>
              <FleetCardGrid
                title="Main Information"
                rightComponent={
                  <Badge
                    style={{
                      height: 24,
                      backgroundColor: single.isOk ? '#4BE1AB' : '#FE5339'
                    }}
                  >
                    <Text
                      style={{
                        color: '#ffffff',
                        fontSize: 12,
                        lineHeight: 22
                      }}
                    >
                      {single.isOk ? 'Good' : 'Damaged'}
                    </Text>
                  </Badge>
                }
                infos={[
                  { name: 'Pool', value: single.pool.name },
                  { name: 'Fleet', value: single.fleet.plateNumber },
                  { name: 'Type', value: single.category }
                ]}
              />
              <Card>
                <CardItem
                  header
                  style={{ borderBottomWidth: 1, borderBottomColor: '#ccc' }}
                >
                  <Text>Notes</Text>
                </CardItem>
                <CardItem>
                  <Text>{single.notes || 'No notes written'}</Text>
                </CardItem>
              </Card>
              {single.category === 'Maintenance' &&
                single.detail &&
                Array.isArray(single.detail.check) && (
                  <MaintenanceCard
                    title="Maintenance Check List"
                    infos={single.detail.check.map(item => ({
                      name: item.name,
                      condition: item.good,
                      value: `Action: ${item.action ? item.actionName : '-'}`,
                      info: `Info ${item.info || '-'}`
                    }))}
                  />
                )}
              {single.category === 'Maintenance' &&
                single.detail &&
                Array.isArray(single.detail.usage) && (
                  <FleetCardGrid
                    title="Maintenance Usage List"
                    infos={single.detail.usage.map(item => ({
                      name: item.name,
                      value: `HI: ${item.hi || 0}. SHI: ${item.shi || 0}`
                    }))}
                  />
                )}
              {single.category === 'Accident' &&
                single.detail &&
                single.detail.location &&
                Array.isArray(single.detail.location.coordinates) &&
                single.detail.location.coordinates.length === 2 && (
                  <AccidentMap
                    title={single.detail.address}
                    location={single.detail.location}
                  />
                )}
              {single.category === 'Accident' &&
                single.detail && (
                  <FleetCardGrid
                    title="Accident Detail"
                    infos={[
                      {
                        name: 'Date time',
                        value: moment(single.detail.date).format(
                          'DD MMMM YYYY, [pukul] HH:mm'
                        )
                      },
                      {
                        name: 'Address',
                        value: single.detail.address
                      }
                    ]}
                  />
                )}
              {single.category === 'Accident' &&
                single.detail &&
                Array.isArray(single.detail.photos) &&
                single.detail.photos.length > 0 && (
                  <Card>
                    <CardItem
                      header
                      style={{
                        borderBottomWidth: 1,
                        borderBottomColor: '#ccc'
                      }}
                    >
                      <Text style={{ marginLeft: 0 }}>Accident Photos</Text>
                    </CardItem>
                    <CardItem>
                      {single.detail.photos.map(item => (
                        <TouchableOpacity
                          onPress={() =>
                            Actions.openimage({
                              sourceImage: `${config.api}${item.source}`
                            })
                          }
                          key={item._id}
                          style={{ flex: 0.33 }}
                        >
                          {/* <Image
                            source={{ uri: `${config.api}${item.source}` }}
                            resizeMode="cover"
                            style={{ height: 100 }}
                          /> */}
                        </TouchableOpacity>
                      ))}
                    </CardItem>
                  </Card>
                )}
              {single.category === 'Accident' &&
                single.detail &&
                Array.isArray(single.detail.damage) &&
                single.detail.damage.length > 0 && (
                  <AccidentCard
                    title="Damage List"
                    labels={[
                      { name: 'Description', key: 'description' },
                      { name: 'Follow Up', key: 'followUp' }
                    ]}
                    values={single.detail.damage}
                  />
                )}
              {single.category === 'Accident' &&
                single.detail &&
                Array.isArray(single.detail.victim) &&
                single.detail.victim.length > 0 && (
                  <AccidentCard
                    title="Victim List"
                    labels={[
                      { name: 'Name', key: 'name' },
                      { name: 'Age', key: 'age' },
                      { name: 'Condition', key: 'condition' },
                      { name: 'Information', key: 'info' }
                    ]}
                    values={single.detail.victim}
                  />
                )}
            </View>
          ) : (
            <Spinner />
          )}
        </Content>
      </Container>
    );
  }
}

export default FleetReportDetail;
