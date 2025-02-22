import Head from "next/head";
const axios = require("axios");
import { Row, Col, Layout, Button, Form } from "antd";
const R = require("rambda");
import React, { useState } from "react";
import FileBase64 from "react-file-base64";
const { results } = require("../../components/results");
const { BACKEND_URL } = require('../../components/constants');

export default function ReverseImageSearch() {

  const [pics, setPics] = useState([]);
  const [height, setHeight] = useState("100vh")
  const [files, setFiles] = useState([])
  const sendSearchRequestAndRoute = async (values) => {

    files.forEach((element, index) => {
      files[index] = R.pick(["name", "base64"], element);
    });

    const req = { files }

    axios
      .post(`${BACKEND_URL}/reverse`, req, )
      .then((res) => {
        console.log(JSON.stringify(res.data));
        setPics(res.data)
        setHeight("20vh")
      })
      .catch((err) => console.log(err));
  };

  const getFiles = (files) =>  {
    setFiles(files);
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
          style={{ minHeight: height }}
          justify="center"
        >
          <Col type="flex" align="middle" span={6} justify="center">
          <h1> Reverse Image Search </h1>
          <h3> powered by the magic of AI and TensorflowJS.</h3>
            <Form onFinish={sendSearchRequestAndRoute}>
                <FileBase64
                  multiple={true}
                  onDone={getFiles}
                  style={{ maxWidth: "50" }}
                />
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
        {results(pics)}
      </Layout>
    </div>
  );
}