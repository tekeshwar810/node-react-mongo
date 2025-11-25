import React from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Formik } from 'formik'
import { Button, Input, Card, Form } from 'antd'
import api from '../services/api'
const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/companey'

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 60 }}>
      <Card title="Login" style={{ width: 400 }}>
        <Formik
          initialValues={{ email: '', password: '' }}
          onSubmit={(values, { setSubmitting }) => {

            api.post('/auth/login', values).then((res) => {
              localStorage.setItem('userData', JSON.stringify(res.data.data))
              setSubmitting(false)
              navigate(from, { replace: true })
            }).catch((err) => {
              console.log(err)
              alert('Invalid credentials')
            })
         }}
        >
          {({ handleSubmit, handleChange, values }) => (
            <Form layout="vertical" onFinish={handleSubmit}>
              <Form.Item label="Email">
                <Input name="email" value={values.email} onChange={handleChange} />
              </Form.Item>
              <Form.Item label="Password">
                <Input.Password name="password" value={values.password} onChange={handleChange} />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  Login
                </Button>
              </Form.Item>
              <div style={{ textAlign: 'center' }}>
                Don't have an account? <Link to="/signup">Signup</Link>
              </div>
            </Form>
          )}
        </Formik>
      </Card>
    </div>
  )
}

export default Login
