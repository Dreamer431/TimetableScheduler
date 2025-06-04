import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Table, Form, Input, InputNumber, Modal, Space, message, Tabs, Alert } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, FileExcelOutlined, TeamOutlined, TableOutlined } from '@ant-design/icons';
import { ProjectState, ClassInfo, GradeInfo } from '../../types/';
import { v4 as uuidv4 } from 'uuid';
import GradeManagement from '../../components/GradeManagement';
import ExcelImportModal from '../../components/ExcelImportModal';

interface ClassSetupProps {
  project: ProjectState;
  onProjectUpdate: (project: ProjectState) => void;
  onNext?: () => void;
  onPrev?: () => void;
}

const { TabPane } = Tabs;

const ClassSetup: React.FC<ClassSetupProps> = ({
  project,
  onProjectUpdate,
  onNext: _onNext,
  onPrev: _onPrev
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isExcelImportVisible, setIsExcelImportVisible] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassInfo | null>(null);
  const [activeTab, setActiveTab] = useState('grade');
  const [form] = Form.useForm();

  // 确保项目有grades字段 - 使用ref来避免重复初始化
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!project.grades && !initializedRef.current) {
      console.log('🔧 ClassSetup: 初始化grades字段');
      initializedRef.current = true;
      onProjectUpdate({
        ...project,
        grades: []
      });
    }
  }, [project.grades, onProjectUpdate]);

  const handleAdd = () => {
    setEditingClass(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (classInfo: ClassInfo) => {
    setEditingClass(classInfo);
    form.setFieldsValue(classInfo);
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    const updatedClasses = project.classes.filter(c => c.id !== id);
    onProjectUpdate({
      ...project,
      classes: updatedClasses
    });
    message.success('班级删除成功');
  };

  // 演示数据加载：一次性更新年级和班级数据
  const handleLoadDemoData = (grades: GradeInfo[], classes: ClassInfo[]) => {
    onProjectUpdate({
      ...project,
      grades,
      classes
    });
  };

  // 年级管理相关函数
  const handleGradesUpdate = (grades: GradeInfo[]) => {
    onProjectUpdate({
      ...project,
      grades
    });
  };

  const handleClassesUpdate = (classes: ClassInfo[]) => {
    onProjectUpdate({
      ...project,
      classes
    });
  };

  // Excel导入处理 - 简化版
  const handleExcelImport = (grades: GradeInfo[], classes: ClassInfo[]) => {
    onProjectUpdate({
      ...project,
      grades,
      classes
    });
    setIsExcelImportVisible(false);
    message.success(`成功导入 ${grades.length} 个年级，${classes.length} 个班级`);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      if (editingClass) {
        // 编辑
        const updatedClasses = project.classes.map(c =>
          c.id === editingClass.id ? { ...editingClass, ...values } : c
        );
        onProjectUpdate({
          ...project,
          classes: updatedClasses
        });
        message.success('班级更新成功');
      } else {
        // 新增
        const newClass: ClassInfo = {
          id: uuidv4(),
          gradeId: '', // 需要在表单中设置
          classNumber: 1, // 需要在表单中设置
          ...values
        };
        onProjectUpdate({
          ...project,
          classes: [...project.classes, newClass]
        });
        message.success('班级添加成功');
      }

      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const columns = [
    {
      title: '班级名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '年级',
      dataIndex: 'grade',
      key: 'grade',
    },
    {
      title: '学生人数',
      dataIndex: 'studentCount',
      key: 'studentCount',
    },
    {
      title: '班主任',
      dataIndex: 'classTeacher',
      key: 'classTeacher',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: ClassInfo) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            type="text"
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
    <div>
      <Alert
        message="班级设置说明"
        description="您可以通过年级管理来组织班级，支持批量添加班级和Excel导入功能。建议先创建年级，再在年级下添加班级。"
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
      />

      <Card
        title="班级设置"
        extra={
          <Space>
            <Button
              icon={<FileExcelOutlined />}
              onClick={() => setIsExcelImportVisible(true)}
            >
              Excel导入
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              添加班级
            </Button>
          </Space>
        }
      >
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane
            tab={
              <span>
                <TeamOutlined />
                年级管理
              </span>
            }
            key="grade"
          >
            <GradeManagement
              grades={project.grades || []}
              classes={project.classes || []}
              onGradesUpdate={handleGradesUpdate}
              onClassesUpdate={handleClassesUpdate}
              onBothUpdate={handleLoadDemoData}
            />
          </TabPane>

          <TabPane
            tab={
              <span>
                <TableOutlined />
                班级列表
              </span>
            }
            key="class"
          >
            <Table
              columns={columns}
              dataSource={project.classes}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </TabPane>


        </Tabs>
      </Card>

      <Modal
        title={editingClass ? '编辑班级' : '添加班级'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        okText="确定"
        cancelText="取消"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            studentCount: 40
          }}
        >
          <Form.Item
            name="name"
            label="班级名称"
            rules={[{ required: true, message: '请输入班级名称' }]}
          >
            <Input placeholder="如：高一(1)班" />
          </Form.Item>
          
          <Form.Item
            name="grade"
            label="年级"
            rules={[{ required: true, message: '请输入年级' }]}
          >
            <Input placeholder="如：高一" />
          </Form.Item>
          
          <Form.Item
            name="studentCount"
            label="学生人数"
            rules={[{ required: true, message: '请输入学生人数' }]}
          >
            <InputNumber min={1} max={100} style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item
            name="classTeacher"
            label="班主任"
          >
            <Input placeholder="班主任姓名（可选）" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="备注"
          >
            <Input.TextArea placeholder="备注信息（可选）" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Excel导入模态框 */}
      <ExcelImportModal
        visible={isExcelImportVisible}
        onCancel={() => setIsExcelImportVisible(false)}
        onOk={handleExcelImport}
      />
    </div>
  );
};

export default ClassSetup;
