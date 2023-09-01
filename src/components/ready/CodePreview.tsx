/**
 * CodePreview
 * This file contains the UI of the code snippet shown in the Connected page.
 */
import React from 'react';
import { addIcon } from '@jupyterlab/ui-components';
import { NotebookActions } from '@jupyterlab/notebook';
import CodeMirror from '@uiw/react-codemirror';
import { jupyterTheme } from '@jupyterlab/codemirror';
import { python } from '@codemirror/lang-python';
import useStatus from '../../hooks/useStatus';
import { UIStore } from '../../store/UIStore';
import '../../../style/CodePreview.css';

const CODE = `
%load_ext sparkconnector.kernelextension
spark = get_spark_session()
`.trim();

export default function CodePreview() {
  const { data } = useStatus();
  const port = data?.port ?? 15002;
  const code = CODE.replace('{PORT}', `${port}`);

  const activeNotebookPanel = UIStore.useState(s => s.activeNotebookPanel);
  const addCellToNotebook = () => {
    if (activeNotebookPanel) {
      NotebookActions.insertBelow(activeNotebookPanel.content);
      setTimeout(() => {
        activeNotebookPanel.content.activeCell?.editor?.model.sharedModel.setSource(CODE);
      }, 10);
    }
  };

  return (
    <div>
      <div className="jp-SparkConnectExtension-CodePreview-codemirror-container">
        <CodeMirror
          value={code}
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
      <div className="jp-SparkConnectExtension-CodePreview-toolbar">
        {!!activeNotebookPanel && (
          <button className="jp-ToolbarButtonComponent jp-mod-minimal jp-Button" onClick={addCellToNotebook}>
            <addIcon.react tag="span" width={16} height={16} marginTop={4} /> <span className="jp-ToolbarButtonComponent-label add-to-notebook">Add to Notebook</span>
          </button>
        )}
      </div>
    </div>
  );
}
