import Head from 'next/head'
import { Uploader } from '../../components/uploader'
import { message, Row, Col, Layout } from 'antd'

const { Header } = Layout

const BACKEND_URL = process.env.BACKEND_URL || "0.0.0.0:4000"

const props = {
	name: 'file',
	multiple: false,
	action: `${BACKEND_URL}/search`,
	onChange(info) {
	  const { status } = info.file;
	  if (status !== 'uploading') {
		console.log(info.file, info.fileList);
	  }
	  if (status === 'done') {
		message.success(`${info.file.name} file uploaded successfully.`);
	  } else if (status === 'error') {
		message.error(`${info.file.name} file upload failed.`);
	  }
	},

	styles:{
		maxWidth: "50%"
	}
};

export default function reverseImageSearch() {
  return (
    <div>
      <Head>
        <title>Frame | Search Images</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
	  <Layout>
      <Row type="flex" align="middle" style={{ minHeight: "100vh" }} justify="center">
      	<Col type="flex" align="middle" span={6} justify="center"> 
		  <h1> Reverse Image Search </h1>
		  <h3> powered by the magic of AI and TensorflowJS.</h3>
		  <Uploader {...props} />
 		</Col>
      </Row>
	  </Layout>
    </div>
  )
}
