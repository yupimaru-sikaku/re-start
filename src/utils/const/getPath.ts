const PATH = {
  INDEX: '/',
  SIGN_UP: '/auth/sign-up',
  SIGN_IN: '/auth/sign-in',
  CONFIRM_EMAIL: '/auth/confirm-email',
  FORGOT_PASSWORD: '/auth/forgot-password',
  // 利用者
  USER: '/user',
  USER_REGISTER: '/user/register',
  USER_EDIT: '/user/edit',
  // スタッフ
  STAFF: '/staff',
  STAFF_REGISTER: '/staff/register',
  STAFF_EDIT: '/staff/[id]/edit',
  STAFF_SCHEDULE: '/staff/schedule/[id]',
  // 同行援護
  ACCOMPANYING_SUPPPORT: '/accompanying-support',
  ACCOMPANYING_SUPPPORT_CREATE: '/accompanying-support/create',
  ACCOMPANYING_SUPPPORT_EDIT: '/accompanying-support/[id]/edit',
  // 行動援護
  BEHAVIOR_SUPPPORT: '/behavioral-support',
  BEHAVIOR_SUPPPORT_CREATE: '/behavioral-support/create',
  // 居宅介護
  HOME_CARE_SUPPORT: '/home-care-support',
  HOME_CARE_SUPPORT_CREATE: '/home-care-support/create',
  HOME_CARE_SUPPORT_EDIT: '/home-care-support/[id]/edit',
  // 移動支援
  MOBILITY_SUPPORT: '/mobility-support',
  MOBILITY_SUPPORT_CREATE: '/mobility-support/create',
} as const;

export const getPath = (pathKey: keyof typeof PATH, ...args: string[]) => {
  const val = PATH[pathKey];

  if (!args) {
    return val;
  }

  const dirs = val.slice(1).split('/');

  const newPath = dirs.map((dir) => {
    if (dir.startsWith('[')) {
      const replaceDir = args[0];
      args.shift();
      return replaceDir;
    }
    return dir;
  });

  return '/' + newPath.join('/');
};
