import Head from 'next/head'
import { message, Row, Col, Layout, Button } from 'antd'
import { useRouter } from 'next/router'


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

export default function Search() {
	const router = useRouter()	

  return (
    <div>
      <Head>
        <title>Frame | Search Images</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
	  <Layout>
      <Row type="flex" align="middle" style={{ minHeight: "100vh" }} justify="center">
      	<Col type="flex" align="middle" span={6} justify="center"> 
		  <h1> Search </h1>
		  <h3> Find public images with similar characteristics.</h3>
		  <Row type="flex" gutter={{xs: 8, sm: 16, md: 24}}  justify="center"> 
		  	<Col> 
			  <Button
			  type="primary"
			  size="large"onClick={() => {router.push('/search/tags')}} > Tags </Button> </Col>
			<Col><Button size="large" onClick={() => {router.push('/search/name')}} > Name </Button></Col>
			<Col><Button size="large" onClick={() => {router.push('/search/image')}} > Image </Button></Col>
		  </Row>
 		</Col>
      </Row>
	  </Layout>
    </div>
  )
}
