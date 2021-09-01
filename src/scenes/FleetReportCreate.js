import React, { Component } from 'react';
import { Container } from 'native-base';
import { Actions } from 'react-native-router-flux';

import ReportForm from '../containers/ReportForm';

class FleetReportCreate extends Component {
  onSubmitReport = report => {
    this.props.createFleetReport(report);

    Actions.reportlist();
  };

  render() {
    return (
      <Container>
        <ReportForm onSubmitReport={this.onSubmitReport} formType="create" />
      </Container>
    );
  }
}

export default FleetReportCreate;
