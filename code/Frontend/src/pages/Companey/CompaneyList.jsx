import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button, Space, Popconfirm, message } from "antd";
import { listCompaneys, deleteCompaney } from "../../services/companeyService";
import api from '../../services/api'

const CompaneyList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetch = async () => {
    setLoading(true);
    const res = await listCompaneys();
    if (res.success) {
      setData(res.data.rows);
    } else {
      if (res.message == "Unauthorized") {
        localStorage.removeItem('userData');
        navigate("/login");
      }
      alert(res.message);
      
    }
    setLoading(false);
  };

  useEffect(() => {
    fetch();
  }, []);

  const handleDelete = async (id) => {
    await deleteCompaney(id);
    message.success("Deleted");
    fetch();
  };

  const columns = [
    {
      title: "Logo",
      dataIndex: "companeyDoc",
      key: "companeyDoc",
      render: (src) => {
        if (!src) return null;
        // Build the final href, avoiding double URL prefixes
        let href = src;
        if (!String(src).startsWith('http')) {
          href = `${api.defaults.baseURL}/${String(src).replace(/^\//, '')}`;
        }
        return (
          <a href={href} target="_blank" rel="noreferrer">
            Preview
          </a>
        );
      },
    },
    { title: "Name", dataIndex: "companeyName", key: "companeyName" },
    { title: "Email", dataIndex: "companeyEmail", key: "companeyEmail" },
    { title: "Phone", dataIndex: "companeyPhone", key: "companeyPhone" },
    { title: "Address", dataIndex: "companeyAddress", key: "companeyAddress" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button onClick={() => navigate(`/companey/${record.id}/edit`)}>
            Edit
          </Button>
          <Popconfirm title="Delete?" onConfirm={() => handleDelete(record.id)}>
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={() => navigate("/companey/form") }>
          New Company
        </Button>
      </Space>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={loading}
      />
    </div>
  );
};

export default CompaneyList;
