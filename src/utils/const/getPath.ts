export const PATH = {
  INDEX: '/',
  SIGN_UP: '/auth/sign-up',
  SIGN_IN: '/auth/sign-in',
  CONFIRM_EMAIL: '/auth/confirm-email',
  FORGOT_PASSWORD: '/auth/forgot-password',
  // 利用者
  USER: '/user',
  USER_REGISTER: '/user/register',
  USER_EDIT: '/user/[id]/edit',
  // スタッフ
  STAFF: '/staff',
  STAFF_REGISTER: '/staff/register',
  STAFF_EDIT: '/staff/[id]/edit',
  STAFF_SCHEDULE: '/staff/schedule/[id]',
  // 同行援護
  ACCOMPANY: '/accompany',
  ACCOMPANY_CREATE: '/accompany/create',
  ACCOMPANY_EDIT: '/accompany/[id]/edit',
  // 行動援護
  BEHAVIOR: '/behavior',
  BEHAVIOR_CREATE: '/behavior/create',
  BEHAVIOR_EDIT: '/behavior/[id]/edit',
  // 居宅介護
  HOME_CARE: '/home-care',
  HOME_CARE_CREATE: '/home-care/create',
  HOME_CARE_EDIT: '/home-care/[id]/edit',
  // 移動支援
  MOBILITY: '/mobility',
  MOBILITY_CREATE: '/mobility/create',
  MOBILITY_EDIT: '/mobility/[id]/edit',
} as const;

export const getPath = (
  pathKey: keyof typeof PATH,
  ...args: string[]
) => {
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