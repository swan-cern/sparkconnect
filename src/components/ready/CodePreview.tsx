import React, { useState } from 'react';
import { copyIcon } from '@jupyterlab/ui-components';
import CodeMirror from '@uiw/react-codemirror';
import { jupyterTheme } from '@jupyterlab/codemirror';
import { python } from '@codemirror/lang-python';

const CODE = `
from pyspark.sql import SparkSession

spark = SparkSession.builder \\
          .remote("sc://localhost") \\
          .getOrCreate()
`.trim();

export default function CodePreview() {
  const [copied, setCopied] = useState<boolean>(false);

  return (
    <div>
      <div style={{ border: '1px solid var(--jp-border-color2)' }}>
        <CodeMirror
          value={CODE}
          height="200px"
          extensions={[python()]}
          theme={jupyterTheme}
          editable={false}
          basicSetup={{
            highlightActiveLine: false,
            lineNumbers: false,
            highlightActiveLineGutter: false
          }}
        />
      </div>
      <div style={{ marginTop: 4 }}>
        <button
          className="jp-ToolbarButtonComponent jp-mod-minimal jp-Button"
          onClick={() => {
            navigator.clipboard.writeText(CODE);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
        >
          <copyIcon.react tag="span" width={16} height={16} marginTop={4} />{' '}
          <span className="jp-ToolbarButtonComponent-label" style={{ color: 'var(--jp-ui-font-color2)' }}>
            {copied ? 'Copied!' : 'Copy'}
          </span>
        </button>
      </div>
    </div>
  );
}
