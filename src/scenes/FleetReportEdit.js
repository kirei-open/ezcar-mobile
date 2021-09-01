import React, { Component } from 'react';
import { Container } from 'native-base';
import { Actions } from 'react-native-router-flux';

import ReportForm from '../containers/ReportForm';

class FleetReportEdit extends Component {
  onSubmitReport = report => {
    const { single } = this.props;
    this.props.updateFleetReport(single._id, report);
    this.props.unmountSingleReport();

    Actions.replace('reportlist');
  };

  render() {
    const { single } = this.props;
    return (
      <Container>
        <ReportForm
          onSubmitReport={this.onSubmitReport}
          formType="update"
          fleetreport={single}
        />
      </Container>
    );
  }
}

export default FleetReportEdit;
