import Head from "next/head";
const axios = require("axios");
import { Row, Col, Layout, Button, Form, Input } from "antd";
const { results } = require("./results")
import React, { useState } from "react";
const { BACKEND_URL } = require('./constants')

function SearchPage(type, message, query) {

  const [pics, setPics] = useState([]);
  const [height, setHeight] = useState("100vh")
  const sendSearchRequestAndRoute = async (values) => {
    const q = {params:{}}
    q.params[query] = values[query]
    console.log(`q: ${JSON.stringify(q)}`)
    axios
      .post(`${BACKEND_URL}/search`, {}, q)
      .then((res) => {
        console.log(JSON.stringify(res.data));
        setPics(res.data)
        setHeight("20vh")
      })
      .catch((err) => console.log(err));
  };

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
            <h1>{ `Search | ${type}` }</h1>
            <p>
              {`${message}`}
            </p>
            <Form onFinish={sendSearchRequestAndRoute}>
              <Form.Item name={query} label="">
                <Input placeholder={`space separated ${query}s yield best results`}></Input>
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
        {results(pics)}
      </Layout>
    </div>
  );
}

module.exports = { 
    SearchPage
}
