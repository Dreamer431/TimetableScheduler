import React, { useState } from 'react';
import { Table, Button, Space, Modal, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, ExperimentOutlined } from '@ant-design/icons';
import { Course, dayMap, periodMap, SearchFilters, filterCourses } from '../types';
import CourseForm from './CourseForm';
import SearchFiltersComponent from './SearchFilters';

interface CourseManagementProps {
  courses: Course[];
  onAdd: (course: Course) => Promise<void>;
  onUpdate: (course: Course) => Promise<void>;
  onDelete: (id: string) => void;
  onLoadDemoData?: () => Promise<void>;
}

const CourseManagement: React.FC<CourseManagementProps> = ({
  courses,
  onAdd,
  onUpdate,
  onDelete,
  onLoadDemoData,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<Course | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
  const [filteredCourses, setFilteredCourses] = useState<Course[]>(courses);

  // 更新筛选结果
  React.useEffect(() => {
    const filtered = filterCourses(courses, searchFilters);
    setFilteredCourses(filtered);
  }, [courses, searchFilters]);

  const handleSearch = (filters: SearchFilters) => {
    setSearchFilters(filters);
  };

  const handleClearSearch = () => {
    setSearchFilters({});
  };

  const showAddModal = () => {
    setCurrentCourse(undefined);
    setIsModalVisible(true);
  };

  const showEditModal = (course: Course) => {
    setCurrentCourse(course);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = async (course: Course) => {
    setLoading(true);
    try {
      if (currentCourse) {
        await onUpdate(course);
        message.success('课程更新成功');
      } else {
        await onAdd(course);
        message.success('课程添加成功');
      }
      setIsModalVisible(false);
    } catch (error) {
      message.error(`操作失败: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个课程吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        setLoading(true);
        try {
          await onDelete(id);
          message.success('课程删除成功');
        } catch (error) {
          message.error(`删除失败: ${error}`);
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const columns = [
    {
      title: '课程名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '教师',
      dataIndex: 'teacher',
      key: 'teacher',
    },
    {
      title: '班级',
      dataIndex: 'class_name',
      key: 'class_name',
    },
    {
      title: '星期',
      dataIndex: 'day',
      key: 'day',
      render: (day: number) => dayMap[day],
    },
    {
      title: '节次',
      dataIndex: 'period',
      key: 'period',
      render: (period: number) => periodMap[period].split(' ')[0],
    },
    {
      title: '持续节数',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: '教室',
      dataIndex: 'room',
      key: 'room',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Course) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
          >
            编辑
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <SearchFiltersComponent
        onSearch={handleSearch}
        onClear={handleClearSearch}
      />

      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal}>
            添加课程
          </Button>
          <span style={{ marginLeft: 16, color: '#666' }}>
            共 {filteredCourses.length} 条记录
            {Object.keys(searchFilters).length > 0 && ` (已筛选)`}
          </span>
        </div>
        {onLoadDemoData && (
          <Button
            icon={<ExperimentOutlined />}
            onClick={onLoadDemoData}
          >
            {courses.length === 0 ? "加载演示数据" : "重新加载演示数据"}
          </Button>
        )}
      </div>

      <Table
        columns={columns}
        dataSource={filteredCourses.map(course => ({ ...course, key: course.id }))}
        bordered
        loading={loading}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
        }}
      />
      <Modal
        title={currentCourse ? '编辑课程' : '添加课程'}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
      >
        <CourseForm
          initialValues={currentCourse}
          existingCourses={courses}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </Modal>
    </div>
  );
};

export default CourseManagement; 