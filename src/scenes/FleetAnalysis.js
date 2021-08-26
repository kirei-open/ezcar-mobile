import React from 'react';
import moment from 'moment';
import { Actions } from 'react-native-router-flux';
import { Container, Tabs, Tab, Button, Icon } from 'native-base';

import FleetUsageAnalysis from '../components/FleetUsageAnalysis';
import FleetGraphAnalysis from '../components/FleetGraphAnalysis';
import FleetContribAnalysis from '../components/FleetContribAnalysis';

export default class FleetAnalysis extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      startDate: moment()
        .subtract(1, 'months')
        .format('YYYY-MM-DD'),
      endDate: moment().format('YYYY-MM-DD')
    };

    this.onFilterChange = this.onFilterChange.bind(this);
  }

  componentWillMount() {
    const { startDate, endDate } = this.state;

    this.props.getFleetAnalysis({ startDate, endDate });
  }

  componentDidMount() {
    Actions.refresh({
      albumButton: this.renderAlbumButton()
    });
  }

  componentWillUnmount() {
    this.props.onFleetUnload();
  }

  onFilterChange = (startDate, endDate) => {
    this.props.getFleetAnalysis({
      startDate,
      endDate
    });
    this.setState({
      startDate,
      endDate
    });
  };

  goPickDateRange() {
    const { startDate, endDate } = this.state;
    Actions.filterscene({
      onSubmit: this.onFilterChange,
      start: startDate,
      end: endDate
    });
  }

  renderAlbumButton() {
    return (
      <Button
        transparent
        onPress={() => {
          this.goPickDateRange();
        }}
      >
        <Icon name="time" style={{ color: this.props.tintColor }} />
      </Button>
    );
  }

  render() {
    const { analysis } = this.props;

    return (
      <Container>
        <Tabs locked>
          <Tab heading="Usage">
            <FleetUsageAnalysis analysis={analysis} />
          </Tab>
          <Tab heading="Graph">
            <FleetGraphAnalysis analysis={analysis} />
          </Tab>
          <Tab heading="Contribution">
            <FleetContribAnalysis analysis={analysis} />
          </Tab>
        </Tabs>
      </Container>
    );
  }
}
