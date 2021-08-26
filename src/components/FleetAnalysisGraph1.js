import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
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

class FleetAnalysisGraph1 extends Component {
  setDatas(datas) {
    console.log('setDatas', datas);
    const { startDate, endDate, used, ttl } = this.props;

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

      let weekCount = 0;
      const weeklyData = [
        ...datas
          .reduce((map, item) => {
            const { week } = item;
            let prev = map.get(week);

            if (prev) {
              weekCount = week;
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

      let monthCount = 0;
      const monthlyData = [
        ...datas
          .reduce((map, item) => {
            const { month } = item;
            let prev = map.get(month);

            if (prev) {
              monthCount = month;
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

      const weeklyData1 = [];
      const wCount = [];
      for (let index = 0; index < weekCount; index++) {
        const theData = datas.filter(p => p.week === index + 1);
        theData.map((item, i) => {
          const day = item.date.split(', ')[1];
          if (index === 0) {
            weeklyData1.push({
              date: day,
              [index + 1]: item[used]
            });
          } else {
            const theIndex = weeklyData1.findIndex(p => p.date === day);
            if (theIndex !== -1) {
              const data = weeklyData1[theIndex];
              weeklyData1[theIndex] = {
                ...data,
                [index + 1]: item[used]
              };
            }
          }
        });
        wCount.push(index + 1);
      }

      console.log('weeklyData1', weeklyData1);

      return {
        dailyData: datas,
        weeklyData,
        monthlyData,
        weekCount: wCount,
        monthCount
      };
    }

    return {};
  }

  render() {
    const { title, used, name, unit, total, ttl, datas } = this.props;
    const {
      dailyData,
      weeklyData,
      monthlyData,
      weekCount,
      monthCount
    } = this.setDatas(datas);

    console.log('dailyData', dailyData);
    console.log('weeklyData', weeklyData);

    const dataDailyData = [];
    if (dailyData && dailyData.length > 0) {
      dailyData.map(x => {
        dataDailyData.push({
          x: x.date,
          y: x[used]
        });
      });
    }

    const dataWeeklyData = [];
    if (weeklyData && weeklyData.length > 0) {
      weeklyData.map(x => {
        dataWeeklyData.push({
          x: x.date,
          y: x[used]
        });
      });
    }

    console.log('dataDailyData', dataDailyData);
    console.log('dataWeeklyData', dataWeeklyData);

    return (
      <Container>
        <Content padder>
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
        </Content>
      </Container>
    );
  }
}

export default FleetAnalysisGraph1;
