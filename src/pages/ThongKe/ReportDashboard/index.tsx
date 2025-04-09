import React, { useEffect, useState } from 'react';
import { Card, Statistic, Row, Col } from 'antd';
import { loadApplications, Application } from '@/models/applicationModel';

const ReportDashboard = () => {
  const [stats, setStats] = useState({
    Design: 0,
    Dev: 0,
    Media: 0,
    Approved: 0,
    Rejected: 0,
    Total: 0,
  });

  useEffect(() => {
    const applications: Application[] = loadApplications();
    const counts = {
      Design: applications.filter(a => a.nguyenVong === 'Design').length,
      Dev: applications.filter(a => a.nguyenVong === 'Dev').length,
      Media: applications.filter(a => a.nguyenVong === 'Media').length,
      Approved: applications.filter(a => a.status === 'Approved').length,
      Rejected: applications.filter(a => a.status === 'Rejected').length,
      Total: applications.length,
    };
    setStats(counts);
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Báo cáo & Thống kê</h2>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}><Card><Statistic title="Tổng đơn" value={stats.Total} /></Card></Col>
        <Col xs={24} sm={12} md={8}><Card><Statistic title="Design" value={stats.Design} /></Card></Col>
        <Col xs={24} sm={12} md={8}><Card><Statistic title="Dev" value={stats.Dev} /></Card></Col>
        <Col xs={24} sm={12} md={8}><Card><Statistic title="Media" value={stats.Media} /></Card></Col>
        <Col xs={24} sm={12} md={8}><Card><Statistic title="Đã duyệt" value={stats.Approved} valueStyle={{ color: 'green' }} /></Card></Col>
        <Col xs={24} sm={12} md={8}><Card><Statistic title="Từ chối" value={stats.Rejected} valueStyle={{ color: 'red' }} /></Card></Col>
      </Row>
    </div>
  );
};

export default ReportDashboard;
