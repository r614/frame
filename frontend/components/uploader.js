const { Upload, } = require('antd')
const {  InboxOutlined  } = require('@ant-design/icons');
const { Dragger } = Upload;
  
const Uploader = (props) => (
		<Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click or drag a file to this area to upload</p>
        <p className="ant-upload-hint">
          Search is restricted to a single file. 
        </p>
      </Dragger>
	)

module.exports = { 
	Uploader
}