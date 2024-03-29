import { FC } from 'react';
import Link from 'next/link';
import { useDisclosure } from '@mantine/hooks';
import { createStyles, Navbar, Group, UnstyledButton, MediaQuery, ActionIcon, Tooltip } from '@mantine/core';
import { Home, ArrowLeft, ArrowRight, User, Car, Friends, Walk, HomeHeart, Disabled2 } from 'tabler-icons-react';
import { getPath } from '@/utils/const/getPath';
import { ActiveLink } from '@/utils/next/active-link';
import { supabase } from '@/libs/supabase/supabase';
import Image from 'next/image';
import { useAppDispatch, useSelector } from '@/ducks/store';
import { IconBuilding, IconCalendarEvent, IconLogout } from '@tabler/icons';
import { clearLoginProviderInfo } from '@/ducks/provider/slice';
import { changeThemeMode } from '@/ducks/global/slice';
import { IconSun, IconMoonStars } from '@tabler/icons';

const useStyles = createStyles<string, { collapsed?: boolean }>((theme, params, getRef) => {
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
      cursor: 'pointer',

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
        // backgroundColor: theme.colors[theme.primaryColor][0],
        // color: theme.colors[theme.primaryColor][7],
        [`& .${icon}`]: {
          // color: theme.colors[theme.primaryColor][7],
        },
      },
    },

    linkIcon: {
      ref: icon,
      color: theme.colors.gray[7],
    },

    linkLabel: params?.collapsed ? { display: 'none' } : {},
  };
});

export const ITEMS = [{ href:'/restart', label: 'ホーム', Icon: Home, role: 'all'}, { href: getPath('RESTART_CREATE'), label: '記録表作成', Icon: IconBuilding, role: 'all' }];

export const RestartSideNav: FC<{ className?: string }> = ({ className }) => {
  const dispatch = useAppDispatch();
  const [collapsed, handlers] = useDisclosure(false);
  const { classes, cx } = useStyles({ collapsed });
  const handleLogout = async () => {
    dispatch(clearLoginProviderInfo());
    await supabase.auth.signOut();
  };
  const themeMode = useSelector((state) => state.global.themeMode);
  const changeMode = () => {
    const mode = themeMode === 'light' ? 'dark' : 'light';
    dispatch(changeThemeMode(mode));
  };
  const loginProviderInfo = useSelector((state) => state.provider.loginProviderInfo);

  return (
    <Navbar p="md" className={cx(classes.navbar, className)}>
      <Navbar.Section grow>
        <Group className={classes.header} position="apart">
          <Link href="/restart">
            <a className={classes.logo}>
              <Image src="/icon.webp" alt="icon" width={50} height={50} />
              <span className={classes.linkLabel}>管理画面</span>
            </a>
          </Link>
        </Group>
        {ITEMS.map(
          ({ label, href, Icon, role }) =>
            (role === 'all' || loginProviderInfo.role === 'admin') && (
              <ActiveLink href={href} passHref key={label}>
                {(isActive) => {
                  return (
                    <Tooltip label={label} color="blue" position="right" withArrow>
                      <a
                        className={cx(classes.link, {
                          [classes.linkActive]: isActive,
                        })}
                      >
                        <Icon className={classes.linkIcon} />
                        <span className={classes.linkLabel}>{label}</span>
                      </a>
                    </Tooltip>
                  );
                }}
              </ActiveLink>
            )
        )}
        <Tooltip label="ログアウト" color="blue" position="right" withArrow>
          <a className={cx(classes.link)} onClick={handleLogout}>
            <IconLogout className={classes.linkIcon} />
            <span className={classes.linkLabel}>ログアウト</span>
          </a>
        </Tooltip>
        {/* <ActionIcon
          className={cx(classes.link)}
          variant="outline"
          color={themeMode === 'dark' ? 'yellow' : 'blue'}
          onClick={() => changeMode()}
        >
          {themeMode === 'dark' ? <IconSun size={18} /> : <IconMoonStars size={18} />}
        </ActionIcon> */}
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
