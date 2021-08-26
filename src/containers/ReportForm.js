import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SafeAreaView, ScrollView, View } from 'react-native';
import {
  Container,
  Content,
  Text,
  Footer,
  FooterTab,
  Button,
  Toast,
  Body,
  Header,
  Title,
  Left, 
  Right
} from 'native-base';
import BackButton from '../components/BackButton';
import MainReportForm from '../components/MainReportForm';
import MaintenanceForm from '../components/MaintenanceForm';
import AccidentForm from '../components/AccidentForm';

class ReportForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentCategory: props.fleetreport
        ? props.fleetreport.category
        : undefined
    };
  }

  changeCategory = currentCategory => {
    this.setState({ currentCategory });
  };

  submitReport = () => {
    const { currentCategory } = this.state;
    const { fleetreport } = this.props;

    const toastConfig = {
      text: '',
      type: 'warning',
      buttonText: 'Okay',
      duration: 2000,
      position: 'top'
    };
    const mainCheck = this.mainReport.form.getValue();

    const { pool, fleet } = this.mainReport.state;

    if (!mainCheck || !pool || !fleet) {
      return Toast.show({
        ...toastConfig,
        text: 'Some info missing inside main card'
      });
    }

    let detail;

    if (currentCategory === 'Maintenance') {
      detail = this.maintenance.form.getValue();

      if (!detail) {
        return Toast.show({
          ...toastConfig,
          text: 'Some info missing inside Maintenance card'
        });
      }
    } else if (currentCategory === 'Accident') {
      const victimAndDamage = this.accident.form.getValue();

      const accRestState = this.accident.state;
      const { date, address, location, photos } = accRestState;
      const { coordinates } = location;

      if (!victimAndDamage || !date || !address || !coordinates) {
        return Toast.show({
          ...toastConfig,
          text: 'Some info missing inside Accident card'
        });
      }

      const imageIds = Array.isArray(photos)
        ? photos.map(image => image._id)
        : [];

      detail = {
        ...victimAndDamage,
        date,
        address,
        location,
        photos: imageIds
      };
    }

    const report = {
      ...mainCheck,
      pool,
      fleet,
      detail: undefined
    };

    if (this.props.formType === 'create') {
      delete report._id;
    }

    if (
      this.props.formType === 'update' &&
      fleetreport.category === mainCheck.category
    ) {
      report.detail =
        fleetreport && fleetreport.detail ? fleetreport.detail._id : undefined;
    }

    if (currentCategory === 'Maintenance') {
      report.maintenance = detail;
    } else if (currentCategory === 'Accident') {
      report.accident = detail;
    }

    return this.props.onSubmitReport(report);
  };

  render() {
    const { fleetreport } = this.props;

    const mainProps = {};
    const accidentProps = {};
    const maintenanceProps = {};

    if (fleetreport) {
      mainProps._id = fleetreport._id;
      mainProps.title = fleetreport.title;
      mainProps.category = fleetreport.category;
      mainProps.isOk = fleetreport.isOk;
      mainProps.notes = fleetreport.notes;
      mainProps.pool = fleetreport.pool ? fleetreport.pool._id : undefined;
      mainProps.fleet = fleetreport.fleet ? fleetreport.fleet._id : undefined;

      if (fleetreport.category === 'Accident') {
        accidentProps.detail = fleetreport.detail
          ? fleetreport.detail
          : undefined;
      } else if (fleetreport.category === 'Maintenance') {
        maintenanceProps.check = fleetreport.detail
          ? fleetreport.detail.check
          : undefined;
        maintenanceProps.usage = fleetreport.detail
          ? fleetreport.detail.usage
          : undefined;
      }
    }

    return (
      <Container style={{ backgroundColor: '#fff' }}>
        <Header>
          <Left style={{ flex: 0.5 }}>
            <BackButton iconStyle={{ color: 'black' }} />
          </Left>
          <Body style={{ flex: 1 }}>
            <Title >
              Create Report
            </Title>
          </Body>
          <Right style={{ flex: 0.5 }}>
            <View></View>
          </Right>
        </Header>
        <ScrollView style={{ padding: 12 }}>
          <View>
            <MainReportForm
              changeCategory={this.changeCategory}
              ref={_mainReport => {
                this.mainReport = _mainReport;
              }}
              {...mainProps}
            />
            {this.state.currentCategory === 'Maintenance' && (
              <MaintenanceForm
                ref={_maintenance => {
                  this.maintenance = _maintenance;
                }}
                {...maintenanceProps}
              />
            )}
            {this.state.currentCategory === 'Accident' && (
              <AccidentForm
                ref={_accident => {
                  this.accident = _accident;
                }}
                {...accidentProps}
              />
            )}
          </View>
        </ScrollView>
        <Footer>
          <FooterTab>
            <Button full primary onPress={() => this.submitReport()}>
              <Text style={{ color: '#fff', fontWeight: '500' }}>Submit</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

ReportForm.propTypes = {
  onSubmitReport: PropTypes.func.isRequired,
  fleetreport: PropTypes.shape({}),
  formType: PropTypes.oneOf(['create', 'update'])
};

ReportForm.defaultProps = {
  fleetreport: {
    detail: {
      _id: null
    }
  },
  formType: 'update'
};

export default ReportForm;
