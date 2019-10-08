import React from 'react';
import { Fab, Action } from 'react-tiny-fab';
import 'react-tiny-fab/dist/styles.min.css';


const fn = () => { };
class ConfigButton extends React.Component {
  render() {
    const { onSave = fn, onPreview = fn, onImport = fn, onExport = fn } = this.props;
    return <Fab
      mainButtonStyles={{ backgroundColor: '#84D945' }}
      position={{ bottom: 20, right: 20 }}
      icon={<i className="icon icon-plus"></i>}
      event="click"
    >
      <Action
        text="Preview"
        onClick={onPreview}
        style={{ backgroundColor: '#FF4E50' }}
      >
        <i className="icon icon-preview config-button"></i>
      </Action>
      <Action
        text="Import"
        onClick={onImport}
        style={{ backgroundColor: '#4285F4' }}
      >
        <i className="icon icon-import config-button"></i>
      </Action>
      <Action
        text="Export"
        onClick={onExport}
        style={{ backgroundColor: '#FFCE45' }}
      >
        <i className="icon icon-export config-button"></i>
      </Action>
    </Fab>
  }
}

export default ConfigButton;