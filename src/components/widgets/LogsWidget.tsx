import React, { useEffect } from 'react';
import useSWR from 'swr';
import CodeMirror from '@uiw/react-codemirror';
import { jupyterTheme } from '@jupyterlab/codemirror';

const LogsWidget: React.FC = () => {
  const { data, mutate } = useSWR('/cluster/logs');

  useEffect(() => {
    const handle = setInterval(mutate, 700);
    return () => clearInterval(handle);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', width: '100%', height: '100%' }}>
      <CodeMirror
        value={data}
        style={{ height: '100%' }}
        theme={jupyterTheme}
        editable={false}
        basicSetup={{
          highlightActiveLine: true,
          lineNumbers: true,
          highlightActiveLineGutter: true
        }}
      />
    </div>
  );
};

export default LogsWidget;
