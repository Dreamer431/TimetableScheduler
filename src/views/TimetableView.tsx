import React, { useState } from 'react';
import { Card, Select, Row, Col, Button, Space, Typography } from 'antd';
import { PrinterOutlined, DownloadOutlined, EyeOutlined } from '@ant-design/icons';
import {
  ProjectState,
  TimetableViewType,
  TimetableViewConfig,
  ExportType,
  ExportConfig
} from '../types/';

// 导入课程表组件
import {
  ClassTimetable,
  TeacherTimetable,
  RoomTimetable,
  MasterTimetable
} from '../components/timetables';

const { Title } = Typography;

interface TimetableViewProps {
  project: ProjectState;
  onExport: (config: ExportConfig) => void;
}

const TimetableView: React.FC<TimetableViewProps> = ({
  project,
  onExport
}) => {
  const [viewConfig, setViewConfig] = useState<TimetableViewConfig>({
    type: TimetableViewType.OVERVIEW,
    title: '课程表总览'
  });

  const handleViewTypeChange = (type: TimetableViewType) => {
    setViewConfig({
      type,
      targetId: undefined,
      title: getViewTypeTitle(type)
    });
  };

  const handleTargetChange = (targetId: string) => {
    const target = getTargetById(targetId);
    setViewConfig({
      ...viewConfig,
      targetId,
      title: `${getViewTypeTitle(viewConfig.type)} - ${target?.name || targetId}`
    });
  };

  const getViewTypeTitle = (type: TimetableViewType): string => {
    const titles = {
      [TimetableViewType.ALL]: '全校课程表',
      [TimetableViewType.OVERVIEW]: '课程表总览',
      [TimetableViewType.CLASS]: '班级课程表',
      [TimetableViewType.TEACHER]: '教师课程表',
      [TimetableViewType.ROOM]: '教室课程表',
      [TimetableViewType.SUBJECT]: '科目课程表'
    };
    return titles[type];
  };

  const getTargetById = (id: string) => {
    switch (viewConfig.type) {
      case TimetableViewType.CLASS:
        return project.classes.find(c => c.id === id);
      case TimetableViewType.TEACHER:
        return project.teachers.find(t => t.id === id);
      case TimetableViewType.ROOM:
        return project.rooms.find(r => r.id === id);
      case TimetableViewType.SUBJECT:
        return project.subjects.find(s => s.id === id);
      default:
        return null;
    }
  };

  const getTargetOptions = () => {
    switch (viewConfig.type) {
      case TimetableViewType.CLASS:
        return project.classes.map(c => ({ value: c.id, label: c.name }));
      case TimetableViewType.TEACHER:
        return project.teachers.map(t => ({ value: t.id, label: t.name }));
      case TimetableViewType.ROOM:
        return project.rooms.map(r => ({ value: r.id, label: r.name }));
      case TimetableViewType.SUBJECT:
        return project.subjects.map(s => ({ value: s.id, label: s.name }));
      default:
        return [];
    }
  };

  const handleExport = (format: 'pdf' | 'excel' | 'csv') => {
    let exportType: ExportType;
    let targets: string[] = [];

    switch (viewConfig.type) {
      case TimetableViewType.CLASS:
        exportType = ExportType.CLASS_TIMETABLE;
        targets = viewConfig.targetId ? [viewConfig.targetId] : project.classes.map(c => c.id);
        break;
      case TimetableViewType.TEACHER:
        exportType = ExportType.TEACHER_TIMETABLE;
        targets = viewConfig.targetId ? [viewConfig.targetId] : project.teachers.map(t => t.id);
        break;
      case TimetableViewType.ROOM:
        exportType = ExportType.ROOM_TIMETABLE;
        targets = viewConfig.targetId ? [viewConfig.targetId] : project.rooms.map(r => r.id);
        break;
      default:
        exportType = ExportType.MASTER_TIMETABLE;
        targets = ['all'];
    }

    const exportConfig: ExportConfig = {
      type: exportType,
      format,
      targets,
      includeEmpty: true,
      customTitle: viewConfig.title
    };

    onExport(exportConfig);
  };

  const renderTimetableContent = () => {
    if (project.courses.length === 0) {
      return (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 0',
          color: '#999'
        }}>
          <EyeOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
          <div>还没有排课数据</div>
          <div>请先完成排课流程</div>
        </div>
      );
    }

    const commonProps = {
      project,
      viewConfig
    };

    switch (viewConfig.type) {
      case TimetableViewType.CLASS:
        return <ClassTimetable {...commonProps} />;
      case TimetableViewType.TEACHER:
        return <TeacherTimetable {...commonProps} />;
      case TimetableViewType.ROOM:
        return <RoomTimetable {...commonProps} />;
      case TimetableViewType.SUBJECT:
        return <MasterTimetable {...commonProps} />;
      default:
        return <MasterTimetable {...commonProps} />;
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Row gutter={16} align="middle" style={{ marginBottom: '24px' }}>
          <Col span={6}>
            <Title level={4} style={{ margin: 0 }}>
              {viewConfig.title}
            </Title>
          </Col>
          
          <Col span={4}>
            <Select
              value={viewConfig.type}
              onChange={handleViewTypeChange}
              style={{ width: '100%' }}
              options={[
                { value: TimetableViewType.OVERVIEW, label: '总览' },
                { value: TimetableViewType.CLASS, label: '班级' },
                { value: TimetableViewType.TEACHER, label: '教师' },
                { value: TimetableViewType.ROOM, label: '教室' },
                { value: TimetableViewType.SUBJECT, label: '科目' }
              ]}
            />
          </Col>
          
          {viewConfig.type !== TimetableViewType.OVERVIEW && (
            <Col span={6}>
              <Select
                value={viewConfig.targetId}
                onChange={handleTargetChange}
                style={{ width: '100%' }}
                placeholder={`选择${getViewTypeTitle(viewConfig.type).replace('课程表', '')}`}
                allowClear
                options={getTargetOptions()}
              />
            </Col>
          )}
          
          <Col span={8} style={{ textAlign: 'right' }}>
            <Space>
              <Button
                icon={<PrinterOutlined />}
                onClick={() => window.print()}
              >
                打印
              </Button>
              <Button
                icon={<DownloadOutlined />}
                onClick={() => handleExport('pdf')}
              >
                导出PDF
              </Button>
              <Button
                icon={<DownloadOutlined />}
                onClick={() => handleExport('excel')}
              >
                导出Excel
              </Button>
            </Space>
          </Col>
        </Row>

        <div style={{ minHeight: '500px' }}>
          {renderTimetableContent()}
        </div>
      </Card>
    </div>
  );
};

export default TimetableView;
