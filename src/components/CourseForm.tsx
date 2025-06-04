import React, { useEffect, useState } from 'react';
import { Form, Input, Select, Button, InputNumber, Row, Col, Alert, Space } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { Course, dayMap, periodMap, checkCourseConflicts, ValidationResult } from '../types';

interface CourseFormProps {
  initialValues?: Course;
  existingCourses: Course[];
  onSubmit: (course: Course) => void;
  onCancel: () => void;
}

const CourseForm: React.FC<CourseFormProps> = ({ initialValues, existingCourses, onSubmit, onCancel }) => {
  const [form] = Form.useForm();
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [form, initialValues]);

  // 实时验证课程冲突
  const validateCourse = (values: any) => {
    if (values.day && values.period && values.duration) {
      const tempCourse: Course = {
        id: initialValues?.id || 'temp',
        name: values.name || '',
        teacher: values.teacher || '',
        class_name: values.class_name || '',
        room: values.room || '',
        day: values.day,
        period: values.period,
        duration: values.duration,
      };

      const result = checkCourseConflicts(tempCourse, existingCourses);
      setValidation(result);
    } else {
      setValidation(null);
    }
  };

  // 表单值变化时验证
  const handleValuesChange = (changedValues: any, allValues: any) => {
    validateCourse(allValues);
  };

  const handleSubmit = async (values: any) => {
    const course: Course = {
      id: initialValues?.id || uuidv4(),
      ...values,
    };

    // 最终验证
    const finalValidation = checkCourseConflicts(course, existingCourses);

    if (!finalValidation.isValid) {
      setValidation(finalValidation);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(course);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div>
      {/* 冲突警告 */}
      {validation && !validation.isValid && (
        <Alert
          message="课程冲突"
          description={
            <div>
              {validation.conflicts.map((conflict, index) => (
                <div key={index} style={{ marginBottom: 4 }}>
                  • {conflict.message}
                </div>
              ))}
            </div>
          }
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      {/* 警告信息 */}
      {validation && validation.warnings.length > 0 && (
        <Alert
          message="注意事项"
          description={
            <div>
              {validation.warnings.map((warning, index) => (
                <div key={index} style={{ marginBottom: 4 }}>
                  • {warning}
                </div>
              ))}
            </div>
          }
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        onValuesChange={handleValuesChange}
        initialValues={initialValues || {
          duration: 1,
        }}
      >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="name"
            label="课程名称"
            rules={[{ required: true, message: '请输入课程名称' }]}
          >
            <Input placeholder="请输入课程名称" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="teacher"
            label="教师"
            rules={[{ required: true, message: '请输入教师姓名' }]}
          >
            <Input placeholder="请输入教师姓名" />
          </Form.Item>
        </Col>
      </Row>
      
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="class_name"
            label="班级"
            rules={[{ required: true, message: '请输入班级' }]}
          >
            <Input placeholder="请输入班级" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="room"
            label="教室"
            rules={[{ required: true, message: '请输入教室' }]}
          >
            <Input placeholder="请输入教室" />
          </Form.Item>
        </Col>
      </Row>
      
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            name="day"
            label="星期"
            rules={[{ required: true, message: '请选择星期' }]}
          >
            <Select placeholder="请选择星期">
              {Object.entries(dayMap).map(([key, value]) => (
                <Select.Option key={key} value={Number(key)}>
                  {value}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="period"
            label="开始节次"
            rules={[{ required: true, message: '请选择开始节次' }]}
          >
            <Select placeholder="请选择开始节次">
              {Object.entries(periodMap).map(([key, value]) => (
                <Select.Option key={key} value={Number(key)}>
                  {value}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="duration"
            label="持续节数"
            rules={[{ required: true, message: '请输入持续节数' }]}
          >
            <InputNumber min={1} max={10} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>
      
        <Form.Item>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              loading={isSubmitting}
              disabled={validation && !validation.isValid}
            >
              {initialValues ? '更新' : '添加'}
            </Button>
            <Button onClick={onCancel}>取消</Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CourseForm; 