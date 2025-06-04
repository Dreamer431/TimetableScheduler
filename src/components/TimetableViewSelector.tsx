import React from 'react';
import { Card, Select, Row, Col, Typography, Tag } from 'antd';
import { UserOutlined, HomeOutlined, BookOutlined, TeamOutlined, GlobalOutlined } from '@ant-design/icons';
import { TimetableViewType, TimetableViewConfig, Course, getUniqueValues } from '../types';

const { Title } = Typography;

interface TimetableViewSelectorProps {
  courses: Course[];
  currentView: TimetableViewConfig;
  onViewChange: (view: TimetableViewConfig) => void;
}

const TimetableViewSelector: React.FC<TimetableViewSelectorProps> = ({
  courses,
  currentView,
  onViewChange,
}) => {
  const { teachers, classes, subjects, rooms } = getUniqueValues(courses);

  const viewTypeOptions = [
    {
      value: TimetableViewType.ALL,
      label: '全校课程表',
      icon: <GlobalOutlined />,
      color: '#1890ff'
    },
    {
      value: TimetableViewType.CLASS,
      label: '班级课程表',
      icon: <TeamOutlined />,
      color: '#52c41a'
    },
    {
      value: TimetableViewType.TEACHER,
      label: '教师课程表',
      icon: <UserOutlined />,
      color: '#722ed1'
    },
    {
      value: TimetableViewType.ROOM,
      label: '教室课程表',
      icon: <HomeOutlined />,
      color: '#fa8c16'
    },
    {
      value: TimetableViewType.SUBJECT,
      label: '科目课程表',
      icon: <BookOutlined />,
      color: '#eb2f96'
    }
  ];

  const handleViewTypeChange = (type: TimetableViewType) => {
    if (type === TimetableViewType.ALL) {
      onViewChange({
        type,
        title: '全校课程表'
      });
    } else {
      // 重置target，让用户重新选择
      onViewChange({
        type,
        target: undefined,
        title: getViewTypeLabel(type)
      });
    }
  };

  const handleTargetChange = (target: string) => {
    const viewType = currentView.type;
    onViewChange({
      type: viewType,
      target,
      title: `${getViewTypeLabel(viewType)} - ${target}`
    });
  };

  const getViewTypeLabel = (type: TimetableViewType): string => {
    return viewTypeOptions.find(opt => opt.value === type)?.label || '';
  };

  const getTargetOptions = () => {
    switch (currentView.type) {
      case TimetableViewType.CLASS:
        return classes.map(cls => ({ value: cls, label: cls }));
      case TimetableViewType.TEACHER:
        return teachers.map(teacher => ({ value: teacher, label: teacher }));
      case TimetableViewType.ROOM:
        return rooms.map(room => ({ value: room, label: room }));
      case TimetableViewType.SUBJECT:
        return subjects.map(subject => ({ value: subject, label: subject }));
      default:
        return [];
    }
  };

  const getCurrentViewIcon = () => {
    const option = viewTypeOptions.find(opt => opt.value === currentView.type);
    return option ? option.icon : <GlobalOutlined />;
  };

  const getCurrentViewColor = () => {
    const option = viewTypeOptions.find(opt => opt.value === currentView.type);
    return option ? option.color : '#1890ff';
  };

  const getFilteredCoursesCount = () => {
    if (currentView.type === TimetableViewType.ALL) {
      return courses.length;
    }
    
    return courses.filter(course => {
      switch (currentView.type) {
        case TimetableViewType.CLASS:
          return course.class_name === currentView.target;
        case TimetableViewType.TEACHER:
          return course.teacher === currentView.target;
        case TimetableViewType.ROOM:
          return course.room === currentView.target;
        case TimetableViewType.SUBJECT:
          return course.name === currentView.target;
        default:
          return true;
      }
    }).length;
  };

  return (
    <Card size="small" style={{ marginBottom: 16 }}>
      <Row gutter={16} align="middle">
        <Col span={6}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: getCurrentViewColor(), fontSize: 16 }}>
              {getCurrentViewIcon()}
            </span>
            <Title level={5} style={{ margin: 0, color: getCurrentViewColor() }}>
              课程表视图
            </Title>
          </div>
        </Col>
        
        <Col span={6}>
          <Select
            value={currentView.type}
            onChange={handleViewTypeChange}
            style={{ width: '100%' }}
            placeholder="选择视图类型"
          >
            {viewTypeOptions.map(option => (
              <Select.Option key={option.value} value={option.value}>
                <span style={{ marginRight: 8, color: option.color }}>
                  {option.icon}
                </span>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        </Col>
        
        {currentView.type !== TimetableViewType.ALL && (
          <Col span={6}>
            <Select
              value={currentView.target}
              onChange={handleTargetChange}
              style={{ width: '100%' }}
              placeholder={`选择具体${getViewTypeLabel(currentView.type).replace('课程表', '')}`}
              allowClear
            >
              {getTargetOptions().map(option => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Col>
        )}
        
        <Col span={6}>
          <div style={{ textAlign: 'right' }}>
            <Tag color={getCurrentViewColor()}>
              当前显示 {getFilteredCoursesCount()} 门课程
            </Tag>
          </div>
        </Col>
      </Row>
      
      {currentView.target && (
        <Row style={{ marginTop: 8 }}>
          <Col span={24}>
            <div style={{ 
              padding: '8px 12px', 
              background: `${getCurrentViewColor()}10`, 
              borderRadius: 4,
              border: `1px solid ${getCurrentViewColor()}30`
            }}>
              <span style={{ color: getCurrentViewColor(), fontWeight: 'bold' }}>
                当前查看: {currentView.title}
              </span>
            </div>
          </Col>
        </Row>
      )}
    </Card>
  );
};

export default TimetableViewSelector;
