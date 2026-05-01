import { useLocation, Link } from 'react-router-dom';
import { PiHouseBold, PiCalendarBold, PiTrophyBold, PiUserBold } from 'react-icons/pi';
import type { IconType } from 'react-icons';

const NAV_ITEMS: { to: string; icon: IconType; label: string }[] = [
  { to: '/home',     icon: PiHouseBold,    label: '홈'     },
  { to: '/calendar', icon: PiCalendarBold, label: '달력'   },
  { to: '/mission',  icon: PiTrophyBold,   label: '미션'   },
  { to: '/profile',  icon: PiUserBold,     label: '프로필' },
];

interface TopNavProps {
  houseName?: string;
}

export function TopNav({ houseName = '행복달력' }: TopNavProps) {
  const { pathname } = useLocation();

  return (
    <header
      style={{
        position: 'sticky', top: 0, zIndex: 40,
        height: 'var(--nav-h)',
        background: 'rgba(247,248,252,0.9)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1.5px solid var(--border)',
        display: 'flex', alignItems: 'center',
        padding: '0 var(--sp-6)',
        gap: 'var(--sp-4)',
      }}
    >
      <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--primary)', marginRight: 'auto' }}>
        🏠 {houseName}
      </span>
      <nav style={{ display: 'flex', gap: 4 }}>
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
          const isActive = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 16px',
                borderRadius: 'var(--r-pill)',
                color: isActive ? 'var(--primary)' : 'var(--text-2)',
                background: isActive ? 'var(--primary-light)' : 'transparent',
                fontWeight: isActive ? 700 : 500,
                fontSize: 14,
                textDecoration: 'none',
                transition: 'all 0.15s',
              }}
            >
              <Icon style={{ fontSize: 18 }} />
              {label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
