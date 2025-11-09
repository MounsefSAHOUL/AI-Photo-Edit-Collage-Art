import {ToastContextType} from '@/types/global';
import React from 'react';

export const ToastContext = React.createContext<ToastContextType | null>(null);
