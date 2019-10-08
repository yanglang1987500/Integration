import React from 'react'
import ReactDom from 'react-dom'
import axios from 'axios';
import { SideDialog, Button } from './components';
import DesignEditor, { Extension } from 'design-editor';
import Video from './Video';
import ConfigButton from './ConfigButton';

let instance = null;


const onPreview = () => {
  if (instance) {
    const page = window.open('', '_blank');
    page.document.write(instance.export());
  }
}

function download(content, filename, contentType)
{
  if(!contentType)
    contentType = 'application/octet-stream';
  var a = document.createElement('a');
  var blob = new Blob([content], {'type':contentType});
  a.href = window.URL.createObjectURL(blob);
  a.download = filename;
  a.click();
}

const onExport = () => {
  download(JSON.stringify(instance.getData()), 'data.json'); 
}

class Editor extends React.Component {

  state={
    mentions:[
      { key: 'test', title: 'test' },
    ],
    visible:false,
    data: ''
  }

  bindEvents = () => {
    if (this.dropzone) {
      this.dropzone.addEventListener('drop', this.onDrop);
      this.dropzone.addEventListener('dragenter', this.onPrevent);
      this.dropzone.addEventListener('dragover', this.onPrevent);
    }
  }

  unbindEvents = () => {
    if (this.dropzone) {
      this.dropzone.removeEventListener('drop', this.onDrop);
      this.dropzone.removeEventListener('dragenter', this.onPrevent);
      this.dropzone.removeEventListener('dragover', this.onPrevent);
    }
  }

  onPrevent = (e) => {
    e.stopPropagation();
    e.preventDefault();
  }

  onDrop = (e) => {
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      this.onChange({ target: { files } });
    }
  }

  onChange = (e) => {
    const target = e.target;
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    console.log(file);
    const reader = new FileReader();
    reader.onload = () => {
      this.setState({ data: reader.result });
    };
    reader.readAsText(file);
  }

  onImport = () => {
    this.bindEvents();
    this.setState({ visible: true });
  }

  onSubmitImport = () => {
    let data = null;
    try{
      data = JSON.parse(this.state.data);
    }catch(e){
      console.error('Import Failed! Please ensure the data is standard.');
      return;
    }
    data && instance.setData(data);
    this.setState({ data: '' });
  }

  componentDidMount() {
    axios.get('./dynamicField.json').then(({ data }) => {
      this.setState({ mentions: data });
    })
  }

  render() {
    return <div>
      <DesignEditor
        imageUploadUrl="http://localhost:3001/UserFeedback/upload"
        mentions={this.state.mentions}
        onUpload={data => data.fileUrl}
        onUploadError={error => console.log('5555', error.message)}
        onRef={(obj) => { instance = obj; window.instance = obj; }}>
        <Video />
      </DesignEditor>
      <SideDialog visible={this.state.visible} onClose={()=>{this.setState({visible:false});this.unbindEvents();}}>
        <h5>请粘贴数据</h5>
        <div><textarea value={this.state.data} onChange={(e)=>{this.setState({data:e.target.value})}}
        rows={30} style={{width:'100%', border: '1px solid #ccc'}}></textarea></div>
        <h5>或拖入json文件</h5>
        <div style={{marginBottom:10}}>
          <label
            ref={(dom) => { this.dropzone = dom; }}
            className="ds-dropzone" aria-disabled="false" htmlFor={this.state.uploading ? '' : 'fileInput'}>
            <div>
              <span>Drop json file here.</span>
            </div>
            <input id="fileInput" onChange={this.onChange} type="file" autoComplete="off" style={{ display: 'none' }} />
          </label>
        </div>
        <div style={{textAlign:'right'}}><Button onClick={this.onSubmitImport}>Submit</Button></div>
      </SideDialog>
      <ConfigButton onPreview={onPreview} onImport={this.onImport} onExport={onExport} />
    </div>;
  }
}

export default Editor;