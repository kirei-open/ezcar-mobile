import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Actions } from 'react-native-router-flux';
import { View, RefreshControl, FlatList } from 'react-native';
import {
  Content,
  Body,
  List,
  ListItem,
  Text,
  Badge,
  Spinner,
  Left,
  Right,
  Button,
  Thumbnail,
  Container
} from 'native-base';
import uuidv1 from 'uuid/v1';

import moment from 'moment';
// import 'moment/locale/id';

import config from '../modules/constants/config';

class ListReport extends Component {
  state = {
    page: 1,
    refreshing: false,
    fetching: false,
    reports: []
  };

  componentWillMount() {
    this.setState(
      {
        fetching: true
      },
      () => {
        this.loadReportList();
      }
    );
  }

  componentWillReceiveProps(nextProps) {
    if (typeof nextProps.list === 'object' && this.state.fetching) {
      const { reports } = this.state;
      const { fleetreport, page, totalPage } = nextProps.list;

      if (page <= totalPage) {
        const concatReports = reports.concat(fleetreport);
        const uniqueIds = [];
        const newReports = concatReports
          .map(item => {
            if (uniqueIds.indexOf(item._id) < 0) {
              uniqueIds.push(item._id);
              return item;
            }
            return undefined;
          })
          .filter(i => i);

        if (this.state.refreshing) {
          this.setState({
            reports: newReports,
            fetching: false,
            refreshing: false,
            page
          });
        } else {
          this.setState({
            reports: newReports,
            fetching: false,
            page
          });
        }
      } else {
        this.setState({
          fetching: false,
          refreshing: false
        });
      }
    }
  }

  refreshList() {
    this.setState(
      {
        refreshing: true,
        fetching: true
      },
      () => {
        this.loadReportList();
      }
    );
  }

  loadNextPage = () => {
    const { fetching } = this.state;
    if (!fetching) {
      this.setState(
        {
          fetching: true
        },
        () => {
          this.loadReportList({ page: this.state.page + 1 });
        }
      );
    }
  };

  loadReportList = (options = {}) => {
    const { refreshing } = this.state;
    const { reportLimit, reportSort, reportQuery, list } = this.props;
    const { totalPage } = list;

    options.page = options.page || this.state.page;

    let allowed = true;
    if (totalPage && totalPage > 0) {
      if (refreshing) {
        allowed = totalPage >= 1;
      } else {
        allowed = totalPage >= options.page;
      }
    }

    if (allowed) {
      const queryList = {
        page: refreshing ? 1 : options.page,
        sort: reportSort,
        limit: reportLimit,
        q: reportQuery
      };

      this.props.getFleetReportList(queryList);
    } else {
      this.setState({
        refreshing: false,
        fetching: false
      });
    }
  };

  render() {
    const { reportLimit } = this.props;
    const { reports, refreshing, fetching } = this.state;

    return (
      <View style={{ flex: 1 }}>
        {reports.length > 0 ? (
          <FlatList
            data={reports}
            contentContainerStyle={{ backgroundColor: '#ffffff' }}
            onEndReached={() => {
              if (reports.length > reportLimit - 1) {
                this.loadNextPage();
              }
            }}
            onEndReachedThreshold={0.2}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => this.refreshList()}
                tintColor="#3369e7"
              />
            }
            renderItem={(item, index) => (
              <ListItem
                key={item._id}
                first={index === 0}
                last={index === reports.length - 1}
                thumbnail
                button
                onPress={() => Actions.reportdetail({ reportId: item._id })}
              >
                <Left>
                  {Array.isArray(item.fleet.photos) &&
                    item.fleet.photos[0] && (
                      <Thumbnail
                        square
                        small
                        source={{
                          uri: `${config.api}${item.fleet.photos[0].source}`
                        }}
                      />
                    )}
                </Left>
                <Body>
                  <Text>{item.fleet.plateNumber}</Text>
                  <Text note>{item.title}</Text>
                  <Text note>Maintenancer: {item.createdBy.name}</Text>
                </Body>
                <Right>
                  <View>
                    <Badge
                      style={{
                        height: 24,
                        backgroundColor:
                          item.category === 'Maintenance'
                            ? '#4BE1AB'
                            : '#FE5339'
                      }}
                    >
                      <Text
                        style={{
                          color: '#ffffff',
                          fontSize: 12,
                          lineHeight: 22
                        }}
                      >
                        {item.category}
                      </Text>
                    </Badge>
                  </View>
                  <Text note>{moment(item.createdAt).format('DD MMM')}</Text>
                </Right>
              </ListItem>
            )}
          />
        ) : (
          <Container>
            {fetching ? (
              <Spinner />
            ) : (
              <FlatList
                data={['1']}
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={() => this.refreshList()}
                    tintColor="#3369e7"
                  />
                }
                renderItem={() => (
                  <ListItem
                    key={uuidv1()}
                    last
                    style={{ flexDirection: 'column' }}
                  >
                    <Text>Currently no report found :(</Text>
                    <View style={{ padding: 12 }}>
                      <Button primary onPress={() => Actions.addreport()}>
                        <Text>Create Report</Text>
                      </Button>
                    </View>
                  </ListItem>
                )}
                contentContainerStyle={{ backgroundColor: '#ffffff', flex: 1 }}
              />
            )}
          </Container>
        )}
      </View>
    );
  }
}

ListReport.propTypes = {
  reportQuery: PropTypes.shape({}),
  reportLimit: PropTypes.number,
  reportSort: PropTypes.string
};

ListReport.defaultProps = {
  reportQuery: {},
  reportLimit: 10,
  reportSort: '-updatedAt'
};

export default ListReport;
