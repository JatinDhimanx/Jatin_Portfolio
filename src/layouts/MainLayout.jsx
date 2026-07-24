import React from 'react';
import CustomCursor from '../components/CustomCursor';
import Loader from '../components/Loader';
import { useCustomCursor } from '../hooks/useCustomCursor';

export default function MainLayout({ children }) {
  useCustomCursor();

  return (
    <>
      <CustomCursor />
      <Loader />
      {children}
    </>
  );
}
