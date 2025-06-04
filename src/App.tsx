import { useState, useEffect } from "react";
import { Layout, Menu, message, Spin, Tag } from "antd";
import { ProjectOutlined, TableOutlined, SettingOutlined, CloudOutlined, DesktopOutlined } from "@ant-design/icons";
import { ProjectState, ExportConfig } from "./types/";
import ProjectManager from "./views/ProjectManager";
import ProjectWizard from "./views/ProjectWizard";
import TimetableView from "./views/TimetableView";
import { projectService } from "./services/projectService";
import "./App.css";

const { Header, Content, Footer } = Layout;

// 应用视图类型
enum AppView {
  PROJECT_MANAGER = 'project_manager',
  PROJECT_WIZARD = 'project_wizard',
  TIMETABLE_VIEW = 'timetable_view'
}

function App() {
  console.log('App component is rendering...');
  const [currentView, setCurrentView] = useState<AppView>(AppView.PROJECT_MANAGER);
  const [projects, setProjects] = useState<ProjectState[]>([]);
  const [currentProject, setCurrentProject] = useState<ProjectState | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // 检查是否在Tauri环境中
  const isTauriEnv = typeof window !== 'undefined' && (window as any).__TAURI__ !== undefined;

  // 加载项目数据
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await projectService.getProjects();
      setProjects(data);
    } catch (error) {
      message.error(`加载项目失败: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  // 项目管理操作
  const handleProjectCreate = async (project: ProjectState) => {
    try {
      await projectService.saveProject(project);
      await loadProjects();
      message.success("项目创建成功");
    } catch (error) {
      message.error(`创建项目失败: ${error}`);
    }
  };

  const handleProjectUpdate = async (project: ProjectState) => {
    try {
      console.log('🔄 App: 更新项目', project.id, '年级数量:', project.grades?.length, '班级数量:', project.classes?.length);

      // 防止重复更新同一个项目
      if (currentProject?.id === project.id &&
          JSON.stringify(currentProject) === JSON.stringify(project)) {
        console.log('⚠️ App: 项目数据未变化，跳过更新');
        return;
      }

      // 保存项目到存储
      await projectService.saveProject(project);

      // 直接更新当前项目状态，避免重新加载所有项目
      if (currentProject?.id === project.id) {
        console.log('🔄 App: 直接更新当前项目状态');
        setCurrentProject(project);
      }

      // 更新项目列表中的对应项目
      setProjects(prevProjects =>
        prevProjects.map(p => p.id === project.id ? project : p)
      );

      // message.success("项目更新成功"); // 暂时注释掉，避免太多提示
    } catch (error) {
      console.error('❌ App: 更新项目失败:', error);
      message.error(`更新项目失败: ${error}`);
    }
  };

  const handleProjectDelete = async (projectId: string) => {
    try {
      await projectService.deleteProject(projectId);
      await loadProjects();
      if (currentProject?.id === projectId) {
        setCurrentProject(null);
        setCurrentView(AppView.PROJECT_MANAGER);
      }
      message.success("项目删除成功");
    } catch (error) {
      message.error(`删除项目失败: ${error}`);
    }
  };

  const handleProjectSelect = (project: ProjectState) => {
    setCurrentProject(project);
    setCurrentView(AppView.PROJECT_WIZARD);
  };

  const handleWizardComplete = () => {
    setCurrentView(AppView.TIMETABLE_VIEW);
  };

  const handleExport = async (config: ExportConfig) => {
    try {
      await projectService.exportTimetable(config);
      message.success("导出成功");
    } catch (error) {
      message.error(`导出失败: ${error}`);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '400px' 
        }}>
          <Spin size="large" />
        </div>
      );
    }

    switch (currentView) {
      case AppView.PROJECT_MANAGER:
        return (
          <ProjectManager
            projects={projects}
            onProjectSelect={handleProjectSelect}
            onProjectCreate={handleProjectCreate}
            onProjectUpdate={handleProjectUpdate}
            onProjectDelete={handleProjectDelete}
          />
        );
      case AppView.PROJECT_WIZARD:
        return currentProject ? (
          <ProjectWizard
            project={currentProject}
            onProjectUpdate={handleProjectUpdate}
            onComplete={handleWizardComplete}
          />
        ) : null;
      case AppView.TIMETABLE_VIEW:
        return currentProject ? (
          <TimetableView
            project={currentProject}
            onExport={handleExport}
          />
        ) : null;
      default:
        return null;
    }
  };

  const getMenuItems = () => {
    const items = [
      {
        key: AppView.PROJECT_MANAGER,
        icon: <ProjectOutlined />,
        label: "项目管理",
      }
    ];

    if (currentProject) {
      items.push(
        {
          key: AppView.PROJECT_WIZARD,
          icon: <SettingOutlined />,
          label: "项目配置",
        },
        {
          key: AppView.TIMETABLE_VIEW,
          icon: <TableOutlined />,
          label: "课程表",
        }
      );
    }

    return items;
  };

  const handleMenuSelect = ({ key }: { key: string }) => {
    setCurrentView(key as AppView);
  };

  console.log('App render - currentView:', currentView, 'loading:', loading, 'projects:', projects.length);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ color: 'white', fontSize: '18px', fontWeight: 'bold' }}>
            教务排课表系统
          </div>
          <Tag
            icon={isTauriEnv ? <DesktopOutlined /> : <CloudOutlined />}
            color={isTauriEnv ? "green" : "blue"}
          >
            {isTauriEnv ? "桌面应用" : "浏览器模式"}
          </Tag>
        </div>
        
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[currentView]}
          onSelect={handleMenuSelect}
          items={getMenuItems()}
          style={{ 
            flex: 1, 
            minWidth: 0,
            justifyContent: 'center',
            backgroundColor: 'transparent'
          }}
        />
        
        <div style={{ color: 'white', fontSize: '14px' }}>
          {currentProject ? `当前项目: ${currentProject.name}` : '未选择项目'}
        </div>
      </Header>
      
      <Content style={{ padding: '0' }}>
        {renderContent()}
      </Content>
      
      <Footer style={{ textAlign: 'center' }}>
        教务排课表系统 ©{new Date().getFullYear()} 版权所有
      </Footer>
    </Layout>
  );
}

export default App;
