import React, { useState } from 'react';
import { Steps, Card, Button, Space, message } from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { ProjectState, ProjectStep, stepConfig } from '../types/';

// 导入各个步骤组件
import ClassSetup from './steps/ClassSetup';
import FormatSetup from './steps/FormatSetup';
import {
  SubjectSetup,
  TeacherSetup,
  RoomSetup,
  RequirementSetup,
  AutoSchedule,
  ManualAdjust,
  ExportView
} from './steps';

interface ProjectWizardProps {
  project: ProjectState;
  onProjectUpdate: (project: ProjectState) => void;
  onComplete: () => void;
}

const ProjectWizard: React.FC<ProjectWizardProps> = ({
  project,
  onProjectUpdate,
  onComplete
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(
    Object.values(ProjectStep).indexOf(project.currentStep)
  );

  const steps = Object.values(ProjectStep);
  const currentStep = steps[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      const nextStep = steps[currentStepIndex + 1];
      setCurrentStepIndex(currentStepIndex + 1);
      onProjectUpdate({
        ...project,
        currentStep: nextStep,
        updatedAt: new Date()
      });
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      const prevStep = steps[currentStepIndex - 1];
      setCurrentStepIndex(currentStepIndex - 1);
      onProjectUpdate({
        ...project,
        currentStep: prevStep,
        updatedAt: new Date()
      });
    }
  };

  const handleStepClick = (stepIndex: number) => {
    const targetStep = steps[stepIndex];
    setCurrentStepIndex(stepIndex);
    onProjectUpdate({
      ...project,
      currentStep: targetStep,
      updatedAt: new Date()
    });
  };

  const renderStepContent = () => {
    const commonProps = {
      project,
      onProjectUpdate,
      onNext: handleNext,
      onPrev: handlePrev
    };

    switch (currentStep) {
      case ProjectStep.SETUP_CLASSES:
        return <ClassSetup {...commonProps} />;
      case ProjectStep.SETUP_FORMAT:
        return <FormatSetup {...commonProps} />;
      case ProjectStep.SETUP_SUBJECTS:
        return <SubjectSetup {...commonProps} />;
      case ProjectStep.SETUP_TEACHERS:
        return <TeacherSetup {...commonProps} />;
      case ProjectStep.SETUP_ROOMS:
        return <RoomSetup {...commonProps} />;
      case ProjectStep.SETUP_REQUIREMENTS:
        return <RequirementSetup {...commonProps} />;
      case ProjectStep.AUTO_SCHEDULE:
        return <AutoSchedule {...commonProps} />;
      case ProjectStep.MANUAL_ADJUST:
        return <ManualAdjust {...commonProps} />;
      case ProjectStep.EXPORT:
        return <ExportView {...commonProps} />;
      default:
        return <div>未知步骤</div>;
    }
  };

  const isStepValid = (step: ProjectStep): boolean => {
    // 这里可以添加每个步骤的验证逻辑
    switch (step) {
      case ProjectStep.SETUP_CLASSES:
        return project.classes.length > 0;
      case ProjectStep.SETUP_FORMAT:
        return !!project.timetableFormat;
      case ProjectStep.SETUP_SUBJECTS:
        return project.subjects.length > 0;
      case ProjectStep.SETUP_TEACHERS:
        return project.teachers.length > 0;
      case ProjectStep.SETUP_ROOMS:
        return project.rooms.length > 0;
      case ProjectStep.SETUP_REQUIREMENTS:
        return project.courseRequirements.length > 0;
      case ProjectStep.AUTO_SCHEDULE:
        return project.courses.length > 0;
      default:
        return true;
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Steps
          current={currentStepIndex}
          onChange={handleStepClick}
          items={steps.map((step, index) => ({
            title: stepConfig[step].title,
            description: stepConfig[step].description,
            status: isStepValid(step) ? 'finish' : 
                   index === currentStepIndex ? 'process' : 'wait'
          }))}
          style={{ marginBottom: '32px' }}
        />

        <div style={{ minHeight: '400px' }}>
          {renderStepContent()}
        </div>

        <div style={{ 
          marginTop: '24px', 
          display: 'flex', 
          justifyContent: 'space-between',
          borderTop: '1px solid #f0f0f0',
          paddingTop: '16px'
        }}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
          >
            上一步
          </Button>

          <Space>
            <span style={{ color: '#666' }}>
              {currentStepIndex + 1} / {steps.length}
            </span>
          </Space>

          <Button
            type="primary"
            icon={<ArrowRightOutlined />}
            onClick={handleNext}
            disabled={!isStepValid(currentStep)}
          >
            {currentStepIndex === steps.length - 1 ? '完成' : '下一步'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ProjectWizard;
