import React, { useState } from 'react';
import {
  Card,
  Button,
  Space,
  Collapse,
  Table,
  Modal,
  Form,
  Input,
  InputNumber,
  message,
  Popconfirm,
  Tag,
  Tooltip
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  UserAddOutlined,
  ExperimentOutlined
} from '@ant-design/icons';
import { GradeInfo, ClassInfo } from '../types';
import { v4 as uuidv4 } from 'uuid';
import BatchClassModal from './BatchClassModal';
import { loadDemoGradesAndClasses } from '../utils/demoData';

const { Panel } = Collapse;

interface GradeManagementProps {
  grades: GradeInfo[];
  classes: ClassInfo[]; // 全局班级数据 - 唯一数据源
  onGradesUpdate: (grades: GradeInfo[]) => void;
  onClassesUpdate: (classes: ClassInfo[]) => void;
  onBothUpdate?: (grades: GradeInfo[], classes: ClassInfo[]) => void; // 新增：同时更新两个数据源
}

const GradeManagement: React.FC<GradeManagementProps> = ({
  grades,
  classes,
  onGradesUpdate,
  onClassesUpdate,
  onBothUpdate
}) => {
  const [isGradeModalVisible, setIsGradeModalVisible] = useState(false);
  const [isClassModalVisible, setIsClassModalVisible] = useState(false);
  const [isBatchClassModalVisible, setIsBatchClassModalVisible] = useState(false);
  const [editingGrade, setEditingGrade] = useState<GradeInfo | null>(null);
  const [editingClass, setEditingClass] = useState<ClassInfo | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<GradeInfo | null>(null);
  const [gradeForm] = Form.useForm();
  const [classForm] = Form.useForm();



  // 年级操作
  const handleAddGrade = () => {
    setEditingGrade(null);
    gradeForm.resetFields();
    setIsGradeModalVisible(true);
  };

  const handleEditGrade = (grade: GradeInfo) => {
    setEditingGrade(grade);
    gradeForm.setFieldsValue(grade);
    setIsGradeModalVisible(true);
  };

  const handleDeleteGrade = (gradeId: string) => {
    console.log('🗑️ 删除年级:', gradeId);
    console.log('删除前年级数量:', grades.length);

    // 防止重复删除
    const gradeExists = grades.find(g => g.id === gradeId);
    if (!gradeExists) {
      console.log('⚠️ 年级已被删除，跳过操作');
      return;
    }

    const updatedGrades = grades.filter(g => g.id !== gradeId);
    console.log('删除后年级数量:', updatedGrades.length);
    console.log('更新后的年级列表:', updatedGrades);

    // 同时删除该年级下的所有班级
    const updatedClasses = classes.filter(c => c.gradeId !== gradeId);
    console.log('删除该年级下的班级，更新后班级数量:', updatedClasses.length);

    // 使用同时更新，避免状态更新时序问题
    if (onBothUpdate) {
      onBothUpdate(updatedGrades, updatedClasses);
    } else {
      // 回退方案：分别更新
      onGradesUpdate(updatedGrades);
      onClassesUpdate(updatedClasses);
    }

    message.success('年级删除成功');
  };

  const handleMoveGrade = (gradeId: string, direction: 'up' | 'down') => {
    const currentIndex = grades.findIndex(g => g.id === gradeId);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === grades.length - 1)
    ) {
      return;
    }

    const newGrades = [...grades];
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    // 交换位置
    [newGrades[currentIndex], newGrades[targetIndex]] = [newGrades[targetIndex], newGrades[currentIndex]];
    
    // 更新order字段
    newGrades.forEach((grade, index) => {
      grade.order = index + 1;
    });

    onGradesUpdate(newGrades);
    message.success('年级顺序调整成功');
  };

  const handleGradeModalOk = async () => {
    try {
      const values = await gradeForm.validateFields();

      if (editingGrade) {
        // 编辑年级
        const updatedGrades = grades.map(g =>
          g.id === editingGrade.id ? { ...editingGrade, ...values } : g
        );

        // 更新该年级下所有班级的年级名称
        const updatedClasses = classes.map(c =>
          c.gradeId === editingGrade.id ? { ...c, grade: values.name } : c
        );

        // 使用同时更新，避免状态更新时序问题
        if (onBothUpdate) {
          onBothUpdate(updatedGrades, updatedClasses);
        } else {
          // 回退方案：分别更新
          onGradesUpdate(updatedGrades);
          onClassesUpdate(updatedClasses);
        }

        message.success('年级更新成功');
      } else {
        // 新增年级
        const newGrade: GradeInfo = {
          id: uuidv4(),
          order: grades.length + 1,
          ...values
        };
        onGradesUpdate([...grades, newGrade]);
        message.success('年级添加成功');
      }

      setIsGradeModalVisible(false);
      gradeForm.resetFields();
    } catch (error) {
      console.error('年级操作失败:', error);
    }
  };

  // 班级操作
  const handleAddClass = (grade: GradeInfo) => {
    setSelectedGrade(grade);
    setEditingClass(null);
    classForm.resetFields();
    classForm.setFieldsValue({ grade: grade.name, gradeId: grade.id });
    setIsClassModalVisible(true);
  };

  const handleBatchAddClass = (grade: GradeInfo) => {
    setSelectedGrade(grade);
    setIsBatchClassModalVisible(true);
  };

  const handleEditClass = (classInfo: ClassInfo) => {
    setEditingClass(classInfo);
    classForm.setFieldsValue(classInfo);
    setIsClassModalVisible(true);
  };

  const handleDeleteClass = (classId: string) => {
    // 防止重复删除
    const classExists = classes.find(c => c.id === classId);
    if (!classExists) {
      console.log('⚠️ 班级已被删除，跳过操作');
      return;
    }

    const updatedClasses = classes.filter(c => c.id !== classId);
    onClassesUpdate(updatedClasses);

    message.success('班级删除成功');
  };

  const handleClassModalOk = async () => {
    try {
      const values = await classForm.validateFields();

      if (editingClass) {
        // 编辑班级
        const updatedClasses = classes.map(c =>
          c.id === editingClass.id ? { ...editingClass, ...values } : c
        );

        onClassesUpdate(updatedClasses);
        message.success('班级更新成功');
      } else {
        // 新增班级
        const newClass: ClassInfo = {
          id: uuidv4(),
          name: `${values.grade}(${values.classNumber})班`,
          ...values
        };

        onClassesUpdate([...classes, newClass]);
        message.success('班级添加成功');
      }

      setIsClassModalVisible(false);
      classForm.resetFields();
    } catch (error) {
      console.error('班级操作失败:', error);
    }
  };

  const handleBatchClassOk = (newClasses: ClassInfo[]) => {
    onClassesUpdate([...classes, ...newClasses]);

    setIsBatchClassModalVisible(false);
    message.success(`成功添加 ${newClasses.length} 个班级`);
  };

  // 加载演示数据 - 最简单的解决方案
  const handleLoadDemoData = async () => {
    try {
      const { grades: demoGrades, classes: demoClasses } = await loadDemoGradesAndClasses();

      // 直接使用同时更新函数，一次性更新年级和班级数据
      if (onBothUpdate) {
        onBothUpdate(demoGrades, demoClasses);
      } else {
        // 回退方案：分别更新（可能有时序问题）
        onGradesUpdate(demoGrades);
        onClassesUpdate(demoClasses);
      }

      message.success(`成功加载演示数据：${demoGrades.length} 个年级，${demoClasses.length} 个班级`);
    } catch (error) {
      console.error('加载演示数据失败:', error);
      message.error('加载演示数据失败');
    }
  };

  const classColumns = [
    {
      title: '班级名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '班级序号',
      dataIndex: 'classNumber',
      key: 'classNumber',
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
            onClick={(e) => {
              e.stopPropagation();
              handleEditClass(record);
            }}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除这个班级吗？"
            onConfirm={(e) => {
              e?.stopPropagation();
              handleDeleteClass(record.id);
            }}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={(e) => e.stopPropagation()}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];



  return (
    <div>
      <Card
        title={`年级管理 (${grades.length} 个年级)`}
        extra={
          <Space>
            <Button
              icon={<ExperimentOutlined />}
              onClick={handleLoadDemoData}
            >
              加载演示数据
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddGrade}>
              添加年级
            </Button>
          </Space>
        }
      >
        <Collapse>
          {grades.length === 0 && (
            <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
              暂无年级数据，请点击"加载演示数据"或"添加年级"
            </div>
          )}
          {grades.map((grade, index) => {
            // 动态获取该年级的所有班级（从全局班级数据中过滤）
            const gradeClasses = classes.filter(cls => cls.gradeId === grade.id);

            return (
              <Panel
                key={grade.id}
                header={
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Space>
                      <span>{grade.name}</span>
                      <Tag color="blue">{gradeClasses.length} 个班级</Tag>
                    </Space>
                  </div>
                }
                extra={
                  <Space onClick={(e) => e.stopPropagation()}>
                    <Tooltip title="上移">
                      <Button
                        type="text"
                        icon={<ArrowUpOutlined />}
                        disabled={index === 0}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveGrade(grade.id, 'up');
                        }}
                      />
                    </Tooltip>
                    <Tooltip title="下移">
                      <Button
                        type="text"
                        icon={<ArrowDownOutlined />}
                        disabled={index === grades.length - 1}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveGrade(grade.id, 'down');
                        }}
                      />
                    </Tooltip>
                    <Button
                      type="text"
                      icon={<EditOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditGrade(grade);
                      }}
                    >
                      编辑
                    </Button>
                    <Popconfirm
                      title="确定删除这个年级及其所有班级吗？"
                      onConfirm={(e) => {
                        e?.stopPropagation();
                        handleDeleteGrade(grade.id);
                      }}
                      okText="确定"
                      cancelText="取消"
                    >
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={(e) => e.stopPropagation()}
                      >
                        删除
                      </Button>
                    </Popconfirm>
                  </Space>
                }
              >
                <div style={{ marginBottom: 16 }}>
                  <Space>
                    <Button
                      type="dashed"
                      icon={<PlusOutlined />}
                      onClick={() => handleAddClass(grade)}
                    >
                      添加班级
                    </Button>
                    <Button
                      type="dashed"
                      icon={<UserAddOutlined />}
                      onClick={() => handleBatchAddClass(grade)}
                    >
                      批量添加班级
                    </Button>
                  </Space>
                </div>

                <Table
                  columns={classColumns}
                  dataSource={gradeClasses}
                  rowKey="id"
                  pagination={false}
                  size="small"
                />
              </Panel>
            );
          })}
        </Collapse>
      </Card>

      {/* 年级编辑模态框 */}
      <Modal
        title={editingGrade ? '编辑年级' : '添加年级'}
        open={isGradeModalVisible}
        onOk={handleGradeModalOk}
        onCancel={() => setIsGradeModalVisible(false)}
        okText="确定"
        cancelText="取消"
      >
        <Form form={gradeForm} layout="vertical">
          <Form.Item
            name="name"
            label="年级名称"
            rules={[{ required: true, message: '请输入年级名称' }]}
          >
            <Input placeholder="如：高一" />
          </Form.Item>
          <Form.Item name="description" label="备注">
            <Input.TextArea placeholder="备注信息（可选）" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 班级编辑模态框 */}
      <Modal
        title={editingClass ? '编辑班级' : '添加班级'}
        open={isClassModalVisible}
        onOk={handleClassModalOk}
        onCancel={() => setIsClassModalVisible(false)}
        okText="确定"
        cancelText="取消"
      >
        <Form form={classForm} layout="vertical">
          <Form.Item name="gradeId" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            name="grade"
            label="年级"
            rules={[{ required: true, message: '请选择年级' }]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="classNumber"
            label="班级序号"
            rules={[{ required: true, message: '请输入班级序号' }]}
          >
            <InputNumber min={1} max={50} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="studentCount"
            label="学生人数"
            rules={[{ required: true, message: '请输入学生人数' }]}
          >
            <InputNumber min={1} max={100} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="classTeacher" label="班主任">
            <Input placeholder="班主任姓名（可选）" />
          </Form.Item>
          <Form.Item name="description" label="备注">
            <Input.TextArea placeholder="备注信息（可选）" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 批量添加班级模态框 */}
      {selectedGrade && (
        <BatchClassModal
          visible={isBatchClassModalVisible}
          grade={selectedGrade}
          existingClasses={classes}
          onCancel={() => setIsBatchClassModalVisible(false)}
          onOk={handleBatchClassOk}
        />
      )}
    </div>
  );
};

export default GradeManagement;
