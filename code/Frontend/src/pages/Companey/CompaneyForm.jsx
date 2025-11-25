import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Formik } from "formik";
import { Form, Input, Button, Card, Upload, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import {
  createCompaney,
  updateCompaney,
  getCompaney,
  uploadFile,
  uploadImages,
} from "../../services/companeyService";
import api from '../../services/api'
import companeyValidation from '../../validation/companeyValidation'

const { Dragger } = Upload;

const CompaneyForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initial, setInitial] = useState({ companeyName: "", companeyEmail: "", companeyPhone: "", companeyAddress: "", companeyDoc: "", companeyUsers: [] });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (id) {

      (async () => {
        const getData = await getCompaney(id);
        if (getData.success){
          const data = getData.data.companey || getData.data;
          
          // Helper to strip duplicate URL prefix if present
          const cleanUrl = (url) => {
            if (!url) return '';
            const urlStr = String(url);
            // If it contains the full base URL, extract just the path
            const baseUrl = api.defaults.baseURL;
            if (urlStr.includes(baseUrl)) {
              return urlStr.split(baseUrl)[1] || urlStr;
            }
            return urlStr.replace(/^\//, '');
          };
          
          // normalize user images (strip leading slash and duplicate URLs) if present
          const users = (data?.companeyUsers || []).map((u) => ({
            ...u,
            image: u?.image ? cleanUrl(u.image) : u?.image,
          }));

          setInitial({
            companeyName: data?.companeyName || "",
            companeyEmail: data?.companeyEmail || "",
            companeyPhone: data?.companeyPhone || "",
            companeyAddress: data?.companeyAddress || "",
            companeyDoc: cleanUrl(data?.companeyDoc || ""),
            companeyUsers: users,
          });
        }
      })();
    }
  }, [id]);

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
      <Card title={id ? "Edit Company" : "New Company"} style={{ width: 600 }}>
        <Formik
          enableReinitialize
          initialValues={initial}
          validationSchema={companeyValidation}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const sanitizedUsers = (values.companeyUsers || []).map((u) => {
                const user = {
                  firstName: u.firstName || '',
                  lastName: u.lastName || '',
                  email: u.email || '',
                  address: u.address || '',
                };
                if (u.image) {
                  user.image = String(u.image).replace(/^\//, '');
                } else if (!id) {
                  user.image = '';
                }
                return user;
              });

              const payload = {
                companeyName: values.companeyName,
                companeyEmail: values.companeyEmail,
                companeyPhone: values.companeyPhone,
                companeyAddress: values.companeyAddress,
                companeyDoc: values.companeyDoc,
                companeyUsers: sanitizedUsers,
              }

              if (id) {
                const updateCompaneyResponse = await updateCompaney(id, payload);
                if(updateCompaneyResponse.success){
                  alert("Company updated successfully");
                  navigate("/companey");
                }
              } else {
                const addCompaneyResponse = await createCompaney(payload);
                if(addCompaneyResponse?.data?.success || addCompaneyResponse?.success){
                  alert("Company added successfully");
                }
                navigate("/companey");
              }
              
              
            } catch (err) {
              message.error("Save failed");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ values, handleSubmit, setFieldValue, setFieldTouched, handleChange, handleBlur, errors, touched }) => (
            <Form layout="vertical" onFinish={handleSubmit}>
              <Form.Item 
                label="Company Name"
                validateStatus={touched.companeyName && errors.companeyName ? "error" : ""}
                help={touched.companeyName && errors.companeyName ? errors.companeyName : null}
              >
                <Input
                  name="companeyName"
                  value={values.companeyName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Form.Item>

              <Form.Item 
                label="Email"
                validateStatus={touched.companeyEmail && errors.companeyEmail ? "error" : ""}
                help={touched.companeyEmail && errors.companeyEmail ? errors.companeyEmail : null}
              >
                <Input
                  name="companeyEmail"
                  value={values.companeyEmail}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Form.Item>

              <Form.Item 
                label="Phone"
                validateStatus={touched.companeyPhone && errors.companeyPhone ? "error" : ""}
                help={touched.companeyPhone && errors.companeyPhone ? errors.companeyPhone : null}
              >
                <Input
                  name="companeyPhone"
                  value={values.companeyPhone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Form.Item>

              <Form.Item 
                label="Address"
                validateStatus={touched.companeyAddress && errors.companeyAddress ? "error" : ""}
                help={touched.companeyAddress && errors.companeyAddress ? errors.companeyAddress : null}
              >
                <Input
                  name="companeyAddress"
                  value={values.companeyAddress}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Form.Item>

              <Form.Item 
                label="Logo / Document"
                validateStatus={touched.companeyDoc && errors.companeyDoc ? "error" : ""}
                help={touched.companeyDoc && errors.companeyDoc ? errors.companeyDoc : null}
              >
                <Dragger
                  name="file"
                  multiple={false}
                  showUploadList={false}
                  beforeUpload={async (file) => {
                    // upload immediately and store returned url
                    try {
                      setUploading(true);
                      const res = await uploadFile(id || '0', file);
                      if (res?.success && res.data?.url) {
                        // strip leading slash so backend model getter doesn't create double slashes
                        const normalized = res.data.url.replace(/^\//, '');
                        setFieldValue('companeyDoc', normalized);
                        message.success('File uploaded');
                      } else {
                        message.error(res.message || 'Upload failed');
                      }
                    } catch (e) {
                      message.error('Upload failed');
                    } finally {
                      setUploading(false);
                    }
                    // prevent default upload handling
                    return false;
                  }}
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Click or drag file to upload
                  </p>
                </Dragger>
                {values.companeyDoc ? (
                  // if it's a URL string show a link, else file preview
                  typeof values.companeyDoc === 'string' ? (
                    <div style={{ marginTop: 8 }}>
                      <a
                        href={
                          values.companeyDoc.startsWith('http')
                            ? values.companeyDoc
                            : `${api.defaults.baseURL}/${values.companeyDoc.replace(/^\//, '')}`
                        }
                        target="_blank"
                        rel="noreferrer"
                      >
                        Uploaded file
                      </a>
                    </div>
                  ) : (
                    <img
                      src={
                        values.companeyDoc instanceof File
                          ? URL.createObjectURL(values.companeyDoc)
                          : values.companeyDoc
                      }
                      alt="preview"
                      style={{ marginTop: 8, maxWidth: "100%" }}
                    />
                  )
                ) : null}
              </Form.Item>

              <Form.Item label="Users">
                {(values.companeyUsers || []).map((u, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                    <Input
                      placeholder="First name"
                      value={u.firstName}
                      onChange={(e) => {
                        const arr = [...(values.companeyUsers || [])];
                        arr[idx] = { ...arr[idx], firstName: e.target.value };
                        setFieldValue('companeyUsers', arr);
                      }}
                      style={{ width: 140 }}
                    />
                    <Input
                      placeholder="Last name"
                      value={u.lastName}
                      onChange={(e) => {
                        const arr = [...(values.companeyUsers || [])];
                        arr[idx] = { ...arr[idx], lastName: e.target.value };
                        setFieldValue('companeyUsers', arr);
                      }}
                      style={{ width: 140 }}
                    />
                    <Input
                      placeholder="Email"
                      value={u.email}
                      onChange={(e) => {
                        const arr = [...(values.companeyUsers || [])];
                        arr[idx] = { ...arr[idx], email: e.target.value };
                        setFieldValue('companeyUsers', arr);
                      }}
                      style={{ width: 200 }}
                    />
                    <Input
                      placeholder="Address"
                      value={u.address}
                      onChange={(e) => {
                        const arr = [...(values.companeyUsers || [])];
                        arr[idx] = { ...arr[idx], address: e.target.value };
                        setFieldValue('companeyUsers', arr);
                      }}
                      style={{ width: 200 }}
                    />

                    {/* User image upload */}
                    <Upload
                      showUploadList={false}
                      beforeUpload={async (file) => {
                        try {
                          // Use the images upload endpoint for user images
                          const res = await uploadImages(id || '0', file);
                          if (res?.success && res.data?.url) {
                            const normalized = String(res.data.url).replace(/^\//, '');
                            const arr = [...(values.companeyUsers || [])];
                            arr[idx] = { ...arr[idx], image: normalized };
                            setFieldValue('companeyUsers', arr);
                            message.success('User image uploaded');
                          } else {
                            message.error(res.message || 'Upload failed');
                          }
                        } catch (e) {
                          message.error('Upload failed');
                        }
                        return false;
                      }}
                    >
                      <Button type="default">Upload image</Button>
                    </Upload>

                    {u?.image ? (
                      <img
                        src={
                          u.image.startsWith('http')
                            ? u.image
                            : `${api.defaults.baseURL}/${String(u.image).replace(/^\//, '')}`
                        }
                        alt="user"
                        style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 4 }}
                      />
                    ) : null}

                    <Button danger onClick={() => {
                      const arr = [...(values.companeyUsers || [])];
                      arr.splice(idx, 1);
                      setFieldValue('companeyUsers', arr);
                    }}>Remove</Button>
                  </div>
                ))}
                <Button onClick={() => {
                  const arr = [...(values.companeyUsers || [])];
                  arr.push({ firstName: '', lastName: '', email: '', address: '', image: '' });
                  setFieldValue('companeyUsers', arr);
                }} type="dashed">+ Add user</Button>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Save
                </Button>
                <Button
                  style={{ marginLeft: 8 }}
                  onClick={() => navigate("/companey")}
                >
                  Cancel
                </Button>
              </Form.Item>
            </Form>
          )}
        </Formik>
      </Card>
    </div>
  );
};

export default CompaneyForm;
