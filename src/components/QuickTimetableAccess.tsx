import React from 'react';
import { Card, Row, Col, Button, Typography, Badge, Divider } from 'antd';
import { UserOutlined, HomeOutlined, BookOutlined, TeamOutlined, ExperimentOutlined } from '@ant-design/icons';
import { Course, getAllUniqueValues, TimetableViewType, TimetableViewConfig } from '../types';

const { Title, Text } = Typography;

interface QuickTimetableAccessProps {
  courses: Course[];
  onViewChange: (view: TimetableViewConfig) => void;
  onLoadDemoData?: () => void;
}

const QuickTimetableAccess: React.FC<QuickTimetableAccessProps> = ({ courses, onViewChange, onLoadDemoData }) => {
  const { teachers, classes, subjects, rooms } = getAllUniqueValues(courses);

  const handleQuickAccess = (type: TimetableViewType, target: string) => {
    const titles = {
      [TimetableViewType.ALL]: '全校课程表',
      [TimetableViewType.OVERVIEW]: '总览',
      [TimetableViewType.CLASS]: '班级课程表',
      [TimetableViewType.TEACHER]: '教师课程表',
      [TimetableViewType.ROOM]: '教室课程表',
      [TimetableViewType.SUBJECT]: '科目课程表'
    };

    onViewChange({
      type,
      target,
      title: `${titles[type]} - ${target}`
    });
  };

  const getItemCount = (type: TimetableViewType, target: string) => {
    return courses.filter(course => {
      switch (type) {
        case TimetableViewType.CLASS:
          return course.class_name === target;
        case TimetableViewType.TEACHER:
          return course.teacher === target;
        case TimetableViewType.ROOM:
          return course.room === target;
        case TimetableViewType.SUBJECT:
          return course.name === target;
        default:
          return true;
      }
    }).length;
  };

  const renderQuickAccessSection = (
    title: string,
    icon: React.ReactNode,
    items: string[],
    type: TimetableViewType,
    color: string
  ) => (
    <Card 
      size="small" 
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color }}>{icon}</span>
          <span>{title}</span>
          <Badge count={items.length} style={{ backgroundColor: color }} />
        </div>
      }
      style={{ height: '100%' }}
    >
      <div style={{ maxHeight: 200, overflowY: 'auto' }}>
        {items.slice(0, 10).map(item => (
          <div key={item} style={{ marginBottom: 8 }}>
            <Button
              type="text"
              size="small"
              onClick={() => handleQuickAccess(type, item)}
              style={{ 
                width: '100%', 
                textAlign: 'left',
                padding: '4px 8px',
                height: 'auto',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <Text ellipsis style={{ flex: 1 }}>{item}</Text>
              <Badge 
                count={getItemCount(type, item)} 
                size="small"
                style={{ backgroundColor: color }}
              />
            </Button>
          </div>
        ))}
        {items.length > 10 && (
          <Text type="secondary" style={{ fontSize: 12 }}>
            还有 {items.length - 10} 个...
          </Text>
        )}
      </div>
    </Card>
  );

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <Title level={3} style={{ margin: 0 }}>
          快速访问课程表
        </Title>
        {onLoadDemoData && (
          <Button
            type={courses.length === 0 ? "primary" : "default"}
            icon={<ExperimentOutlined />}
            onClick={onLoadDemoData}
          >
            {courses.length === 0 ? "加载演示数据" : "重新加载演示数据"}
          </Button>
        )}
      </div>
      
      <Row gutter={[16, 16]}>
        <Col span={6}>
          {renderQuickAccessSection(
            '班级课程表',
            <TeamOutlined />,
            classes,
            TimetableViewType.CLASS,
            '#52c41a'
          )}
        </Col>
        
        <Col span={6}>
          {renderQuickAccessSection(
            '教师课程表',
            <UserOutlined />,
            teachers,
            TimetableViewType.TEACHER,
            '#722ed1'
          )}
        </Col>
        
        <Col span={6}>
          {renderQuickAccessSection(
            '教室课程表',
            <HomeOutlined />,
            rooms,
            TimetableViewType.ROOM,
            '#fa8c16'
          )}
        </Col>
        
        <Col span={6}>
          {renderQuickAccessSection(
            '科目课程表',
            <BookOutlined />,
            subjects,
            TimetableViewType.SUBJECT,
            '#eb2f96'
          )}
        </Col>
      </Row>

      <Divider />

      <Row gutter={16}>
        <Col span={24}>
          <Card size="small">
            <Row gutter={16} align="middle">
              <Col span={6}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}>
                    {courses.length}
                  </div>
                  <div style={{ color: '#666' }}>总课程数</div>
                </div>
              </Col>
              <Col span={6}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>
                    {classes.length}
                  </div>
                  <div style={{ color: '#666' }}>班级数</div>
                </div>
              </Col>
              <Col span={6}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 'bold', color: '#722ed1' }}>
                    {teachers.length}
                  </div>
                  <div style={{ color: '#666' }}>教师数</div>
                </div>
              </Col>
              <Col span={6}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 'bold', color: '#fa8c16' }}>
                    {rooms.length}
                  </div>
                  <div style={{ color: '#666' }}>教室数</div>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default QuickTimetableAccess;
