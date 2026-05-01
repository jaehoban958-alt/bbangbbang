import { useLocation, Link } from 'react-router-dom';
import { PiHouseBold, PiCalendarBold, PiTrophyBold, PiUserBold } from 'react-icons/pi';
import type { IconType } from 'react-icons';

const NAV_ITEMS: { to: string; icon: IconType; label: string }[] = [
  { to: '/home',     icon: PiHouseBold,    label: '홈'     },
  { to: '/calendar', icon: PiCalendarBold, label: '달력'   },
  { to: '/mission',  icon: PiTrophyBold,   label: '미션'   },
  { to: '/profile',  icon: PiUserBold,     label: '프로필' },
];

export function BottomNav() {
  const { pathname } = useLocation();

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0, left: 0, right: 0,
        height: 'var(--bottom-nav-h)',
        background: 'var(--surface)',
        borderTop: '1.5px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 40,
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
        const isActive = pathname === to;
        return (
          <Link
            key={to}
            to={to}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 3, minWidth: 64, padding: '8px 0',
              color: isActive ? 'var(--primary)' : 'var(--text-3)',
              textDecoration: 'none',
              transition: 'color 0.15s',
            }}
          >
            <Icon style={{ fontSize: 24 }} />
            <span style={{ fontSize: 11, fontWeight: isActive ? 700 : 500 }}>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
