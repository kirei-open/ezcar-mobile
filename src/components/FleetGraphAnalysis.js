import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import {
  VictoryChart,
  VictoryLine,
  VictoryAxis,
  VictoryZoomContainer,
  VictoryBrushContainer
} from 'victory-native';
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
  },
  graphArea: {
    marginLeft: 0,
    marginRight: 0,
    paddingLeft: 0,
    paddingRight: 0
  }
});

class FleetGraphAnalysis extends Component {
  constructor() {
    super();
    this.state = {
      zoomDomain: {}
    };

    this.handleZoom = this.handleZoom.bind(this);
  }

  handleZoom(domain) {
    this.setState({ zoomDomain: domain });
  }

  render() {
    const { analysis } = this.props;
    const { averageFleetGraph, filledChart, averageDriverGraph } = analysis;
    let { areAverageFleetGraph, areFilledChart, areAverageDriverGraph } = [];
    

    if (averageFleetGraph && averageFleetGraph.length > 0) {
      areAverageFleetGraph = averageFleetGraph
        .map(entry => {
          const d = entry._id.split('/');
          const y = Number(entry.usedFleet);
          const x = new Date(d[2], d[1] - 1, d[0]);
          return { x, y };
        })
        .sort((a, b) => new Date(b.x) - new Date(a.x));
    }

    if (filledChart && filledChart.length > 0) {
      areFilledChart = filledChart
        .map(entry => {
          const d = entry._id.split('/');
          const y = Number(entry.average);
          const x = new Date(d[2], d[1] - 1, d[0]);
          return { x, y };
        })
        .sort((a, b) => new Date(b.x) - new Date(a.x));
    }

    if (averageDriverGraph && averageDriverGraph.length > 0) {
      areAverageDriverGraph = averageDriverGraph
        .map(entry => {
          const d = entry._id.split('/');
          const y = Number(entry.usedDriver);
          const x = new Date(d[2], d[1] - 1, d[0]);
          return { x, y };
        })
        .sort((a, b) => new Date(b.x) - new Date(a.x));
    }

    return (
      <Container>
        <Content padder>
          <Card style={style.graphArea}>
            <CardItem header style={style.cardHeader}>
              <Body>
                <Text style={style.cardHeaderText}>Seat Occupancy Graph</Text>
              </Body>
            </CardItem>
            <VictoryChart
              padding={{ top: 25, left: 50, right: 70, bottom: 50 }}
              scale={{ x: 'time' }}
              containerComponent={
                <VictoryZoomContainer
                  zoomDimension="x"
                  zoomDomain={
                    Object.keys(this.state.zoomDomain).length !== 0
                      ? this.state.zoomDomain
                      : {
                          x: [
                            areFilledChart[0].x,
                            areFilledChart[areFilledChart.length - 1].x
                          ]
                        }
                  }
                  onZoomDomainChange={this.handleZoom}
                />
              }
            >
              <VictoryLine
                style={{
                  data: { stroke: typeColor[1] }
                }}
                data={areFilledChart}
              />
            </VictoryChart>
            <VictoryChart
              padding={{ top: 0, left: 0, right: 40, bottom: 30 }}
              height={100}
              scale={{ x: 'time' }}
              containerComponent={
                <VictoryBrushContainer
                  brushDimension="x"
                  brushDomain={
                    Object.keys(this.state.zoomDomain).length !== 0
                      ? this.state.zoomDomain
                      : {
                          x: [
                            areFilledChart[0].x,
                            areFilledChart[areFilledChart.length - 1].x
                          ]
                        }
                  }
                  onBrushDomainChange={this.handleZoom}
                />
              }
            >
              <VictoryAxis tickFormat={x => new Date(x).getFullYear()} />
              <VictoryLine
                style={{
                  data: { stroke: typeColor[1] }
                }}
                data={areFilledChart}
              />
            </VictoryChart>
          </Card>
          <Card style={style.graphArea}>
            <CardItem header style={style.cardHeader}>
              <Body>
                <Text style={style.cardHeaderText}>Fleet Used Graph</Text>
              </Body>
            </CardItem>
            <VictoryChart
              padding={{ top: 25, left: 50, right: 70, bottom: 50 }}
              scale={{ x: 'time' }}
              containerComponent={
                <VictoryZoomContainer
                  zoomDimension="x"
                  zoomDomain={
                    Object.keys(this.state.zoomDomain).length !== 0
                      ? this.state.zoomDomain
                      : {
                          x: [
                            areAverageFleetGraph[0].x,
                            areAverageFleetGraph[
                              areAverageFleetGraph.length - 1
                            ].x
                          ]
                        }
                  }
                  onZoomDomainChange={this.handleZoom}
                />
              }
            >
              <VictoryLine
                style={{
                  data: { stroke: typeColor[1] }
                }}
                data={areAverageFleetGraph}
              />
            </VictoryChart>
            <VictoryChart
              padding={{ top: 0, left: 0, right: 40, bottom: 30 }}
              height={100}
              scale={{ x: 'time' }}
              containerComponent={
                <VictoryBrushContainer
                  brushDimension="x"
                  brushDomain={
                    Object.keys(this.state.zoomDomain).length !== 0
                      ? this.state.zoomDomain
                      : {
                          x: [
                            areAverageFleetGraph[0].x,
                            areAverageFleetGraph[
                              areAverageFleetGraph.length - 1
                            ].x
                          ]
                        }
                  }
                  onBrushDomainChange={this.handleZoom}
                />
              }
            >
              <VictoryAxis tickFormat={x => new Date(x).getFullYear()} />
              <VictoryLine
                style={{
                  data: { stroke: typeColor[1] }
                }}
                data={areAverageFleetGraph}
              />
            </VictoryChart>
          </Card>
          <Card style={style.graphArea}>
            <CardItem header style={style.cardHeader}>
              <Body>
                <Text style={style.cardHeaderText}>
                  Driver Productivity Graph
                </Text>
              </Body>
            </CardItem>
            <VictoryChart
              padding={{ top: 25, left: 50, right: 70, bottom: 50 }}
              scale={{ x: 'time' }}
              containerComponent={
                <VictoryZoomContainer
                  zoomDimension="x"
                  zoomDomain={
                    Object.keys(this.state.zoomDomain).length !== 0
                      ? this.state.zoomDomain
                      : {
                          x: [
                            areAverageDriverGraph[0].x,
                            areAverageDriverGraph[
                              areAverageDriverGraph.length - 1
                            ].x
                          ]
                        }
                  }
                  onZoomDomainChange={this.handleZoom}
                />
              }
            >
              <VictoryLine
                style={{
                  data: { stroke: typeColor[1] }
                }}
                data={areAverageDriverGraph}
              />
            </VictoryChart>
            <VictoryChart
              padding={{ top: 0, left: 0, right: 40, bottom: 30 }}
              height={100}
              scale={{ x: 'time' }}
              containerComponent={
                <VictoryBrushContainer
                  brushDimension="x"
                  brushDomain={
                    Object.keys(this.state.zoomDomain).length !== 0
                      ? this.state.zoomDomain
                      : {
                          x: [
                            areAverageDriverGraph[0].x,
                            areAverageDriverGraph[
                              areAverageDriverGraph.length - 1
                            ].x
                          ]
                        }
                  }
                  onBrushDomainChange={this.handleZoom}
                />
              }
            >
              <VictoryAxis tickFormat={x => new Date(x).getFullYear()} />
              <VictoryLine
                style={{
                  data: { stroke: typeColor[1] }
                }}
                data={areAverageDriverGraph}
              />
            </VictoryChart>
          </Card>
        </Content>
      </Container>
    );
  }
}

export default FleetGraphAnalysis;
