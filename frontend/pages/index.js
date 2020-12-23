import styles from "../styles/Home.module.css";
import { Row, Col, Typography, Button, Layout } from "antd";
import { useRouter } from "next/router";

const { Footer } = Layout;

export default function Home() {
  const router = useRouter();
  return (
    <div className={styles.container}>
      <Layout>
        <Row
          type="flex"
          align="middle"
          style={{ minHeight: "90vh", minWidth: "100vw" }}
          justify="center"
        >
          <Col type="flex" align="middle" justify="center">
            <Typography.Title>Frame</Typography.Title>
            <h3> yet another image hosting repository. </h3>
            <Row justify="center" gutter={{ xs: 8, sm: 16, md: 24 }}>
              <Col>
                {" "}
                <Button
                  size="large"
                  type="primary"
                  onClick={() => router.push("/upload")}
                >
                  {" "}
                  Upload{" "}
                </Button>{" "}
              </Col>
              <Col>
                {" "}
                <Button
                  size="large"
                  type="secondary"
                  onClick={() => router.push("/search")}
                >
                  {" "}
                  Search{" "}
                </Button>{" "}
              </Col>
            </Row>
          </Col>
        </Row>
        <Footer>built for the shopify dev challenge by r614</Footer>
      </Layout>
    </div>
  );
}
