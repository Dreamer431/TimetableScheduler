// ==================== 核心数据模型 ====================

// 年级信息
export interface GradeInfo {
  id: string;
  name: string;           // 年级名称，如"高一"
  order: number;          // 排序序号
  description?: string;   // 备注
  // 移除 classes 字段，班级数据统一从 project.classes 中获取
}

// 班级信息
export interface ClassInfo {
  id: string;
  name: string;           // 班级名称，如"高一(1)班"
  grade: string;          // 年级，如"高一"
  gradeId: string;        // 年级ID
  classNumber: number;    // 班级序号，如1、2、3
  studentCount: number;   // 学生人数
  classTeacher?: string;  // 班主任
  description?: string;   // 备注
}

// 教师信息
export interface Teacher {
  id: string;
  name: string;           // 教师姓名
  subjects: string[];     // 可教授的科目
  maxHoursPerWeek: number; // 每周最大课时数
  email?: string;
  phone?: string;
  description?: string;   // 备注
}

// 科目信息
export interface Subject {
  id: string;
  name: string;           // 科目名称
  code: string;           // 科目代码
  color: string;          // 显示颜色
  category: string;       // 科目类别：主科、副科、选修等
  defaultDuration: number; // 默认课时长度
  requiresLab: boolean;   // 是否需要实验室
}

// 教室信息
export interface Room {
  id: string;
  name: string;           // 教室名称
  type: string;           // 教室类型：普通教室、实验室、多媒体等
  capacity: number;       // 容量
  building?: string;      // 楼栋
  floor?: number;         // 楼层
  equipment?: string[];   // 设备列表
}

// 课程信息（排课后的结果）
export interface Course {
  id: string;
  subjectId: string;      // 科目ID
  teacherId: string;      // 教师ID
  classId: string;        // 班级ID
  roomId: string;         // 教室ID
  day: number;            // 1-7 表示周一到周日
  period: number;         // 第几节课
  duration: number;       // 持续几节课
  week?: number;          // 第几周（可选，用于单双周课程）

  // 兼容性字段（用于显示）
  name?: string;          // 课程名称
  teacher?: string;       // 教师名称
  class_name?: string;    // 班级名称
  room?: string;          // 教室名称
}

// ==================== 排课配置 ====================

// 课程表格式配置
export interface TimetableFormat {
  id: string;
  name: string;           // 格式名称
  daysPerWeek: number;    // 每周天数（5或7）
  periodsPerDay: number;  // 每天节数
  periodDuration: number; // 每节课时长（分钟）
  startTime: string;      // 开始时间
  breakTimes: BreakTime[]; // 休息时间
}

// 休息时间配置
export interface BreakTime {
  afterPeriod: number;    // 在第几节课后
  duration: number;       // 休息时长（分钟）
  name: string;           // 休息名称（如"大课间"）
}

// 课程需求（排课前的需求定义）
export interface CourseRequirement {
  id: string;
  subjectId: string;      // 科目ID
  classId: string;        // 班级ID
  teacherId: string;      // 教师ID
  hoursPerWeek: number;   // 每周课时数
  preferredRooms?: string[]; // 偏好教室
  constraints?: CourseConstraint[]; // 约束条件
}

// 课程约束
export interface CourseConstraint {
  type: 'time' | 'room' | 'teacher' | 'custom';
  description: string;
  data: any;              // 约束数据
}

// ==================== 系统状态 ====================

// 项目状态
export interface ProjectState {
  id: string;
  name: string;
  currentStep: ProjectStep;
  grades: GradeInfo[];    // 年级信息
  classes: ClassInfo[];
  teachers: Teacher[];
  subjects: Subject[];
  rooms: Room[];
  timetableFormat: TimetableFormat;
  courseRequirements: CourseRequirement[];
  courses: Course[];      // 排课结果
  createdAt: Date;
  updatedAt: Date;
}

