import React, { useState } from 'react';
import { Table, Typography, Tag, Card } from 'antd';
import { Course, dayMap, periodMap, TimetableViewConfig, TimetableViewType, filterCoursesByView, coursesToTimetableData } from '../types';
import TimetableViewSelector from './TimetableViewSelector';

const { Title } = Typography;

interface TimetableProps {
  courses: Course[];
}

const Timetable: React.FC<TimetableProps> = ({ courses }) => {
  const [currentView, setCurrentView] = useState<TimetableViewConfig>({
    type: TimetableViewType.ALL,
    title: '全校课程表'
  });

  // 根据当前视图筛选课程
  const filteredCourses = filterCoursesByView(courses, currentView);

  // 生成当前视图的课程表数据
  const timetableData = coursesToTimetableData(filteredCourses);
  // 表格列定义
  const columns = [
    {
      title: '时间/星期',
      dataIndex: 'period',
      key: 'period',
      width: 180,
      render: (text: string) => <strong>{text}</strong>,
    },
    ...Array.from({ length: 7 }, (_, i) => ({
      title: dayMap[i + 1],
      dataIndex: `day${i + 1}`,
      key: `day${i + 1}`,
      width: 150,
      render: (cell: any) => {
        if (!cell) return null;

        const { course } = cell;

        // 根据课程类型设置不同颜色
        const getColorBySubject = (name: string) => {
          if (name.includes('数学')) return '#1890ff';
          if (name.includes('语文')) return '#52c41a';
          if (name.includes('英语')) return '#722ed1';
          if (name.includes('物理')) return '#fa8c16';
          if (name.includes('化学')) return '#eb2f96';
          if (name.includes('生物')) return '#13c2c2';
          if (name.includes('历史')) return '#faad14';
          if (name.includes('地理')) return '#a0d911';
          if (name.includes('政治')) return '#f5222d';
          return '#666666';
        };

        const color = getColorBySubject(course.name);

        return (
          <Card
            size="small"
            style={{
              margin: 2,
              borderColor: color,
              backgroundColor: `${color}10`,
              height: '100%',
              minHeight: 80
            }}
            bodyStyle={{ padding: '8px', textAlign: 'center' }}
          >
            <div style={{ fontWeight: 'bold', color, marginBottom: 4 }}>
              {course.name}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {course.teacher}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {course.class_name}
            </div>
            <Tag color={color} style={{ marginTop: 4, fontSize: '12px' }}>
              {course.room}
            </Tag>
          </Card>
        );
      },
    })),
  ];

  // 构建表格数据
  const dataSource = periodMap && timetableData ? Array.from({ length: 10 }, (_, periodIdx) => {
    const rowData: any = {
      key: periodIdx,
      period: periodMap[periodIdx + 1],
    };

    // 添加每天的课程
    for (let dayIdx = 0; dayIdx < 7; dayIdx++) {
      const cell = timetableData[periodIdx][dayIdx];
      if (cell !== null) {
        rowData[`day${dayIdx + 1}`] = cell;
      }
    }

    return rowData;
  }) : [];

  return (
    <div style={{ padding: '20px' }}>
      <TimetableViewSelector
        courses={courses}
        currentView={currentView}
        onViewChange={setCurrentView}
      />

      <Title level={2} style={{ textAlign: 'center', marginBottom: '20px' }}>
        {currentView.title}
      </Title>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        bordered
        size="middle"
        style={{ marginBottom: '20px' }}
        onRow={(_record, _index) => {
          return {
            style: { height: '100px' },
          };
        }}
        scroll={{ x: 1200 }}
        // 处理单元格合并
        components={{
          body: {
            row: (props: any) => <tr {...props} />,
            cell: (props: any) => {
              const { children, ...restProps } = props;
              
              // 检查是否有rowSpan属性
              if (children && children.props && children.props.cell) {
                const { rowSpan } = children.props.cell;
                return <td {...restProps} rowSpan={rowSpan}>{children}</td>;
              }
              
              return <td {...restProps}>{children}</td>;
            },
          },
        }}
      />
    </div>
  );
};

export default Timetable; 