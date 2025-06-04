import { invoke } from '@tauri-apps/api/core';
import { Course } from '../types';

// 检查是否在Tauri环境中
const isTauriEnv = () => {
  return typeof window !== 'undefined' && (window as any).__TAURI__ !== undefined;
};

// 模拟数据存储（用于前端开发环境）
let mockCourses: Course[] = [];

// 模拟API函数（用于前端开发环境）
const mockApi = {
  async getCourses(): Promise<Course[]> {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...mockCourses];
  },

  async addCourse(course: Course): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 100));
    mockCourses.push(course);
  },

  async updateCourse(course: Course): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const index = mockCourses.findIndex(c => c.id === course.id);
    if (index !== -1) {
      mockCourses[index] = course;
    }
  },

  async deleteCourse(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 100));
    mockCourses = mockCourses.filter(c => c.id !== id);
  },

  async exportToCsv(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    // 在浏览器环境中下载CSV文件
    const csvContent = this.generateCsvContent(mockCourses);
    this.downloadCsv(csvContent, 'timetable.csv');
  },

  async importFromCsv(): Promise<Course[]> {
    // 在浏览器环境中，返回一些示例数据
    await new Promise(resolve => setTimeout(resolve, 500));
    const { generateDemoData } = await import('../utils/demoData');
    return generateDemoData().slice(0, 10); // 返回部分示例数据
  },

  async batchAddCourses(courses: Course[]): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    mockCourses.push(...courses);
  },

  generateCsvContent(courses: Course[]): string {
    const headers = ['ID', '课程名称', '教师', '班级', '星期', '节次', '持续节数', '教室'];
    const rows = courses.map(course => [
      course.id,
      course.name || '',
      course.teacher || '',
      course.class_name || '',
      course.day.toString(),
      course.period.toString(),
      course.duration.toString(),
      course.room || ''
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  },

  downloadCsv(content: string, filename: string): void {
    const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

// 获取所有课程
export async function getCourses(): Promise<Course[]> {
  if (isTauriEnv()) {
    return await invoke<Course[]>('get_courses');
  } else {
    return await mockApi.getCourses();
  }
}

// 添加课程
export async function addCourse(course: Course): Promise<void> {
  if (isTauriEnv()) {
    return await invoke<void>('add_course', { course });
  } else {
    return await mockApi.addCourse(course);
  }
}

// 更新课程
export async function updateCourse(course: Course): Promise<void> {
  if (isTauriEnv()) {
    return await invoke<void>('update_course', { course });
  } else {
    return await mockApi.updateCourse(course);
  }
}

// 删除课程
export async function deleteCourse(id: string): Promise<void> {
  if (isTauriEnv()) {
    return await invoke<void>('delete_course', { id });
  } else {
    return await mockApi.deleteCourse(id);
  }
}

// 导出课表为CSV
export async function exportToCsv(): Promise<void> {
  try {
    if (isTauriEnv()) {
      // 在Tauri环境中，通过后端命令处理文件保存
      await invoke('export_to_csv');
    } else {
      // 在浏览器环境中，直接下载CSV文件
      await mockApi.exportToCsv();
    }
  } catch (error) {
    console.error('导出失败:', error);
    throw error;
  }
}

// 导入课程数据
export async function importFromCsv(): Promise<Course[]> {
  try {
    if (isTauriEnv()) {
      return await invoke<Course[]>('import_from_csv');
    } else {
      return await mockApi.importFromCsv();
    }
  } catch (error) {
    console.error('导入失败:', error);
    throw error;
  }
}

// 批量添加课程
export async function batchAddCourses(courses: Course[]): Promise<void> {
  try {
    if (isTauriEnv()) {
      return await invoke<void>('batch_add_courses', { courses });
    } else {
      return await mockApi.batchAddCourses(courses);
    }
  } catch (error) {
    console.error('批量添加失败:', error);
    throw error;
  }
}