// 项目步骤
export enum ProjectStep {
  SETUP_CLASSES = 'setup_classes',       // 设置班级
  SETUP_FORMAT = 'setup_format',         // 设置课表格式
  SETUP_SUBJECTS = 'setup_subjects',     // 设置科目
  SETUP_TEACHERS = 'setup_teachers',     // 设置教师
  SETUP_ROOMS = 'setup_rooms',           // 设置教室
  SETUP_REQUIREMENTS = 'setup_requirements', // 设置课程需求
  AUTO_SCHEDULE = 'auto_schedule',       // 自动排课
  MANUAL_ADJUST = 'manual_adjust',       // 手动调整
  EXPORT = 'export'                      // 导出
}

// ==================== 视图相关 ====================

// 课程表视图类型
export enum TimetableViewType {
  ALL = 'all',              // 全校课程表
  OVERVIEW = 'overview',     // 总览
  CLASS = 'class',          // 班级课程表
  TEACHER = 'teacher',      // 教师课程表
  ROOM = 'room',            // 教室课程表
  SUBJECT = 'subject'       // 科目课程表
}

// 课程表视图配置
export interface TimetableViewConfig {
  type: TimetableViewType;
  targetId?: string;        // 目标ID（班级ID、教师ID等）
  target?: string;          // 目标名称（兼容性字段）
  title: string;
}

// 课表单元格
export interface TimetableCell {
  rowSpan: number;
  course?: Course;
  isEmpty?: boolean;
}

// 课表数据
export type TimetableData = (TimetableCell | null)[][];

// ==================== 导出配置 ====================

// 导出类型
export enum ExportType {
  CLASS_TIMETABLE = 'class_timetable',     // 班级课程表
  TEACHER_TIMETABLE = 'teacher_timetable', // 教师课程表
  ROOM_TIMETABLE = 'room_timetable',       // 教室课程表
  MASTER_TIMETABLE = 'master_timetable',   // 总课程表
  STATISTICS = 'statistics'                // 统计报表
}

// 导出配置
export interface ExportConfig {
  type: ExportType;
  format: 'pdf' | 'excel' | 'csv';
  targets: string[];        // 导出目标（班级ID、教师ID等）
  includeEmpty: boolean;    // 是否包含空课时
  customTitle?: string;     // 自定义标题
}

// ==================== 辅助类型 ====================

// 时间映射
export const dayMap: Record<number, string> = {
  1: '周一', 2: '周二', 3: '周三', 4: '周四', 
  5: '周五', 6: '周六', 7: '周日'
};

// 节次映射
export const periodMap: Record<number, string> = {
  1: '第1节', 2: '第2节', 3: '第3节', 4: '第4节', 5: '第5节',
  6: '第6节', 7: '第7节', 8: '第8节', 9: '第9节', 10: '第10节'
};

// 步骤配置
export const stepConfig: Record<ProjectStep, { title: string; description: string; icon: string }> = {
  [ProjectStep.SETUP_CLASSES]: {
    title: '设置班级',
    description: '配置学校的班级信息',
    icon: 'team'
  },
  [ProjectStep.SETUP_FORMAT]: {
    title: '课表格式',
    description: '设置课程表的基本格式',
    icon: 'table'
  },
  [ProjectStep.SETUP_SUBJECTS]: {
    title: '设置科目',
    description: '配置教学科目信息',
    icon: 'book'
  },
  [ProjectStep.SETUP_TEACHERS]: {
    title: '设置教师',
    description: '配置教师信息和教学能力',
    icon: 'user'
  },
  [ProjectStep.SETUP_ROOMS]: {
    title: '设置教室',
    description: '配置教室和场地信息',
    icon: 'home'
  },
  [ProjectStep.SETUP_REQUIREMENTS]: {
    title: '课程需求',
    description: '设置各班级的课程需求',
    icon: 'setting'
  },
  [ProjectStep.AUTO_SCHEDULE]: {
    title: '自动排课',
    description: '执行自动排课算法',
    icon: 'robot'
  },
  [ProjectStep.MANUAL_ADJUST]: {
    title: '手动调整',
    description: '微调排课结果',
    icon: 'edit'
  },
  [ProjectStep.EXPORT]: {
    title: '导出课表',
    description: '导出各种格式的课程表',
    icon: 'export'
  }
};

// ==================== 搜索和过滤 ====================

// 搜索过滤器
export interface SearchFilters {
  keyword?: string;
  subject?: string;
  teacher?: string;
  class?: string;
  room?: string;
  day?: number;
  period?: number;
}

