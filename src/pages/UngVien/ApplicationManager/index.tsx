import React, { useState, useEffect } from "react";
import {
  Table,
  Input,
  Button,
  Space,
  Modal,
  Tag,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  SearchOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { loadApplications, saveApplications, Application } from '@/models/applicationModel';

const ApplicantManagement: React.FC = () => {
  const [data, setData] = useState<Application[]>([]);
  const [searchText, setSearchText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<Application | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    setData(loadApplications());
  }, []);

  const handleAction = (record: Application, action: "Approved" | "Rejected") => {
    if (action === "Rejected") {
      setSelectedApplicant(record);
      setModalVisible(true);
    } else {
      updateStatus(record, action, "Được duyệt");
    }
  };

  const updateStatus = (record: Application, status: "Approved" | "Rejected", customNote?: string) => {
    const currentTime = `${new Date().toLocaleTimeString()} ${new Date().toLocaleDateString()}`;
    const reason = status === "Rejected" ? notes[record.key] || "Không có lý do" : customNote || "";
    const log = `Admin đã ${status === "Approved" ? "duyệt" : "từ chối"} vào lúc ${currentTime} với lý do: ${reason}`;
    const newData = data.map((item) =>
      item.key === record.key ? { ...item, status, log } : item
    );
    setData(newData);
    saveApplications(newData);
    message.success(`Ứng viên đã được ${status === "Approved" ? "duyệt" : "từ chối"}`);
    setModalVisible(false);
    setNotes((prev) => {
      const newNotes = { ...prev };
      delete newNotes[record.key];
      return newNotes;
    });
  };

  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.email.toLowerCase().includes(searchText.toLowerCase()) ||
      item.nguyenVong.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns: ColumnsType<Application> = [
    {
      title: "Họ tên",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Nguyện vọng",
      dataIndex: "nguyenVong",
      filters: [
        { text: "Design", value: "Design" },
        { text: "Dev", value: "Dev" },
        { text: "Media", value: "Media" },
      ],
      onFilter: (value, record) => record.nguyenVong === value,
    },
    {
      title: "Lý do đăng ký",
      dataIndex: "reason",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      filters: [
        { text: "Pending", value: "Pending" },
        { text: "Approved", value: "Approved" },
        { text: "Rejected", value: "Rejected" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => {
        const color = status === "Approved" ? "green" : status === "Rejected" ? "red" : "orange";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Ghi chú",
      dataIndex: "log",
      render: (log) => log || "--",
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Space>
          <Button
            icon={<CheckOutlined />}
            onClick={() => handleAction(record, "Approved")}
            disabled={record.status !== "Pending"}
          >
            Duyệt
          </Button>
          <Button
            icon={<CloseOutlined />}
            danger
            onClick={() => handleAction(record, "Rejected")}
            disabled={record.status !== "Pending"}
          >
            Từ chối
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4">
      <Input
        placeholder="Tìm kiếm theo tên, email, nguyện vọng..."
        prefix={<SearchOutlined />}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="mb-4"
      />
  
      {/* Bọc bảng để hỗ trợ responsive trên mobile */}
      <div style={{ overflowX: "auto" }}>
        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={{ pageSize: 5 }}
          rowKey="key"
          scroll={{ x: "max-content" }} // Cho phép cuộn ngang
        />
      </div>
  
      <Modal
        title="Từ chối ứng viên"
        visible={modalVisible}
        onOk={() => selectedApplicant && updateStatus(selectedApplicant, "Rejected")}
        onCancel={() => setModalVisible(false)}
        okText="Xác nhận từ chối"
        cancelText="Hủy"
      >
        <Input.TextArea
          rows={4}
          placeholder="Nhập lý do từ chối."
          value={selectedApplicant ? notes[selectedApplicant.key] || "" : ""}
          onChange={(e) =>
            selectedApplicant &&
            setNotes((prev) => ({ ...prev, [selectedApplicant.key]: e.target.value }))
          }
        />
      </Modal>
    </div>
  );
  
};

export default ApplicantManagement;