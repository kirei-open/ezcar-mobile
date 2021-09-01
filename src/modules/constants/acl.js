export const poolRole = [
  { key: 'admin_pool', title: 'Admin Pool', url: '/user/admin-pool' },
  { key: 'maintenancer', title: 'Maintenancer', url: '/user/maintenancer' },
  { key: 'driver', title: 'Driver', url: '/user/driver' }
];

export const divisionRole = [
  {
    key: 'admin_division',
    title: 'Admin Division',
    url: '/user/admin-division'
  },
  { key: 'approver', title: 'Approver', url: '/user/approver' },
  { key: 'passenger', title: 'Passenger', url: '/user/passenger' }
];

export const adminRole = [
  { key: 'admin_super', title: 'Superadmin', url: '/user/admin-super' },
  { key: 'admin_company', title: 'Admin Company', url: '/user/admin-company' }
];

export const roleList = adminRole.concat(poolRole, divisionRole);

export const canCreateUserRole = role => {
  let result = [];

  const indexPool = poolRole.findIndex(r => r.key === role);
  const indexDivision = divisionRole.findIndex(r => r.key === role);
  const indexAdmin = adminRole.findIndex(r => r.key === role);

  if (indexPool > -1) {
    const filtered = poolRole.filter((r, index) => index >= indexPool);

    result = result.concat(filtered);
  }

  if (indexDivision > -1) {
    const filtered = divisionRole.filter((r, index) => index >= indexDivision);
    result = result.concat(filtered);
  }

  if (indexAdmin > -1) {
    const filtered = adminRole.filter((r, index) => index >= indexAdmin);
    result = result.concat(filtered, divisionRole, poolRole);
  }
  return result;
};

export const userGroups = [
  { key: 'company', title: 'Company', allowed: ['admin_super'] },
  {
    key: 'division',
    title: 'Division',
    allowed: ['admin_super', 'admin_company']
  },
  {
    key: 'pool',
    title: 'Pool',
    allowed: ['admin_super', 'admin_company']
  }
];

export const canCreateUserGroup = role =>
  userGroups.filter(group => group.allowed.some(allow => allow === role));