// 验证结果
export interface ValidationResult {
  isValid: boolean;
  conflicts: ConflictInfo[];
  warnings: WarningInfo[];
}

// 冲突信息
export interface ConflictInfo {
  type: 'time' | 'room' | 'teacher';
  message: string;
  courses: Course[];
}

// 警告信息
export interface WarningInfo {
  type: 'workload' | 'preference' | 'constraint';
  message: string;
}

// 统计信息
export interface Statistics {
  totalCourses: number;
  roomUsage: Record<string, number>;
  roomUtilization: Record<string, number>;
  teacherWorkload: Record<string, number>;
  teacherCount: number;
  classSchedule: Record<string, number>;
  classScheduleStats: Record<string, number>;
  classCount: number;
  subjectDistribution: Record<string, number>;
}

// ==================== 辅助函数 ====================

// 获取唯一值（单个字段）
export function getUniqueValues(courses: Course[], field: keyof Course): string[] {
  const values = courses.map(course => {
    const value = course[field];
    return typeof value === 'string' ? value : String(value);
  });
  return Array.from(new Set(values)).filter(Boolean);
}

// 获取所有字段的唯一值
export function getAllUniqueValues(courses: Course[]): {
  teachers: string[];
  classes: string[];
  subjects: string[];
  rooms: string[];
} {
  return {
    teachers: Array.from(new Set(courses.map(c => c.teacher).filter(Boolean))) as string[],
    classes: Array.from(new Set(courses.map(c => c.class_name).filter(Boolean))) as string[],
    subjects: Array.from(new Set(courses.map(c => c.name).filter(Boolean))) as string[],
    rooms: Array.from(new Set(courses.map(c => c.room).filter(Boolean))) as string[]
  };
}

// 过滤课程
export function filterCourses(courses: Course[], filters: SearchFilters): Course[] {
  return courses.filter(course => {
    if (filters.keyword) {
      // 这里需要根据实际的课程属性来搜索
      // 暂时返回 true，具体实现需要根据 Course 接口调整
      return true;
    }
    if (filters.day && course.day !== filters.day) return false;
    if (filters.period && course.period !== filters.period) return false;
    return true;
  });
}

// 检查课程冲突
export function checkCourseConflicts(course: Course, existingCourses: Course[]): ValidationResult {
  const conflicts: ConflictInfo[] = [];
  const warnings: WarningInfo[] = [];

  // 检查时间冲突
  const timeConflicts = existingCourses.filter(existing =>
    existing.day === course.day &&
    existing.period === course.period &&
    existing.id !== course.id
  );

  if (timeConflicts.length > 0) {
    conflicts.push({
      type: 'time',
      message: '时间冲突',
      courses: timeConflicts
    });
  }

  return {
    isValid: conflicts.length === 0,
    conflicts,
    warnings
  };
}

// 根据视图过滤课程
export function filterCoursesByView(courses: Course[], config: TimetableViewConfig): Course[] {
  if (config.type === TimetableViewType.ALL) {
    return courses;
  }

  if (!config.targetId) {
    return courses;
  }

  return courses.filter(course => {
    switch (config.type) {
      case TimetableViewType.CLASS:
        return course.classId === config.targetId;
      case TimetableViewType.TEACHER:
        return course.teacherId === config.targetId;
      case TimetableViewType.ROOM:
        return course.roomId === config.targetId;
      case TimetableViewType.SUBJECT:
        return course.subjectId === config.targetId;
      default:
        return true;
    }
  });
}

// 将课程转换为课表数据
export function coursesToTimetableData(courses: Course[], daysPerWeek: number = 7, periodsPerDay: number = 10): TimetableData {
  const data: TimetableData = Array(periodsPerDay).fill(null).map(() =>
    Array(daysPerWeek).fill(null)
  );

  courses.forEach(course => {
    const dayIndex = course.day - 1; // 转换为0-based索引
    const periodIndex = course.period - 1; // 转换为0-based索引

    if (dayIndex >= 0 && dayIndex < daysPerWeek && periodIndex >= 0 && periodIndex < periodsPerDay) {
      data[periodIndex][dayIndex] = {
        rowSpan: course.duration || 1,
        course,
        isEmpty: false
      };
    }
  });

  return data;
}
