import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Formik } from "formik";
import signupValidation from "../validation/signupValidation";
import { Button, Input, Card, Form } from "antd";
import api from "../services/api";
const Signup = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: 60 }}>
      <Card title="Signup" style={{ width: 400 }}>
        <Formik
          initialValues={{ name: "", email: "", password: "", username: "" }}
          validationSchema={signupValidation}
          onSubmit={(values, { setSubmitting }) => {
            console.log(values);
            api
              .post("/auth/signup", values)
              .then((res) => {
                console.log(res);
                setSubmitting(false);
                navigate("/login", { replace: true });
              })
              .catch((err) => {
                console.log(err);
                setSubmitting(false);
                alert(err?.response?.data.message || "Signup failed");
              });
          }}
        >
          {({ handleSubmit, handleChange, handleBlur, values, errors, touched, isSubmitting }) => (
            <Form layout="vertical" onFinish={handleSubmit}>
              <Form.Item
                label="Name"
                validateStatus={touched.name && errors.name ? "error" : ""}
                help={touched.name && errors.name ? errors.name : null}
              >
                <Input
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Form.Item>
              <Form.Item
                label="Username"
                validateStatus={touched.username && errors.username ? "error" : ""}
                help={touched.username && errors.username ? errors.username : null}
              >
                <Input
                  name="username"
                  value={values.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Form.Item>
              <Form.Item
                label="Email"
                validateStatus={touched.email && errors.email ? "error" : ""}
                help={touched.email && errors.email ? errors.email : null}
              >
                <Input
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Form.Item>
              <Form.Item
                label="Password"
                validateStatus={touched.password && errors.password ? "error" : ""}
                help={touched.password && errors.password ? errors.password : null}
              >
                <Input.Password
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" block loading={isSubmitting} disabled={isSubmitting}>
                  Signup
                </Button>
              </Form.Item>
              <div style={{ textAlign: "center" }}>
                Already have an account? <Link to="/login">Login</Link>
              </div>
            </Form>
          )}
        </Formik>
      </Card>
    </div>
  );
};

export default Signup;
