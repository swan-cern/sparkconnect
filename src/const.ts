/**
 * const
 * Constants definitions
 */
import { JupyterFrontEnd } from '@jupyterlab/application';
import React from 'react';

export const JupyterLabAppContext = React.createContext<JupyterFrontEnd | undefined>(undefined);
export const EXTENSION_ID = 'sparkconnector';
export const FRONTEND_COMM_ID = `${EXTENSION_ID}:comm:frontend`;
