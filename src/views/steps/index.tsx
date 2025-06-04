// 简化的步骤组件，用于快速搭建框架
import React from 'react';
import { Card, Button, Space, Result } from 'antd';
import { ProjectState } from '../../types/';

interface StepProps {
  project: ProjectState;
  onProjectUpdate: (project: ProjectState) => void;
  onNext: () => void;
  onPrev: () => void;
}

// 科目设置组件
export const SubjectSetup: React.FC<StepProps> = ({ onNext, onPrev }) => (
  <Card title="科目设置">
    <Result
      title="科目设置"
      subTitle="此功能正在开发中，将支持添加和管理教学科目"
      extra={
        <Space>
          <Button onClick={onPrev}>上一步</Button>
          <Button type="primary" onClick={onNext}>下一步</Button>
        </Space>
      }
    />
  </Card>
);

// 教师设置组件
export const TeacherSetup: React.FC<StepProps> = ({ onNext, onPrev }) => (
  <Card title="教师设置">
    <Result
      title="教师设置"
      subTitle="此功能正在开发中，将支持添加和管理教师信息"
      extra={
        <Space>
          <Button onClick={onPrev}>上一步</Button>
          <Button type="primary" onClick={onNext}>下一步</Button>
        </Space>
      }
    />
  </Card>
);

// 教室设置组件
export const RoomSetup: React.FC<StepProps> = ({ onNext, onPrev }) => (
  <Card title="教室设置">
    <Result
      title="教室设置"
      subTitle="此功能正在开发中，将支持添加和管理教室信息"
      extra={
        <Space>
          <Button onClick={onPrev}>上一步</Button>
          <Button type="primary" onClick={onNext}>下一步</Button>
        </Space>
      }
    />
  </Card>
);

// 课程需求设置组件
export const RequirementSetup: React.FC<StepProps> = ({ onNext, onPrev }) => (
  <Card title="课程需求设置">
    <Result
      title="课程需求设置"
      subTitle="此功能正在开发中，将支持设置各班级的课程需求"
      extra={
        <Space>
          <Button onClick={onPrev}>上一步</Button>
          <Button type="primary" onClick={onNext}>下一步</Button>
        </Space>
      }
    />
  </Card>
);

// 自动排课组件
export const AutoSchedule: React.FC<StepProps> = ({ onNext, onPrev }) => (
  <Card title="自动排课">
    <Result
      title="自动排课"
      subTitle="此功能正在开发中，将支持智能自动排课算法"
      extra={
        <Space>
          <Button onClick={onPrev}>上一步</Button>
          <Button type="primary" onClick={onNext}>下一步</Button>
        </Space>
      }
    />
  </Card>
);

// 手动调整组件
export const ManualAdjust: React.FC<StepProps> = ({ onNext, onPrev }) => (
  <Card title="手动调整">
    <Result
      title="手动调整"
      subTitle="此功能正在开发中，将支持手动微调排课结果"
      extra={
        <Space>
          <Button onClick={onPrev}>上一步</Button>
          <Button type="primary" onClick={onNext}>下一步</Button>
        </Space>
      }
    />
  </Card>
);

// 导出组件
export const ExportView: React.FC<StepProps> = ({ onPrev }) => (
  <Card title="导出课程表">
    <Result
      title="导出课程表"
      subTitle="此功能正在开发中，将支持多种格式的课程表导出"
      extra={
        <Space>
          <Button onClick={onPrev}>上一步</Button>
          <Button type="primary">完成</Button>
        </Space>
      }
    />
  </Card>
);
