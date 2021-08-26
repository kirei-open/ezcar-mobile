import React, { Component } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import {
  VictoryChart,
  VictoryBar,
  VictoryLegend,
  VictoryPie,
  VictoryGroup,
  VictoryScatter,
  VictoryLine,
  VictoryAxis,
  VictoryZoomContainer,
  VictoryBrushContainer
} from 'victory-native';
import moment from 'moment';
import { Container, Content, Card, CardItem, Body, Text } from 'native-base';
import { typeColor } from '../modules/constants/chart';

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
  }
});

class FleetAnalysisGraph extends Component {
  setTimelyData() {
    const { startDate, endDate, used, ttl, hourlyData } = this.props;
    const times = [];
    for (
      let s = moment(startDate).toDate();
      s <= moment(endDate).toDate();
      s.setDate(s.getDate() + 1)
    ) {
      const date = moment(s).format('YYYY/MM/DD');
      const date1 = moment(s).format('YYYY/MM/DD, dddd');
      times.push({ key: `${date} 00`, value: `${date1} 00:00 - 01:00` });
      times.push({ key: `${date} 01`, value: `${date1} 01:00 - 02:00` });
      times.push({ key: `${date} 02`, value: `${date1} 02:00 - 03:00` });
      times.push({ key: `${date} 03`, value: `${date1} 03:00 - 04:00` });
      times.push({ key: `${date} 04`, value: `${date1} 04:00 - 05:00` });
      times.push({ key: `${date} 05`, value: `${date1} 05:00 - 06:00` });
      times.push({ key: `${date} 06`, value: `${date1} 06:00 - 07:00` });
      times.push({ key: `${date} 07`, value: `${date1} 07:00 - 08:00` });
      times.push({ key: `${date} 08`, value: `${date1} 08:00 - 09:00` });
      times.push({ key: `${date} 09`, value: `${date1} 09:00 - 10:00` });
      times.push({ key: `${date} 10`, value: `${date1} 10:00 - 11:00` });
      times.push({ key: `${date} 11`, value: `${date1} 11:00 - 12:00` });
      times.push({ key: `${date} 12`, value: `${date1} 12:00 - 13:00` });
      times.push({ key: `${date} 13`, value: `${date1} 13:00 - 14:00` });
      times.push({ key: `${date} 14`, value: `${date1} 14:00 - 15:00` });
      times.push({ key: `${date} 15`, value: `${date1} 15:00 - 16:00` });
      times.push({ key: `${date} 16`, value: `${date1} 16:00 - 17:00` });
      times.push({ key: `${date} 17`, value: `${date1} 17:00 - 18:00` });
      times.push({ key: `${date} 18`, value: `${date1} 18:00 - 19:00` });
      times.push({ key: `${date} 19`, value: `${date1} 19:00 - 20:00` });
      times.push({ key: `${date} 20`, value: `${date1} 20:00 - 21:00` });
      times.push({ key: `${date} 21`, value: `${date1} 21:00 - 22:00` });
      times.push({ key: `${date} 22`, value: `${date1} 22:00 - 23:00` });
      times.push({ key: `${date} 23`, value: `${date1} 23:00 - 24:00` });
    }

    if (hourlyData && hourlyData.length > 0) {
      hourlyData.map(data => {
        const theData = data;
        const key = data._id.split(':')[0];
        theData.key = key; // parseInt(key, 10);

        return theData;
      });

      const modifiedData = [
        ...hourlyData
          .reduce((map, item) => {
            const { key } = item;
            let prev = map.get(key);
            // let title = times[key].value;
            let title = times.filter(p => p.key === key)[0];
            if (title) title = title.value;

            if (prev) {
              prev.title = title;
              prev = {
                ...prev,
                [used]: prev[used] + item[used],
                [ttl]: prev[ttl] + item[ttl]
              };

              map.set(key, Object.assign({}, prev));
            } else {
              const theItem = {
                ...item,
                title
              };
              map.set(key, Object.assign({}, theItem));
            }

            return map;
          }, new Map())
          .values()
      ];

      times.map((time, index) => {
        const theIndex = modifiedData.findIndex(
          item => item.title === time.value
        );
        if (theIndex === -1) {
          const data = modifiedData[index - 1];
          modifiedData.splice(index, 0, {
            _id: time.key,
            title: time.value,
            [used]: 0,
            [ttl]: data ? data[ttl] : 0
          });
        }
      });

      return {
        modifiedData
      };
    }

    return {};
  }

