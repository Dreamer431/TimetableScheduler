import React, { useState } from 'react';
import { Card, Button, List, Modal, Form, Input, message, Tag, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, FolderOpenOutlined, CalendarOutlined } from '@ant-design/icons';
import { ProjectState, ProjectStep, stepConfig } from '../types/';
import { v4 as uuidv4 } from 'uuid';

interface ProjectManagerProps {
  projects: ProjectState[];
  onProjectSelect: (project: ProjectState) => void;
  onProjectCreate: (project: ProjectState) => void;
  onProjectUpdate: (project: ProjectState) => void;
  onProjectDelete: (projectId: string) => void;
}

const ProjectManager: React.FC<ProjectManagerProps> = ({
  projects,
  onProjectSelect,
  onProjectCreate,
  onProjectUpdate,
  onProjectDelete
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectState | null>(null);
  const [form] = Form.useForm();

  const handleCreateProject = () => {
    setEditingProject(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditProject = (project: ProjectState) => {
    setEditingProject(project);
    form.setFieldsValue({
      name: project.name
    });
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingProject) {
        // 编辑现有项目
        const updatedProject = {
          ...editingProject,
          name: values.name,
          updatedAt: new Date()
        };
        onProjectUpdate(updatedProject);
        message.success('项目更新成功');
      } else {
        // 创建新项目
        const newProject: ProjectState = {
          id: uuidv4(),
          name: values.name,
          currentStep: ProjectStep.SETUP_CLASSES,
          grades: [],
          classes: [],
          teachers: [],
          subjects: [],
          rooms: [],
          timetableFormat: {
            id: uuidv4(),
            name: '标准格式',
            daysPerWeek: 5,
            periodsPerDay: 8,
            periodDuration: 45,
            startTime: '08:00',
            breakTimes: [
              { afterPeriod: 2, duration: 30, name: '大课间' },
              { afterPeriod: 4, duration: 90, name: '午休' }
            ]
          },
          courseRequirements: [],
          courses: [],
          createdAt: new Date(),
          updatedAt: new Date()
        };
        onProjectCreate(newProject);
        message.success('项目创建成功');
      }
      
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingProject(null);
  };

  const getStepProgress = (project: ProjectState) => {
    const steps = Object.values(ProjectStep);
    const currentIndex = steps.indexOf(project.currentStep);
    return {
      current: currentIndex + 1,
      total: steps.length,
      percentage: Math.round(((currentIndex + 1) / steps.length) * 100)
    };
  };

  const getStepColor = (step: ProjectStep) => {
    const stepColors: Record<ProjectStep, string> = {
      [ProjectStep.SETUP_CLASSES]: 'blue',
      [ProjectStep.SETUP_FORMAT]: 'cyan',
      [ProjectStep.SETUP_SUBJECTS]: 'green',
      [ProjectStep.SETUP_TEACHERS]: 'orange',
      [ProjectStep.SETUP_ROOMS]: 'purple',
      [ProjectStep.SETUP_REQUIREMENTS]: 'red',
      [ProjectStep.AUTO_SCHEDULE]: 'magenta',
      [ProjectStep.MANUAL_ADJUST]: 'volcano',
      [ProjectStep.EXPORT]: 'gold'
    };
    return stepColors[step] || 'default';
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title="项目管理"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreateProject}
          >
            新建项目
          </Button>
        }
      >
        {projects.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 0',
            color: '#999'
          }}>
            <CalendarOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
            <div>还没有任何项目</div>
            <div>点击"新建项目"开始创建您的第一个排课项目</div>
          </div>
        ) : (
          <List
            grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 4 }}
            dataSource={projects}
            renderItem={(project) => {
              const progress = getStepProgress(project);
              return (
                <List.Item>
                  <Card
                    hoverable
                    actions={[
                      <Button
                        type="text"
                        icon={<FolderOpenOutlined />}
                        onClick={() => onProjectSelect(project)}
                      >
                        打开
                      </Button>,
                      <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => handleEditProject(project)}
                      >
                        编辑
                      </Button>,
                      <Popconfirm
                        title="确定要删除这个项目吗？"
                        description="删除后无法恢复，请谨慎操作。"
                        onConfirm={() => onProjectDelete(project.id)}
                        okText="确定"
                        cancelText="取消"
                      >
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                        >
                          删除
                        </Button>
                      </Popconfirm>
                    ]}
                  >
                    <Card.Meta
                      title={project.name}
                      description={
                        <div>
                          <div style={{ marginBottom: '8px' }}>
                            <Tag color={getStepColor(project.currentStep)}>
                              {stepConfig[project.currentStep].title}
                            </Tag>
                          </div>
                          <div style={{ fontSize: '12px', color: '#666' }}>
                            进度: {progress.current}/{progress.total} ({progress.percentage}%)
                          </div>
                          <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                            更新时间: {project.updatedAt.toLocaleDateString()}
                          </div>
                        </div>
                      }
                    />
                  </Card>
                </List.Item>
              );
            }}
          />
        )}
      </Card>

      <Modal
        title={editingProject ? '编辑项目' : '新建项目'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="确定"
        cancelText="取消"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ name: '' }}
        >
          <Form.Item
            name="name"
            label="项目名称"
            rules={[
              { required: true, message: '请输入项目名称' },
              { min: 2, message: '项目名称至少2个字符' },
              { max: 50, message: '项目名称不能超过50个字符' }
            ]}
          >
            <Input placeholder="请输入项目名称，如：2024年春季学期排课" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProjectManager;
