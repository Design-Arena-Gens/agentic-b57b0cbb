'use client';

import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';
import { ProjectProvider } from '@/context/ProjectContext';
import { SocketProvider } from '@/context/SocketContext';

const Providers = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>
    <SocketProvider>
      <ProjectProvider>
        {children}
        <Toaster position="bottom-right" />
      </ProjectProvider>
    </SocketProvider>
  </AuthProvider>
);

export default Providers;
