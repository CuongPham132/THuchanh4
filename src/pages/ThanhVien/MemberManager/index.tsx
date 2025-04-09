import React, { useEffect, useState } from 'react';
import { Table, Select, Button } from 'antd';
import * as XLSX from 'xlsx';

const MemberManager = () => {
  const [members, setMembers] = useState<any[]>([]);

  useEffect(() => {
    const applications = JSON.parse(localStorage.getItem('applications') || '[]');
    const approved = applications.filter((app: any) => app.status === 'Approved');
    setMembers(approved);
  }, []);

  const handleChangeGroup = (value: string, record: any) => {
    const updated = members.map(m => m.key === record.key ? { ...m, group: value } : m);
    setMembers(updated);
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(members);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Members');
    XLSX.writeFile(wb, 'DanhSachThanhVien.xlsx');
  };

  return (
    <div>
      <h2>Quản lý thành viên</h2>
      <Button onClick={exportToExcel} type="primary" style={{ marginBottom: 16 }}>Xuất file Excel</Button>
      <Table
        dataSource={members}
        rowKey="key"
        columns={[
          { title: 'Họ tên', dataIndex: 'name' },
          { title: 'Email', dataIndex: 'email' },
          { title: 'Vai trò', dataIndex: 'nguyenVong' },
          {
            title: 'Nhóm',
            dataIndex: 'group',
            render: (_, record) => (
              <Select defaultValue={record.group} onChange={(val) => handleChangeGroup(val, record)}>
                <Select.Option value="Design">Design</Select.Option>
                <Select.Option value="Dev">Dev</Select.Option>
                <Select.Option value="Media">Media</Select.Option>
              </Select>
            )
          },
        ]}
      />
    </div>
  );
};

export default MemberManager;
