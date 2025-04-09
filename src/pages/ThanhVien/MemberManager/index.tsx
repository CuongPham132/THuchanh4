import React, { useEffect, useState } from 'react';
import { Table, Select, Button, message, Tooltip } from 'antd';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { FileExcelOutlined } from '@ant-design/icons';

const { Option } = Select;

const MemberManager = () => {
  const [members, setMembers] = useState([]);
  const [filteredInfo, setFilteredInfo] = useState({});

  useEffect(() => {
    const applications = JSON.parse(localStorage.getItem('applications')) || [];
    const approved = applications
      .filter((item) => item.status === 'Approved')
      .map((item, index) => ({
        key: index,
        fullName: item.fullName || item.name,
        email: item.email,
        role: item.role || item.nguyenVong || 'Thành viên',
        group: item.group || 'Team Design',
      }));
    setMembers(approved);
  }, []);

  const handleChangeGroup = (value, record) => {
    const updatedMembers = members.map((m) =>
      m.key === record.key ? { ...m, group: value } : m
    );
    setMembers(updatedMembers);
    message.success(`Đã đổi nhóm cho ${record.fullName}`);

    // Cập nhật localStorage
    const allApplications = JSON.parse(localStorage.getItem('applications')) || [];
    const updatedApplications = allApplications.map((app) => {
      if ((app.fullName || app.name) === record.fullName && app.email === record.email) {
        return { ...app, group: value };
      }
      return app;
    });
    localStorage.setItem('applications', JSON.stringify(updatedApplications));
  };

  const exportToExcel = () => {
    const exportData = members.map(({ fullName, email, role, group }) => ({
      HọTên: fullName,
      Email: email,
      VaiTrò: role,
      Nhóm: group,
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Thành viên');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const fileData = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(fileData, 'danh_sach_thanh_vien.xlsx');
  };

  const uniqueValues = (key) => {
    return [...new Set(members.map((item) => item[key]))].map((value) => ({
      text: value,
      value,
    }));
  };

  const clearFilters = () => {
    setFilteredInfo({});
  };

  const columns = [
    {
      title: 'Họ tên',
      dataIndex: 'fullName',
      key: 'fullName',
      align: 'center',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      align: 'center',
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      align: 'center',
      filters: uniqueValues('role'),
      filteredValue: filteredInfo.role || null,
      onFilter: (value, record) => record.role === value,
    },
    {
      title: 'Nhóm',
      dataIndex: 'group',
      key: 'group',
      align: 'center',
      filters: uniqueValues('group'),
      filteredValue: filteredInfo.group || null,
      onFilter: (value, record) => record.group === value,
      render: (text, record) => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Select
            value={text}
            onChange={(value) => handleChangeGroup(value, record)}
            style={{ width: 160 }}
          >
            <Option value="Team Design">Team Design</Option>
            <Option value="Team Dev">Team Dev</Option>
            <Option value="Team Media">Team Media</Option>
          </Select>
        </div>
      ),
    },
  ];

  const isFiltered = Object.values(filteredInfo).some((v) => v && v.length > 0);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        padding: 20,
      }}
    >
      <h1 style={{ textAlign: 'center', fontSize: '28px', fontWeight: 'bold', marginBottom: 24 }}>
        DANH SÁCH THÀNH VIÊN
      </h1>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        {isFiltered ? (
          <Button type="primary" onClick={clearFilters}>
            Xóa bộ lọc
          </Button>
        ) : (
          <div />
        )}

        <Tooltip title="Xuất danh sách thành viên ra Excel">
          <Button
            icon={<FileExcelOutlined />}
            onClick={exportToExcel}
            style={{
              backgroundColor: '#cf1322',
              borderColor: '#cf1322',
              color: '#fff',
            }}
          >
            Xuất Excel
          </Button>
        </Tooltip>
      </div>

      <Table
        columns={columns}
        dataSource={members}
        pagination={{ position: ['bottomCenter'] }}
        bordered
        onChange={(pagination, filters) => setFilteredInfo(filters)}
        footer={() => (
          <div style={{ textAlign: 'right', fontWeight: 'bold' }}>
            Tổng cộng: {members.length} thành viên
          </div>
        )}
      />
    </div>
  );
};

export default MemberManager;
