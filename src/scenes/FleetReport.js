import React from 'react';
import { Button, Icon, Container, Tabs, Tab, Content, View, Body, Header, Left, Right, Title } from 'native-base';
import BackButton from '../components/BackButton';
import { Actions } from 'react-native-router-flux';
import ListReport from '../components/ListReport';
import FleetReportShared from '../shared/FleetReport';

class FleetReport extends React.Component {
  render() {
    return (
      <Container>
        <Header>
          <Left style={{ flex: 0.5 }}>
            <BackButton iconStyle={{ color: 'black' }} />
          </Left>
          <Body style={{ flex: 1 }}>
            <Title >
              Fleet Maintanance Report
            </Title>
          </Body>
          <Right style={{ flex: 0.5 }}>
            <Button transparent onPress={() => Actions.addreport()}>
              <Icon name="add" style={{ color: 'black' }} />
            </Button>
          </Right>
        </Header>
        <Tabs locked>
          <Tab heading="Good">
            <FleetReportShared
              UiComponent={ListReport}
              reportQuery={{ isOk: true }}
            />
          </Tab>
          <Tab heading="Damaged">
            <FleetReportShared
              UiComponent={ListReport}
              reportQuery={{ isOk: false }}
            />
          </Tab>
        </Tabs>
      </Container>
    );
  }
}

export default FleetReport;
