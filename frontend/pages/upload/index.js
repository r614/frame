import { Form, Input, Button, Upload, Row, Col, Alert } from "antd";
import React, { useState } from "react";
import { InboxOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
const R = require("rambda");
const axios = require("axios");

const BACKEND_URL = process.env.BACKEND_URL;

const post = async (formData) => {
  if (R.isNil(formData.images)) {
    console.log("Error");
    throw "Please select at least one image to upload";
  }

  console.log(formData)

  axios
    .post(`${BACKEND_URL}/upload`, formData)
    .then((res) => res)
    .catch((err) => {
      console.log(err);
      throw "Error uploading files.";
    });
};

const formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 16,
  },
};

const normFile = (e) => {
  console.log("Upload event:", e);

  if (Array.isArray(e)) {
    return e;
  }

  return e && e.fileList;
};

export default function UploadPage() {
  let [error, setErrorState] = useState(null);
  let [errorMessage, setErrorMessage] = useState("");
  let [success, setSuccessState] = useState(false);

  const onFinish = (values) => {
    console.log("Received values of form: ", values);

    if (R.isNil(values.images)) {
      setErrorMessage("Error; Select at least one image.");
      setErrorState(true);
      return
    }

    let b64Array = []

    let password = R.pathOr(null, ['password'])(values)

    values.images.forEach(function (file, index) {
      let reader = new FileReader();
      reader.onload = (e) => {
        file.base64 = e.target.result;
      };
      reader.readAsDataURL(file.originFileObj);
      b64Array.push(file.base64)
    });

    post({ password, images: b64Array})
      .then((res) => {
        setSuccessState(true);
        const router = useRouter();
        router.push(
          `${gallery}/${res.body.protected ? "protected" : ""}gid=${
            res.body.gid
          }`
        );
      })
      .catch((err) => {
        setErrorMessage(err);
        setErrorState(true);
      });
  };

  return (
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
          links are only valid for 24hrs, though i doubt anyone's going to use
          this{" "}
        </p>
        {success && (
          <Alert
            type="success"
            message="Upload successful, redirecting to gallery"
            banner
            closable
          />
        )}

        {error && <Alert type="error" message={errorMessage} banner closable />}

        <Form name="validate_other" {...formItemLayout} onFinish={onFinish}>
          <Form.Item name="password" label="Password">
            <Input.Password />
          </Form.Item>

            <Form.Item
              name="images"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              noStyle
            >
              <Upload.Dragger
                name="files"
                beforeUpload={() => false}
                accept="image/*"
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Click or drag file to this area to upload
                </p>
                <p className="ant-upload-hint">
                  Supports single or bulk upload.
                </p>
              </Upload.Dragger>
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
  );
}
