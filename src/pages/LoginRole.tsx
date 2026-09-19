import React from 'react';
import { Role } from '../types';
import { LoginChoice } from './Login';

interface Props {
  role: Role;
}

export const LoginRole: React.FC<Props> = ({ role }) => {
  return <LoginChoice defaultRole={role} />;
};
