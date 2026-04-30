import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { TopNav } from './TopNav';

interface AppLayoutProps {
  houseName?: string;
}

export function AppLayout({ houseName }: AppLayoutProps) {
  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      {/* TopNav: md+ only via CSS */}
      <div className="top-nav-wrapper">
        <TopNav houseName={houseName} />
      </div>

      <main
        style={{
          flex: 1,
          paddingBottom: 'calc(var(--bottom-nav-h) + env(safe-area-inset-bottom, 0px))',
          paddingTop: 'var(--sp-4)',
        }}
        className="main-content"
      >
        <Outlet />
      </main>

      {/* BottomNav: mobile only */}
      <div className="bottom-nav-wrapper">
        <BottomNav />
      </div>

      <style>{`
        .top-nav-wrapper    { display: none; }
        .bottom-nav-wrapper { display: block; }
        .main-content       { padding-top: var(--sp-4); }

        @media (min-width: 768px) {
          .top-nav-wrapper    { display: block; }
          .bottom-nav-wrapper { display: none; }
          .main-content       { padding-bottom: var(--sp-6) !important; padding-top: 0; }
        }
      `}</style>
    </div>
  );
}
