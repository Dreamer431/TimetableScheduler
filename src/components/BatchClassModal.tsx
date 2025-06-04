import React, { useState } from 'react';
import { Modal, Form, Input, InputNumber, Button, Space, message, Divider } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { ClassInfo, GradeInfo } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface BatchClassModalProps {
  visible: boolean;
  grade: GradeInfo;
  existingClasses: ClassInfo[]; // 新增：现有的班级数据
  onCancel: () => void;
  onOk: (classes: ClassInfo[]) => void;
}

interface ClassTemplate {
  id: string;
  classNumber: number;
  studentCount: number;
  classTeacher?: string;
  description?: string;
}

const BatchClassModal: React.FC<BatchClassModalProps> = ({
  visible,
  grade,
  existingClasses,
  onCancel,
  onOk
}) => {
  const [form] = Form.useForm();
  const [classTemplates, setClassTemplates] = useState<ClassTemplate[]>([
    { id: uuidv4(), classNumber: 1, studentCount: 40 }
  ]);

  const handleAddTemplate = () => {
    const newTemplate: ClassTemplate = {
      id: uuidv4(),
      classNumber: classTemplates.length + 1,
      studentCount: 40
    };
    setClassTemplates([...classTemplates, newTemplate]);
  };

  const handleRemoveTemplate = (id: string) => {
    if (classTemplates.length > 1) {
      setClassTemplates(classTemplates.filter(t => t.id !== id));
    }
  };

  const handleTemplateChange = (id: string, field: string, value: any) => {
    setClassTemplates(classTemplates.map(t => 
      t.id === id ? { ...t, [field]: value } : t
    ));
  };

  const handleOk = async () => {
    try {
      // 验证班级序号不重复
      const classNumbers = classTemplates.map(t => t.classNumber);
      const uniqueNumbers = new Set(classNumbers);
      if (classNumbers.length !== uniqueNumbers.size) {
        message.error('班级序号不能重复');
        return;
      }

      // 检查是否与现有班级冲突
      const gradeClasses = existingClasses.filter(c => c.gradeId === grade.id);
      const existingNumbers = gradeClasses.map(c => c.classNumber);
      const conflicts = classNumbers.filter(num => existingNumbers.includes(num));
      if (conflicts.length > 0) {
        message.error(`班级序号 ${conflicts.join(', ')} 已存在`);
        return;
      }

      // 生成班级信息
      const newClasses: ClassInfo[] = classTemplates.map(template => ({
        id: uuidv4(),
        name: `${grade.name}(${template.classNumber})班`,
        grade: grade.name,
        gradeId: grade.id,
        classNumber: template.classNumber,
        studentCount: template.studentCount,
        classTeacher: template.classTeacher,
        description: template.description
      }));

      onOk(newClasses);
      
      // 重置表单
      setClassTemplates([{ id: uuidv4(), classNumber: 1, studentCount: 40 }]);
      form.resetFields();
    } catch (error) {
      console.error('批量添加班级失败:', error);
      message.error('添加失败');
    }
  };

  const handleCancel = () => {
    setClassTemplates([{ id: uuidv4(), classNumber: 1, studentCount: 40 }]);
    form.resetFields();
    onCancel();
  };

  // 自动填充连续班级序号
  const handleAutoFillNumbers = () => {
    const gradeClasses = existingClasses.filter(c => c.gradeId === grade.id);
    const existingNumbers = gradeClasses.map(c => c.classNumber);
    let nextNumber = 1;
    
    const updatedTemplates = classTemplates.map((template, index) => {
      while (existingNumbers.includes(nextNumber)) {
        nextNumber++;
      }
      const result = { ...template, classNumber: nextNumber };
      nextNumber++;
      return result;
    });
    
    setClassTemplates(updatedTemplates);
    message.success('已自动填充班级序号');
  };

  return (
    <Modal
      title={`批量添加班级 - ${grade.name}`}
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      width={800}
      okText="确定添加"
      cancelText="取消"
    >
      <div style={{ marginBottom: 16 }}>
        <Space>
          <Button 
            type="dashed" 
            icon={<PlusOutlined />} 
            onClick={handleAddTemplate}
          >
            添加班级模板
          </Button>
          <Button onClick={handleAutoFillNumbers}>
            自动填充序号
          </Button>
        </Space>
      </div>

      <div style={{ maxHeight: 400, overflowY: 'auto' }}>
        {classTemplates.map((template, index) => (
          <div key={template.id} style={{ marginBottom: 16, padding: 16, border: '1px solid #f0f0f0', borderRadius: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h4>班级 {index + 1}</h4>
              {classTemplates.length > 1 && (
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleRemoveTemplate(template.id)}
                >
                  删除
                </Button>
              )}
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label>班级序号:</label>
                <InputNumber
                  min={1}
                  max={50}
                  value={template.classNumber}
                  onChange={(value) => handleTemplateChange(template.id, 'classNumber', value || 1)}
                  style={{ width: '100%', marginTop: 4 }}
                />
              </div>
              
              <div>
                <label>学生人数:</label>
                <InputNumber
                  min={1}
                  max={100}
                  value={template.studentCount}
                  onChange={(value) => handleTemplateChange(template.id, 'studentCount', value || 40)}
                  style={{ width: '100%', marginTop: 4 }}
                />
              </div>
              
              <div>
                <label>班主任:</label>
                <Input
                  value={template.classTeacher}
                  onChange={(e) => handleTemplateChange(template.id, 'classTeacher', e.target.value)}
                  placeholder="班主任姓名（可选）"
                  style={{ marginTop: 4 }}
                />
              </div>
              
              <div>
                <label>备注:</label>
                <Input
                  value={template.description}
                  onChange={(e) => handleTemplateChange(template.id, 'description', e.target.value)}
                  placeholder="备注信息（可选）"
                  style={{ marginTop: 4 }}
                />
              </div>
            </div>
            
            <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
              预览: {grade.name}({template.classNumber})班
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default BatchClassModal;
