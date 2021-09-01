const actionButtons = [
  {
    label: 'Assign approver',
    content:
      'Assign dedicated PIC or approver for this order. Fill this form below',
    status: 'switched',
    icon: 'ios-people',
    allowedRoles: ['admin_division'],
    showStatus: [],
    hideStatus: ['switched', 'approved', 'rejected'],
    locked: false,
    otherCondition: () => true
  },
  {
    label: 'Approve order',
    content: 'Are you sure to approve this order?',
    status: 'approved',
    icon: 'ios-checkmark-circle-outline',
    allowedRoles: [],
    showStatus: [],
    hideStatus: ['approved', 'rejected'],
    locked: false,
    otherCondition: (user, data) =>
      (user.role === 'admin_division' && !data.approver) ||
      (data.approver && data.approver === user._id)
  },
  {
    label: 'Reject order',
    content: 'Are you sure to reject this order?',
    status: 'rejected',
    icon: 'ios-close-circle-outline',
    allowedRoles: [],
    showStatus: [],
    hideStatus: [],
    locked: false,
    otherCondition: (user, data) =>
      (user.role === 'admin_division' &&
        data.division === user.division &&
        !data.approver &&
        Array.isArray(data.statuses) &&
        !data.statuses.some(
          item => ['approved', 'rejected'].indexOf(item.status) > -1
        )) ||
      (data.approver &&
        data.approver === user._id &&
        data.division === user.division &&
        Array.isArray(data.statuses) &&
        !data.statuses.some(
          item => ['approved', 'rejected'].indexOf(item.status) > -1
        )) ||
      (data.pool &&
        data.pool._id === user.pool &&
        user.role === 'admin_pool' &&
        Array.isArray(data.statuses) &&
        data.statuses.some(item => item.status === 'approved'))
  },
  {
    label: 'Suspend order',
    content: 'Are you sure to suspend this order?',
    status: 'suspended',
    icon: 'ios-warning-outline',
    allowedRoles: [],
    showStatus: [],
    hideStatus: ['approved', 'rejected'],
    locked: false,
    otherCondition: (user, data) =>
      ((user.role === 'admin_division' && !data.approver) ||
        (data.approver && data.approver === user._id)) &&
      Array.isArray(data.statuses) &&
      data.statuses.some(
        (item, key) =>
          key === data.statuses.length - 1 && item.status !== 'suspended'
      )
  },
  {
    label: 'Reassign driver and fleet',
    content:
      'Assign other driver or fleet for this order. Fill this form below',
    status: 'assigned',
    icon: 'swap-horizontal-outline',
    allowedRoles: ['admin_pool'],
    showStatus: ['approved'],
    hideStatus: [],
    locked: false,
    otherCondition: (user, data) => data.pool && data.pool._id === user.pool
  },
  {
    label: 'Lock order',
    content:
      "Are you sure to lock this order? Other passenger won't be able to join this order",
    status: 'locked',
    icon: 'lock-closed-outline',
    allowedRoles: ['admin_pool'],
    showStatus: ['approved'],
    hideStatus: ['locked'],
    locked: false,
    otherCondition: (user, data) => data.pool && data.pool._id === user.pool
  },
  {
    label: 'Confirm Order',
    content: 'Are you sure to confirm this order?',
    status: 'confirmed',
    icon: 'ios-checkmark-circle-outline',
    allowedRoles: [],
    showStatus: ['locked'],
    hideStatus: ['confirmed', 'started', 'rejected', 'cancelled'],
    locked: true,
    otherCondition: (user, data) => data.driver && data.driver._id === user._id
  },
  {
    label: 'Start order',
    content:
      'Start this order. Press the "OKAY" button ONLY once the passenger is in the vehicle and order is ready to start',
    status: 'started',
    icon: 'ios-share-outline',
    allowedRoles: [],
    showStatus: ['confirmed'],
    hideStatus: ['started', 'rejected'],
    locked: true,
    otherCondition: (user, data) =>
      (user.role === 'admin_pool' &&
        data.pool &&
        data.pool._id === user.pool) ||
      (data.driver && data.driver._id === user._id)
  },
  {
    label: 'End order',
    content:
      'End this order. Fleet are retrieved by driver and go back to pool',
    status: 'ended',
    icon: 'ios-download-outline',
    allowedRoles: [],
    showStatus: ['started'],
    hideStatus: ['ended'],
    locked: true,
    otherCondition: (user, data) =>
      (data.pool &&
        data.pool._id === user.pool &&
        user.role === 'admin_pool') ||
      (data.driver && data.driver._id === user._id)
  },
  {
    label: 'Join order',
    content: 'Fill seat total you want to tag',
    status: 'joined',
    icon: 'ios-person-add-outline',
    allowedRoles: ['admin_super', 'passenger', 'approver', 'admin_division'],
    showStatus: ['approved'],
    hideStatus: ['locked'],
    locked: false,
    otherCondition: (user, data) =>
      !data.allSeat &&
      data.passenger._id !== user._id &&
      data.fleet.totalSeat > data.seat &&
      data.statuses &&
      !data.statuses.some(
        item => item.status === 'joined' && item.nextPIC === user._id
      )
  }
];

export default actionButtons;
