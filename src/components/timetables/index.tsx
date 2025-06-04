// 简化的课程表组件，用于快速搭建框架
import React from 'react';
import { Card, Result, Table } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { ProjectState, TimetableViewConfig } from '../../types/';

interface TimetableProps {
  project: ProjectState;
  viewConfig: TimetableViewConfig;
}

// 班级课程表组件
export const ClassTimetable: React.FC<TimetableProps> = ({ project, viewConfig }) => {
  if (project.courses.length === 0) {
    return (
      <Result
        icon={<EyeOutlined />}
        title="暂无课程数据"
        subTitle="请先完成排课流程"
      />
    );
  }

  // 简化的课程表展示
  const columns = [
    { title: '时间', dataIndex: 'time', key: 'time' },
    { title: '周一', dataIndex: 'mon', key: 'mon' },
    { title: '周二', dataIndex: 'tue', key: 'tue' },
    { title: '周三', dataIndex: 'wed', key: 'wed' },
    { title: '周四', dataIndex: 'thu', key: 'thu' },
    { title: '周五', dataIndex: 'fri', key: 'fri' },
  ];

  const data = Array.from({ length: 8 }, (_, i) => ({
    key: i,
    time: `第${i + 1}节`,
    mon: '语文',
    tue: '数学',
    wed: '英语',
    thu: '物理',
    fri: '化学',
  }));

  return (
    <Card title={`班级课程表 - ${viewConfig.targetId || '全部'}`}>
      <Table 
        columns={columns} 
        dataSource={data} 
        pagination={false}
        size="small"
      />
    </Card>
  );
};

// 教师课程表组件
export const TeacherTimetable: React.FC<TimetableProps> = ({ viewConfig }) => (
  <Card title={`教师课程表 - ${viewConfig.targetId || '全部'}`}>
    <Result
      title="教师课程表"
      subTitle="此功能正在开发中"
    />
  </Card>
);

// 教室课程表组件
export const RoomTimetable: React.FC<TimetableProps> = ({ viewConfig }) => (
  <Card title={`教室课程表 - ${viewConfig.targetId || '全部'}`}>
    <Result
      title="教室课程表"
      subTitle="此功能正在开发中"
    />
  </Card>
);

// 总课程表组件
export const MasterTimetable: React.FC<TimetableProps> = () => (
  <Card title="总课程表">
    <Result
      title="总课程表"
      subTitle="此功能正在开发中"
    />
  </Card>
);
