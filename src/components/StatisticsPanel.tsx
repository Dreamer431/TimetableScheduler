import React from 'react';
import { Card, Row, Col, Statistic, Table, Tag } from 'antd';
import { BookOutlined, UserOutlined, HomeOutlined, TeamOutlined } from '@ant-design/icons';
import { Statistics } from '../types';

interface StatisticsPanelProps {
  statistics: Statistics;
}

const StatisticsPanel: React.FC<StatisticsPanelProps> = ({ statistics }) => {
  // 教室利用率表格列
  const roomColumns = [
    {
      title: '教室',
      dataIndex: 'room',
      key: 'room',
    },
    {
      title: '使用节数',
      dataIndex: 'usage',
      key: 'usage',
      render: (usage: number) => (
        <Tag color={usage > 20 ? 'red' : usage > 10 ? 'orange' : 'green'}>
          {usage} 节
        </Tag>
      ),
    },
    {
      title: '利用率',
      dataIndex: 'utilization',
      key: 'utilization',
      render: (utilization: number) => `${utilization.toFixed(1)}%`,
    },
  ];

  // 教师工作量表格列
  const teacherColumns = [
    {
      title: '教师',
      dataIndex: 'teacher',
      key: 'teacher',
    },
    {
      title: '授课节数',
      dataIndex: 'workload',
      key: 'workload',
      render: (workload: number) => (
        <Tag color={workload > 20 ? 'red' : workload > 10 ? 'orange' : 'green'}>
          {workload} 节
        </Tag>
      ),
    },
    {
      title: '工作量',
      dataIndex: 'percentage',
      key: 'percentage',
      render: (percentage: number) => `${percentage.toFixed(1)}%`,
    },
  ];

  // 处理教室数据
  const roomData = Object.entries(statistics.roomUtilization).map(([room, usage]) => ({
    key: room,
    room,
    usage,
    utilization: (usage / 70) * 100, // 假设每周最多70节课（7天×10节）
  })).sort((a, b) => b.usage - a.usage);

  // 处理教师数据
  const totalWorkload = Object.values(statistics.teacherWorkload).reduce((sum, load) => sum + load, 0);
  const teacherData = Object.entries(statistics.teacherWorkload).map(([teacher, workload]) => ({
    key: teacher,
    teacher,
    workload,
    percentage: totalWorkload > 0 ? (workload / totalWorkload) * 100 : 0,
  })).sort((a, b) => b.workload - a.workload);

  return (
    <div style={{ padding: '20px' }}>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总课程数"
              value={statistics.totalCourses}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="教师数量"
              value={statistics.teacherCount}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="班级数量"
              value={statistics.classCount}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="使用教室数"
              value={Object.keys(statistics.roomUtilization).length}
              prefix={<HomeOutlined />}
              valueStyle={{ color: '#eb2f96' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="教室利用率" size="small">
            <Table
              columns={roomColumns}
              dataSource={roomData}
              pagination={{ pageSize: 10 }}
              size="small"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="教师工作量" size="small">
            <Table
              columns={teacherColumns}
              dataSource={teacherData}
              pagination={{ pageSize: 10 }}
              size="small"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card title="科目分布" size="small">
            <Table
              columns={[
                { title: '科目', dataIndex: 'subject', key: 'subject' },
                {
                  title: '课程数',
                  dataIndex: 'count',
                  key: 'count',
                  render: (count: number) => (
                    <Tag color="blue">{count} 门</Tag>
                  )
                }
              ]}
              dataSource={Object.entries(statistics.subjectDistribution).map(([subject, count]) => ({
                key: subject,
                subject,
                count
              })).sort((a, b) => b.count - a.count)}
              pagination={{ pageSize: 10 }}
              size="small"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="班级课程统计" size="small">
            <Table
              columns={[
                { title: '班级', dataIndex: 'className', key: 'className' },
                {
                  title: '总课时',
                  dataIndex: 'totalHours',
                  key: 'totalHours',
                  render: (hours: number) => (
                    <Tag color="green">{hours} 节</Tag>
                  )
                }
              ]}
              dataSource={Object.entries(statistics.classScheduleStats).map(([className, hours]) => ({
                key: className,
                className,
                totalHours: hours
              })).sort((a, b) => b.totalHours - a.totalHours)}
              pagination={{ pageSize: 10 }}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StatisticsPanel;
