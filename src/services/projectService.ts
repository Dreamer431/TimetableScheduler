import { ProjectState, ExportConfig } from '../types/';

// 检查是否在Tauri环境中
const isTauriEnv = () => {
  return typeof window !== 'undefined' && (window as any).__TAURI__ !== undefined;
};

// 模拟项目数据存储（用于前端开发环境）
let mockProjects: ProjectState[] = [];

// 项目服务类
class ProjectService {
  // 获取所有项目
  async getProjects(): Promise<ProjectState[]> {
    if (isTauriEnv()) {
      // TODO: 实现Tauri API调用
      return [];
    } else {
      // 从localStorage获取项目数据
      const stored = localStorage.getItem('timetable_projects');
      if (stored) {
        try {
          const projects = JSON.parse(stored);
          return projects.map((p: any) => ({
            ...p,
            grades: p.grades || [], // 确保有grades字段
            createdAt: new Date(p.createdAt),
            updatedAt: new Date(p.updatedAt)
          }));
        } catch (error) {
          console.error('解析项目数据失败:', error);
          return [];
        }
      }
      return mockProjects;
    }
  }

  // 保存项目
  async saveProject(project: ProjectState): Promise<void> {
    if (isTauriEnv()) {
      // TODO: 实现Tauri API调用
    } else {
      const projects = await this.getProjects();
      const existingIndex = projects.findIndex(p => p.id === project.id);
      
      if (existingIndex >= 0) {
        projects[existingIndex] = project;
      } else {
        projects.push(project);
      }
      
      localStorage.setItem('timetable_projects', JSON.stringify(projects));
      mockProjects = projects;
    }
  }

  // 删除项目
  async deleteProject(projectId: string): Promise<void> {
    if (isTauriEnv()) {
      // TODO: 实现Tauri API调用
    } else {
      const projects = await this.getProjects();
      const filteredProjects = projects.filter(p => p.id !== projectId);
      localStorage.setItem('timetable_projects', JSON.stringify(filteredProjects));
      mockProjects = filteredProjects;
    }
  }

  // 导出项目数据
  async exportProject(project: ProjectState, format: 'json' | 'backup'): Promise<void> {
    const data = JSON.stringify(project, null, 2);
    const filename = `${project.name}_${format}_${new Date().toISOString().split('T')[0]}.json`;
    
    if (isTauriEnv()) {
      // TODO: 实现Tauri文件保存
    } else {
      // 浏览器下载
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
    }
  }

  // 导入项目数据
  async importProject(file: File): Promise<ProjectState> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const project = JSON.parse(content);
          
          // 验证项目数据结构
          if (!project.id || !project.name || !project.currentStep) {
            throw new Error('无效的项目文件格式');
          }
          
          // 转换日期字段
          project.createdAt = new Date(project.createdAt);
          project.updatedAt = new Date(project.updatedAt);

          // 确保有grades字段
          if (!project.grades) {
            project.grades = [];
          }

          resolve(project);
        } catch (error) {
          reject(new Error('解析项目文件失败'));
        }
      };
      reader.onerror = () => reject(new Error('读取文件失败'));
      reader.readAsText(file);
    });
  }

  // 导出课程表
  async exportTimetable(config: ExportConfig): Promise<void> {
    if (isTauriEnv()) {
      // TODO: 实现Tauri导出功能
    } else {
      // 浏览器模拟导出
      console.log('导出配置:', config);
      
      // 模拟导出延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 创建模拟文件内容
      const content = this.generateExportContent(config);
      const filename = `timetable_${config.type}_${new Date().toISOString().split('T')[0]}.${config.format}`;
      
      const blob = new Blob([content], { 
        type: config.format === 'csv' ? 'text/csv' : 'application/octet-stream' 
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
    }
  }

  // 生成导出内容
  private generateExportContent(config: ExportConfig): string {
    switch (config.format) {
      case 'csv':
        return this.generateCSVContent(config);
      case 'excel':
        return 'Excel格式导出功能待实现';
      case 'pdf':
        return 'PDF格式导出功能待实现';
      default:
        return '未知格式';
    }
  }

  // 生成CSV内容
  private generateCSVContent(config: ExportConfig): string {
    const headers = ['时间', '周一', '周二', '周三', '周四', '周五'];
    const rows = [
      ['第1节', '语文', '数学', '英语', '物理', '化学'],
      ['第2节', '数学', '语文', '物理', '英语', '生物'],
      ['第3节', '英语', '物理', '语文', '数学', '历史'],
      ['第4节', '物理', '英语', '数学', '语文', '地理'],
    ];
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  // 自动排课算法（简化版）
  async autoSchedule(project: ProjectState): Promise<ProjectState> {
    // 模拟排课延迟
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // TODO: 实现真正的排课算法
    // 这里只是一个简化的示例
    const courses = project.courseRequirements.map((req, index) => ({
      id: `course_${index}`,
      subjectId: req.subjectId,
      teacherId: req.teacherId,
      classId: req.classId,
      roomId: project.rooms[0]?.id || '',
      day: (index % 5) + 1,
      period: (index % 8) + 1,
      duration: 1
    }));

    return {
      ...project,
      courses,
      updatedAt: new Date()
    };
  }
}

// 导出单例实例
export const projectService = new ProjectService();
