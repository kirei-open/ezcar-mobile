import React from 'react';
import {
  Content,
  Container,
  Card,
  CardItem,
  Text,
  Item,
  Input,
  Label,
  Right,
  Button,
  Footer,
  FooterTab
} from 'native-base';
import { withRouter } from 'react-router-dom';
import { Actions } from 'react-native-router-flux';
import isEmpty from 'lodash/isEmpty';
import debounce from 'lodash/debounce';
import UserForm from '../containers/UserForm';

class EditUser extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.afterSubmit = debounce(this.afterSubmit, 800);
  }

  initialized = false;

  componentWillMount() {
    const { user, single } = this.props;
    // (!single || Object.keys(single).length <= 0)
    if (user && user._id) {
      // console.log(
      //   'EditUser comp_w_mount',
      //   user,
      //   single,
      //   !single || Object.keys(single).length <= 0,
      //   !this.initialized
      // );
      this.props.getSingleUser(user._id);
      this.initialized = true;
    }
  }

  // comment out the below to re-render on every click
  // shouldComponentUpdate(nextProps) {
  //   const { single } = this.props;

  //   if (!this.initialized) {
  //     console.log('EditUser should_comp_update', this.props.single, nextProps.single, this.props.single !== nextProps.single);
  //     return this.props.single !== nextProps.single;
  //   }

  //   return false;
  // }

  componentWillUnmount() {
    // console.log('EditUser comp_w_u_mount');
    this.props.onUserUnload();
  }

  handleSubmit(value) {
    const { user } = this.props;
    // console.log('handleSubmit');
    // console.log(user);
    // if (user && user._id) {
    //   this.props.updateUser(user._id, value);

    //   this.afterSubmit();
    // }
  }

  afterSubmit = () => {
    Actions.settings();
  };

  render() {
    const { inProgress, user, single, token } = this.props;
    // console.log('EditUser render', user, single, token);
    // if (typeof single === 'object' && Object.keys(single).length > 0) {
    //   if (typeof user === 'object') {
    //     const sameUser = user._id === single._id;
    //     const adminUser = user.role === 'admin_super';
    //     const adminCompanyUser =
    //       user.role === 'admin_company' &&
    //       typeof single.company === 'object' &&
    //       single.company._id === user.company;
    //     const adminPoolUser =
    //       user.role === 'admin_pool' &&
    //       typeof single.pool === 'object' &&
    //       single.pool._id === user.pool;
    //     const adminDivisionUser =
    //       user.role === 'admin_division' &&
    //       typeof single.division === 'object' &&
    //       single.division._id === user.division;
    //     if (
    //       sameUser ||
    //       adminUser ||
    //       adminCompanyUser ||
    //       adminPoolUser ||
    //       adminDivisionUser
    //     ) {
    //       return (
    //         <Container>
    //           {!isEmpty(single) && (
    //             <UserForm
    //               handleSubmit={this.handleSubmit}
    //               inProgress={inProgress}
    //               user={user}
    //               detail={single}
    //               token={token}
    //             />
    //           )}
    //         </Container>
    //       );
    //     }
    //   }
    //   return (
    //     <Container>
    //       <Content padder>
    //         <Text>You are not allowed to access this</Text>
    //       </Content>
    //     </Container>
    //   );
    // }

    // return (
    //   <Container>
    //     <Content padder>
    //       <Text>Loading</Text>
    //     </Content>
    //   </Container>
    // );

    return (
      <Container>
        <UserForm
          handleSubmit={this.handleSubmit}
          inProgress={inProgress}
          user={user}
          detail={single}
          token={token}
        />
      </Container>
    );
  }
}

export default EditUser;
