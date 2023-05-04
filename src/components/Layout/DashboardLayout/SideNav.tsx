import { FC } from 'react';
import Link from 'next/link';
import { useDisclosure } from '@mantine/hooks';
import {
  createStyles,
  Navbar,
  Group,
  UnstyledButton,
  Tooltip,
  MediaQuery,
  Paper,
} from '@mantine/core';
import {
  Home,
  Settings,
  ArrowLeft,
  ArrowRight,
  DeviceAnalytics,
  Logout,
  User,
  Login,
} from 'tabler-icons-react';
import { getPath } from '@/utils/const/getPath';
import { ActiveLink } from '@/utils/next/active-link';
import { supabase } from '@/libs/supabase/supabase';
import Image from 'next/image';

const useStyles = createStyles<string, { collapsed?: boolean }>(
  (theme, params, getRef) => {
    const icon: string = getRef('icon');

    return {
      navbar: {
        position: 'sticky',
        top: 0,
        width: params?.collapsed ? 81 : 200,
        transition: params?.collapsed ? 'width 0.1s linear' : 'none',
      },

      header: {
        paddingBottom: theme.spacing.xs,
        marginBottom: theme.spacing.md,
        borderBottom: `1px solid ${theme.colors.gray[2]}`,
      },

      footer: {
        paddingTop: theme.spacing.xs,
        marginTop: theme.spacing.md,
        borderTop: `1px solid ${theme.colors.gray[2]}`,
      },

      logo: {
        ...theme.fn.focusStyles(),
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        columnGap: theme.spacing.sm,
        textDecoration: 'none',
        fontSize: theme.fontSizes.sm,
        color: theme.colors.gray[7],
        // padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
        borderRadius: theme.radius.sm,
        fontWeight: 700,
      },

      link: {
        ...theme.fn.focusStyles(),
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        columnGap: theme.spacing.sm,
        textDecoration: 'none',
        fontSize: theme.fontSizes.sm,
        color: theme.colors.gray[7],
        padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
        borderRadius: theme.radius.sm,
        fontWeight: 500,

        '&:hover': {
          backgroundColor: theme.colors.gray[0],
          color: theme.black,

          [`& .${icon}`]: {
            color: theme.black,
          },
        },
      },

      linkActive: {
        '&, &:hover': {
          backgroundColor: theme.colors[theme.primaryColor][0],
          color: theme.colors[theme.primaryColor][7],
          [`& .${icon}`]: {
            color: theme.colors[theme.primaryColor][7],
          },
        },
      },

      linkIcon: {
        ref: icon,
        color: theme.colors.gray[6],
      },

      linkLabel: params?.collapsed ? { display: 'none' } : {},
    };
  }
);

const ITEMS = [
  { href: getPath('INDEX'), label: 'ホーム', Icon: Home },
  { href: getPath('USER'), label: '利用者情報', Icon: User },
  { href: getPath('STAFF'), label: 'スタッフ情報', Icon: User },
  { href: getPath('ACCOMPANYING_SUPPPORT'), label: '同行援護', Icon: User },
  { href: getPath('HOME_CARE_SUPPORT'), label: '居宅介護', Icon: User },
  { href: getPath('MOBILITY_SUPPORT'), label: '移動支援', Icon: User },
  { href: getPath('SIGN_UP'), label: '設定', Icon: Settings },
  { href: getPath('SIGN_IN'), label: 'ログイン', Icon: Login },
];

export const SideNav: FC<{ className?: string }> = ({ className }) => {
  const [collapsed, handlers] = useDisclosure(false);
  const { classes, cx } = useStyles({ collapsed });

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <Navbar p="md" className={cx(classes.navbar, className)}>
      <Navbar.Section grow>
        <Group className={classes.header} position="apart">
          <Link href={getPath('INDEX')}>
            <a className={classes.logo}>
              <Image
                src="/icon.webp"
                alt="icon"
                width={50}
                height={50}
                className="rounded-xl"
              />
              <span className={classes.linkLabel}>管理画面</span>
            </a>
          </Link>
        </Group>
        {ITEMS.map(({ label, href, Icon }) => (
          <ActiveLink href={href} passHref key={label}>
            {(isActive) => {
              return (
                <a
                  className={cx(classes.link, {
                    [classes.linkActive]: isActive,
                  })}
                >
                  <Icon className={classes.linkIcon} />
                  <span className={classes.linkLabel}>{label}</span>
                </a>
              );
            }}
          </ActiveLink>
        ))}
      </Navbar.Section>

      <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
        <Navbar.Section className={classes.footer}>
          <UnstyledButton className={classes.link} onClick={handlers.toggle}>
            {collapsed ? (
              <ArrowRight className={classes.linkIcon} />
            ) : (
              <>
                <ArrowLeft className={classes.linkIcon} />
                <span>折りたたむ</span>
              </>
            )}
          </UnstyledButton>
        </Navbar.Section>
      </MediaQuery>
    </Navbar>
  );
};
