import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { HomePage } from './pages/HomePage';
import { CalendarPage } from './pages/CalendarPage';
import { MissionPage } from './pages/MissionPage';
import { ProfilePage } from './pages/ProfilePage';
import { useAppState } from './hooks/useAppState';

export default function App() {
  const {
    spaceCode, role, data, syncStatus,
    setRole,
    handleCreateCode, handleJoinCode, handleLeave,
    updateProfile, updateMood, toggleHeart,
    setFemaleRangeStart, updateMission,
    updateNames, updateCoupons,
  } = useAppState();

  return (
    <HashRouter>
      <Routes>
        <Route element={<AppLayout houseName={data.meta.houseName} />}>
          <Route index element={<Navigate to="/home" replace />} />
          <Route
            path="/home"
            element={
              <HomePage
                data={data}
                role={role}
                onMoodChange={updateMood}
              />
            }
          />
          <Route
            path="/calendar"
            element={
              <CalendarPage
                data={data}
                role={role}
                onToggleHeart={toggleHeart}
                onSetFemaleRange={setFemaleRangeStart}
              />
            }
          />
          <Route
            path="/mission"
            element={
              <MissionPage
                data={data}
                role={role}
                onUpdateMission={updateMission}
              />
            }
          />
          <Route
            path="/profile"
            element={
              <ProfilePage
                data={data}
                role={role}
                spaceCode={spaceCode}
                syncStatus={syncStatus}
                onSetRole={setRole}
                onUpdateProfile={updateProfile}
                onUpdateNames={updateNames}
                onCreateCode={handleCreateCode}
                onJoinCode={handleJoinCode}
                onLeave={handleLeave}
                onUpdateCoupons={updateCoupons}
              />
            }
          />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
