import React from 'react';
import PropTypes from 'prop-types';
import { Thumbnail } from 'native-base';

import createIcon from '../../assets/calendar-32.png';
import switchedIcon from '../../assets/user-55.png';
import acceptIcon from '../../assets/calendar-23.png';
import rejectIcon from '../../assets/calendar-22.png';
import assignIcon from '../../assets/notepad-15.png';
import lockIcon from '../../assets/calendar-31.png';
import startIcon from '../../assets/placeholder-13.png';
import endIcon from '../../assets/placeholder-14.png';
import joinedIcon from '../../assets/user-53.png';
import suspendIcon from '../../assets/notepad-17.png';
import editedIcon from '../../assets/file-7.png';
import ratedIcon from '../../assets/user-25.png';
import resetPasswordIcon from '../../assets/mail-8.png';

const icons = {
  created: createIcon,
  switched: switchedIcon,
  approved: acceptIcon,
  accepted: acceptIcon,
  rejected: rejectIcon,
  cancelled: rejectIcon,
  assigned: assignIcon,
  locked: lockIcon,
  started: startIcon,
  ended: endIcon,
  joined: joinedIcon,
  suspended: suspendIcon,
  edited: editedIcon,
  rated: ratedIcon,
  'order-created': createIcon,
  'order-switched': switchedIcon,
  'order-approved': acceptIcon,
  'order-accepted': acceptIcon,
  'order-rejected': rejectIcon,
  'order-cancelled': rejectIcon,
  'order-assigned': assignIcon,
  'order-locked': lockIcon,
  'order-confirmed': acceptIcon,
  'order-started': startIcon,
  'order-ended': endIcon,
  'order-joined': joinedIcon,
  'order-suspended': suspendIcon,
  'order-edited': editedIcon,
  'order-rated': ratedIcon,
  'user-reset': resetPasswordIcon
};

class OrderThumbnail extends React.Component {
  render() {
    const { name } = this.props;
    return <Thumbnail square source={icons[name]} small />;
  }
}

OrderThumbnail.propTypes = {
  name: PropTypes.string.isRequired
};

export default OrderThumbnail;
