import { Form, Input, Button, Row, Col, Alert, Layout, Result } from "antd";
import Head from "next/head";
import React from "react";
import FileBase64 from "react-file-base64";
const R = require("rambda");
const axios = require("axios");

const BACKEND_URL = process.env.BACKEND_URL || "http://0.0.0.0:4000";
let FRONTEND_URL;

const formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 16,
  },
};

class UploadPage extends React.Component {
  constructor() {
    super();
    this.state = {
      files: null,
      error: null,
      errorMessage: "",
      success: false,
      successMessage: "",
      links: [],
      resHeight: "0vh",
    };
  }

  componentDidMount() {
    FRONTEND_URL =
      R.pathOr(null, ["location", "origin"], window) ||
      process.env.FRONTEND_URL;
  }

  getFiles(files) {
    this.setState({ files: files });
  }

  throwError(err) {
    this.setState({ errorMessage: err, error: true });
  }

  post(formData) {
    if (R.isNil(formData.files)) {
      throw "Please select at least one image to upload";
    }

    axios
      .post(`${BACKEND_URL}/upload`, formData)
      .then((res) => {
        let links = [];
        res.data.map((image) => {
          if (image.protected) {
            links.push(`${FRONTEND_URL}/image/protected/${image.id}`);
          } else {
            links.push(`${FRONTEND_URL}/image/${image.id}`);
          }
        });
        console.log(res);
        this.setState({ error: false, success: true, links });
      })
      .catch((err) => {
        this.throwError(err.message);
      });
  }

  submitUpload(values) {
    if (R.isNil(this.state.files)) {
      this.throwError("Error; Select at least one image.");
      return;
    }

    this.state.files.forEach((element, index) => {
      this.state.files[index] = R.pick(["name", "base64"], element);
    });

    let password = R.pathOr(null, ["password"])(values);
    let req = { password, files: this.state.files };
    console.log("Received values of form: ", req);
    this.post(req);
  }

  render() {
    return (
      <Layout>
        <Head>
          <title>Frame | Search Images</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Row
          type="flex"
          align="middle"
          justify="center"
          style={{ minHeight: "100vh" }}
        >
          <Col type="flex" align="middle" justify="center" span={8}>
            <h1> Upload </h1>
            <p>
              {" "}
              save the link(and password), you won't be seeing it again <br />
              links are only valid for 24hrs, though i doubt anyone's going to
              use this{" "}
            </p>

            {this.state.error && (
              <Alert type="error" message={this.state.errorMessage} banner />
            )}

            <Form
              name="validate_other"
              {...formItemLayout}
              onFinish={this.submitUpload.bind(this)}
            >
              <Form.Item name="password" label="Password">
                <Input.Password placeholder="Optional; images will be public if not specified" />
              </Form.Item>

              <Form.Item
                wrapperCol={{
                  span: 12,
                  offset: 7,
                }}
              >
                <FileBase64
                  multiple={true}
                  onDone={this.getFiles.bind(this)}
                  style={{ maxWidth: "50" }}
                />
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
            {this.state.success && (
              <Result
                status="success"
                title={`Successfully uploaded ${R.length(
                  this.state.links
                )} images!`}
                subTitle={`Links: \n ${this.state.links.join("\n")}`}
              />
            )}
          </Col>
        </Row>
      </Layout>
    );
  }
}

export default UploadPage;
