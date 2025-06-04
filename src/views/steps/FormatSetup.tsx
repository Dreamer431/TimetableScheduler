import React from 'react';
import { Card, Form, InputNumber, TimePicker, Button, Space } from 'antd';
import { ProjectState } from '../../types/';
import dayjs from 'dayjs';

interface FormatSetupProps {
  project: ProjectState;
  onProjectUpdate: (project: ProjectState) => void;
  onNext: () => void;
  onPrev: () => void;
}

const FormatSetup: React.FC<FormatSetupProps> = ({
  project,
  onProjectUpdate,
  onNext,
  onPrev
}) => {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      const updatedFormat = {
        ...project.timetableFormat,
        ...values,
        startTime: values.startTime.format('HH:mm')
      };
      
      onProjectUpdate({
        ...project,
        timetableFormat: updatedFormat
      });
      
      onNext();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  return (
    <Card title="课程表格式设置">
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          ...project.timetableFormat,
          startTime: dayjs(project.timetableFormat.startTime, 'HH:mm')
        }}
      >
        <Form.Item
          name="daysPerWeek"
          label="每周上课天数"
          rules={[{ required: true, message: '请设置每周上课天数' }]}
        >
          <InputNumber min={5} max={7} />
        </Form.Item>
        
        <Form.Item
          name="periodsPerDay"
          label="每天课节数"
          rules={[{ required: true, message: '请设置每天课节数' }]}
        >
          <InputNumber min={6} max={12} />
        </Form.Item>
        
        <Form.Item
          name="periodDuration"
          label="每节课时长（分钟）"
          rules={[{ required: true, message: '请设置每节课时长' }]}
        >
          <InputNumber min={30} max={60} />
        </Form.Item>
        
        <Form.Item
          name="startTime"
          label="第一节课开始时间"
          rules={[{ required: true, message: '请设置开始时间' }]}
        >
          <TimePicker format="HH:mm" />
        </Form.Item>
      </Form>
      
      <div style={{ marginTop: 24, textAlign: 'right' }}>
        <Space>
          <Button onClick={onPrev}>上一步</Button>
          <Button type="primary" onClick={handleSubmit}>下一步</Button>
        </Space>
      </div>
    </Card>
  );
};

export default FormatSetup;
