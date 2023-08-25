/**
 * useJupyterLabApp
 * A React hook to get the JupyterLabApp instancce.
 */
import React from 'react';
import { JupyterLabAppContext } from '../const';

export default function useJupyterLabApp() {
  return React.useContext(JupyterLabAppContext);
}
