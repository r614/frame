import Head from "next/head";
const axios = require('axios')
import { message, Row, Col, Layout, Button, Form, Input } from "antd";
import { useRouter } from "next/router";

const BACKEND_URL = process.env.BACKEND_URL || "http://0.0.0.0:4000";

export default function TagSearch() {
  const router = useRouter();

  const sendSearchRequestAndRoute = (values) => {
	console.log(values)
	axios.post(`${BACKEND_URL}/search`, {}, {params : { tags: values.tags }})
		.then((res) => console.log(res))
		.catch((err) => console.log(err))
  }
  return (
    <div>
      <Head>
        <title>Frame | Search Images</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Row
          type="flex"
          align="middle"
          style={{ minHeight: "100vh" }}
          justify="center"
        >
          <Col type="flex" align="middle" span={6} justify="center">
            <h1> Search | Tags</h1>
            <p>
              {" "}
              Find public images with similar tags. <br /> tags are
              automatically assigned on upload using AI :){" "}
            </p>
            <Form onFinish={sendSearchRequestAndRoute}>
              <Form.Item name="tags" label="">
                <Input placeholder="space separated tags yield best results"></Input>
              </Form.Item>
              <Form.Item
                wrapperCol={{
                  span: 12,
                  offset: 6,
                }}
              >
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Layout>
    </div>
  );
}
