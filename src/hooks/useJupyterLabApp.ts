import React from 'react';
import { JupyterLabAppContext } from '../const';

export default function useJupyterLabApp() {
  return React.useContext(JupyterLabAppContext);
}
