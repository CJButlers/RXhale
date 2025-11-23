import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginPage } from './components/LoginPage';
import { HomePage } from './components/HomePage';
import { AddPatientPage } from './components/AddPatientPage';
import { PatientRecordPage } from './components/PatientRecordPage';
import { DashboardLayout } from './components/DashboardLayout';
import { Toaster } from './components/ui/sonner'; //
import { auth } from './lib/firebase';
import { signOut } from 'firebase/auth';
import { toast } from 'sonner';

function AppContent() {
  const { currentUser } = useAuth();
  const [currentPage, setCurrentPage] = useState<'home' | 'add-patient' | 'patient-record'>('home');
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');

  const handleLogout = async () => {
    await signOut(auth);
    toast.success("Logged out successfully");
  };

  const navigateTo = (page: any, id?: string) => {
    setCurrentPage(page);
    if (id) setSelectedPatientId(id);
  };

  // If not logged in, show Login Page
  if (!currentUser) {
    return <LoginPage />;
  }

  // If logged in, show Dashboard Layout
  return (
    <DashboardLayout 
      onNavigate={navigateTo} 
      onLogout={handleLogout} 
      currentUser={currentUser.email || 'Pharmacist'}
    >
      {currentPage === 'home' && (
        <HomePage 
          onAddPatient={() => navigateTo('add-patient')}
          onPatientClick={(id) => navigateTo('patient-record', id)}
        />
      )}

      {currentPage === 'add-patient' && (
        <AddPatientPage 
          onBack={() => navigateTo('home')} 
          onSuccess={() => navigateTo('home')}
        />
      )}

      {currentPage === 'patient-record' && selectedPatientId && (
        <PatientRecordPage 
          patientId={selectedPatientId}
          onBack={() => navigateTo('home')}
        />
      )}
    </DashboardLayout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-50">
        <Toaster position="top-right" />
        <AppContent />
      </div>
    </AuthProvider>
  );
}