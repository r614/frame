import { Card, Row, Col } from "antd";
const R = require("rambda");
const { Meta } = Card;

const { BACKEND_URL } = require("./constants");

const error = () => {
  return (
    <Row
      gutter={[16, 16]}
      type="flex"
      align="middle"
      style={{ minHeight: "78vh" }}
    >
      <Col span={8} align="middle" style={{ minWidth: "100vw" }}>
        <p>
          {" "}
          we couldn't find any images for the query :( try something else?{" "}
        </p>
        <p>
          {" "}
          Hint: try car or street for tag searches, and ferrari or nyc for name
          search
        </p>
      </Col>
    </Row>
  );
};
const results = (data) => {
  if (R.length(data) > 0) {
    return (
      <Row
        gutter={[16, 16]}
        type="flex"
        align="middle"
        style={{ minHeight: "78vh" }}
      >
        {data.map((image) => {
          return (
            <Col span={8} align="middle">
              <Card
                hoverable
                style={{ width: 240 }}
                cover={
                  <img src={`${BACKEND_URL}/${image._id}`} />
                }
              >
                <Meta title={image.name} description={`Tags: ${image.tags}`} />
              </Card>
            </Col>
          );
        })}
      </Row>
    );
  } else {
    return error();
  }
};

module.exports = {
  results,
};
