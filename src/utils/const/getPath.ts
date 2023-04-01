const PATH = {
  INDEX: '/',
  SIGN_UP: '/auth/sign-up',
  SIGN_IN: '/auth/sign-in',
  CONFIRM_EMAIL: '/auth/confirm-email',
  FORGOT_PASSWORD: '/auth/forgot-password',
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
