import React, { useEffect } from 'react';
import useSWR from 'swr';
import CodeMirror from '@uiw/react-codemirror';
import { jupyterTheme } from '@jupyterlab/codemirror';
import { requestAPI } from '../../handler';
import '../../../style/LogsWidget.css';

const LogsWidget: React.FC = () => {
  const { data, mutate } = useSWR('/cluster/logs', { fetcher: (url: string, init: RequestInit) => requestAPI<any>(url, init, false) });

  useEffect(() => {
    const handle = setInterval(mutate, 700);
    return () => clearInterval(handle);
  }, []);

  return (
    <div className="jp-SparkConnectExtension-LogsWidget-root">
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
