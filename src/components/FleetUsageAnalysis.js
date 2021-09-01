import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { VictoryPie, VictoryLegend } from 'victory-native';
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

class FleetUsageAnalysis extends Component {
  render() {
    const { analysis } = this.props;
    const { filledSeats, averageUsedFleet, averageUsedDriver } = analysis;
    let { pieFilledSeats, pieAverageUsedFleet, pieAverageUsedDriver } = [];
    if (filledSeats && filledSeats.length > 0) {
      pieFilledSeats = filledSeats
        .map(entry => {
          const x = `${Number(entry.total.toFixed(0))}%`;
          const y = Number(entry.total.toFixed(0));

          return { x, y };
        })
        .filter(item => item);
    }

    if (averageUsedFleet && averageUsedFleet.length > 0) {
      pieAverageUsedFleet = averageUsedFleet
        .map(entry => {
          const x = `${Number(entry.total.toFixed(0))}%`;
          const y = Number(entry.total.toFixed(0));

          return { x, y };
        })
        .filter(item => item);
    }

    if (averageUsedDriver && averageUsedDriver.length > 0) {
      pieAverageUsedDriver = averageUsedDriver
        .map(entry => {
          const x = `${Number(entry.total.toFixed(0))}%`;
          const y = Number(entry.total.toFixed(0));

          return { x, y };
        })
        .filter(item => item);
    }

    return (
      <Container>
        <Content padder>
          <Card>
            <CardItem header style={style.cardHeader}>
              <Body>
                <Text style={style.cardHeaderText}>Average Seat Occupancy</Text>
              </Body>
            </CardItem>
            <CardItem style={style.miniContainer}>
              <VictoryLegend
                x={5}
                y={5}
                orientation="horizontal"
                data={[
                  { name: 'Empty Seats', symbol: { fill: typeColor[0] } },
                  { name: 'Filled Seats', symbol: { fill: typeColor[1] } }
                ]}
              />
            </CardItem>
            <CardItem style={style.container}>
              <VictoryPie
                style={{
                  labels: {
                    fill: 'white',
                    stroke: 'none',
                    fontSize: 12
                  }
                }}
                labelRadius={50}
                data={pieFilledSeats}
                colorScale={typeColor}
              />
            </CardItem>
          </Card>
          <Card>
            <CardItem header style={style.cardHeader}>
              <Body>
                <Text style={style.cardHeaderText}>Fleet Used Graph</Text>
              </Body>
            </CardItem>
            <CardItem style={style.miniContainer}>
              <VictoryLegend
                x={5}
                y={5}
                orientation="horizontal"
                data={[
                  { name: 'Fleet Used', symbol: { fill: typeColor[0] } },
                  { name: 'Fleet Not Used', symbol: { fill: typeColor[1] } }
                ]}
              />
            </CardItem>
            <CardItem style={style.container}>
              <VictoryPie
                style={{
                  labels: {
                    fill: 'white',
                    stroke: 'none',
                    fontSize: 12
                  }
                }}
                labelRadius={50}
                data={pieAverageUsedFleet}
                colorScale={typeColor}
              />
            </CardItem>
          </Card>
          <Card>
            <CardItem header style={style.cardHeader}>
              <Body>
                <Text style={style.cardHeaderText}>
                  Average Driver Productivity
                </Text>
              </Body>
            </CardItem>
            <CardItem style={style.miniContainer}>
              <VictoryLegend
                x={5}
                y={5}
                orientation="horizontal"
                data={[
                  { name: 'Driver Work', symbol: { fill: typeColor[0] } },
                  { name: 'Driver Idle', symbol: { fill: typeColor[1] } }
                ]}
              />
            </CardItem>
            <CardItem style={style.container}>
              <VictoryPie
                style={{
                  labels: {
                    fill: 'white',
                    stroke: 'none',
                    fontSize: 12
                  }
                }}
                labelRadius={50}
                data={pieAverageUsedDriver}
                colorScale={typeColor}
              />
            </CardItem>
          </Card>
        </Content>
      </Container>
    );
  }
}

export default FleetUsageAnalysis;