  setWeeklyMonthlyData() {
    const { startDate, endDate, datas, used, ttl } = this.props;

    const days = [];
    for (
      let s = moment(startDate).toDate();
      s <= moment(endDate).toDate();
      s.setDate(s.getDate() + 1)
    ) {
      const date = moment(s).format('YYYY/MM/DD, dddd');
      days.push(date);
    }

    if (days && days.length > 0 && datas && datas.length > 0) {
      days.map((day, index) => {
        const theIndex = datas.findIndex(item => item.date === day);
        if (theIndex === -1) {
          const data = datas[index - 1];
          datas.splice(index, 0, {
            _id: day,
            date: day,
            [used]: 0,
            [ttl]: data ? data[ttl] : 0
          });
        }

        delete datas[index]._id;
        datas[index].week = Math.round((index + 4) / 7);
        datas[index].month = Math.round((index + 15) / 30);
      });

      const weeklyData = [
        ...datas
          .reduce((map, item) => {
            const { week } = item;
            let prev = map.get(week);

            if (prev) {
              prev.date = `Week ${week}`;
              prev = {
                ...prev,
                [used]: prev[used] + item[used],
                [ttl]: prev[ttl] + item[ttl]
              };

              delete prev.week;
              delete prev.month;

              map.set(week, Object.assign({}, prev));
            } else {
              map.set(week, Object.assign({}, item));
            }

            return map;
          }, new Map())
          .values()
      ];

      const monthlyData = [
        ...datas
          .reduce((map, item) => {
            const { month } = item;
            let prev = map.get(month);

            if (prev) {
              prev.date = `Month ${month}`;
              prev = {
                ...prev,
                [used]: prev[used] + item[used],
                [ttl]: prev[ttl] + item[ttl]
              };

              delete prev.month;
              delete prev.month;

              map.set(month, Object.assign({}, prev));
            } else {
              map.set(month, Object.assign({}, item));
            }

            return map;
          }, new Map())
          .values()
      ];

      return {
        dailyData: datas,
        weeklyData,
        monthlyData
      };
    }

    return {};
  }

  render() {
    const { title, used, name, unit, total, ttl, datas } = this.props;
    const { dailyData, weeklyData, monthlyData } = this.setWeeklyMonthlyData();
    const { modifiedData } = this.setTimelyData();

    const dataDailyData = [];
    if (dailyData && dailyData.length > 0) {
      dailyData.map(x => {
        dataDailyData.push({
          x: x.date,
          y: x[used]
        });

        return x;
      });
    }

    const dataModifiedData = [];
    if (modifiedData && modifiedData.length > 0) {
      modifiedData.map(x => {
        dataModifiedData.push({
          x: x._id,
          y: x[used]
        });

        return x;
      });
    }

    const dataWeeklyData = [];
    if (weeklyData && weeklyData.length > 0) {
      weeklyData.map(x => {
        dataWeeklyData.push({
          x: x.date,
          y: x[used]
        });

        return x;
      });
    }

    const dataMonthlyData = [];
    if (monthlyData && monthlyData.length > 0) {
      monthlyData.map(x => {
        dataMonthlyData.push({
          x: x.date,
          y: x[used]
        });

        return x;
      });
    }

    return (
      <Container>
        <ScrollView>
          <Card>
            <CardItem header style={style.cardHeader}>
              <Body>
                <Text style={style.cardHeaderText}>24 Hours {title}</Text>
              </Body>
            </CardItem>
            <CardItem style={style.miniContainer}>
              <VictoryLegend
                orientation="vertical"
                data={[{ name, symbol: { fill: typeColor[1] } }]}
              />
            </CardItem>
            <CardItem style={style.container}>
              <VictoryChart>
                <VictoryBar
                  data={dataModifiedData}
                  style={{
                    data: {
                      fill: typeColor[1]
                    }
                  }}
                />
              </VictoryChart>
            </CardItem>
          </Card>
          <Card>
            <CardItem header style={style.cardHeader}>
              <Body>
                <Text style={style.cardHeaderText}>Daily {title}</Text>
              </Body>
            </CardItem>
            <CardItem style={style.miniContainer}>
              <VictoryLegend
                orientation="horizontal"
                data={[{ name, symbol: { fill: typeColor[1] } }]}
              />
            </CardItem>
            <CardItem style={style.container}>
              <VictoryChart>
                <VictoryBar
                  data={dataDailyData}
                  style={{
                    data: {
                      fill: typeColor[1]
                    }
                  }}
                />
              </VictoryChart>
            </CardItem>
          </Card>
          <Card>
            <CardItem header style={style.cardHeader}>
              <Body>
                <Text style={style.cardHeaderText}>Weekly {title}</Text>
              </Body>
            </CardItem>
            <CardItem style={style.miniContainer}>
              <VictoryLegend
                orientation="horizontal"
                data={[{ name, symbol: { fill: typeColor[3] } }]}
              />
            </CardItem>
            <CardItem style={style.container}>
              <VictoryChart>
                <VictoryBar
                  data={dataWeeklyData}
                  style={{
                    data: {
                      fill: typeColor[3]
                    }
                  }}
                />
              </VictoryChart>
            </CardItem>
          </Card>
          <Card>
            <CardItem header style={style.cardHeader}>
              <Body>
                <Text style={style.cardHeaderText}>Monthly {title}</Text>
              </Body>
            </CardItem>
            <CardItem style={style.miniContainer}>
              <VictoryLegend
                orientation="horizontal"
                data={[{ name, symbol: { fill: typeColor[4] } }]}
              />
            </CardItem>
            <CardItem style={style.container}>
              <VictoryChart>
                <VictoryBar
                  data={dataMonthlyData}
                  style={{
                    data: {
                      fill: typeColor[4]
                    }
                  }}
                />
              </VictoryChart>
            </CardItem>
          </Card>
        </ScrollView>
      </Container>
    );
  }
}

export default FleetAnalysisGraph;
