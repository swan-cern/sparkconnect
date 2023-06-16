import React from 'react';
import useSWR from 'swr';

const LogsWidget: React.FC = () => {
  const { data } = useSWR('/cluster/logs', { refreshInterval: 500 });

  return (
    <div style={{ padding: 8, overflow: 'auto', width: '100%', height: '100%', fontSize: 'var(--jp-ui-font-size0)' }}>
      <small>
        <pre>{data}</pre>
      </small>
    </div>
  );
};

export default LogsWidget;
