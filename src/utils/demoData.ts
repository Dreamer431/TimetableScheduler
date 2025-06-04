import { Course, GradeInfo, ClassInfo } from '../types';
import { v4 as uuidv4 } from 'uuid';

// 演示数据生成器
export function generateDemoData(): Course[] {

  const teachers = [
    '张老师', '李老师', '王老师', '刘老师', '陈老师', '杨老师',
    '赵老师', '黄老师', '周老师', '吴老师', '徐老师', '孙老师',
    '马老师', '朱老师', '胡老师', '林老师', '何老师', '郭老师'
  ];

  const classes = [
    '高一(1)班', '高一(2)班', '高一(3)班', '高一(4)班',
    '高二(1)班', '高二(2)班', '高二(3)班', '高二(4)班',
    '高三(1)班', '高三(2)班', '高三(3)班', '高三(4)班'
  ];

  const rooms = [
    '101教室', '102教室', '103教室', '104教室', '105教室',
    '201教室', '202教室', '203教室', '204教室', '205教室',
    '301教室', '302教室', '303教室', '304教室', '305教室',
    '物理实验室', '化学实验室', '生物实验室', '计算机教室',
    '音乐教室', '美术教室', '体育馆'
  ];

  const courses: Course[] = [];

  // 为每个班级生成课程表
  classes.forEach(className => {
    // 主要科目安排
    const mainSubjects = ['语文', '数学', '英语', '物理', '化学'];
    const minorSubjects = ['历史', '地理', '政治', '生物'];
    const specialSubjects = ['体育', '音乐', '美术', '信息技术'];

    let usedSlots: Set<string> = new Set();

    // 安排主要科目（每周3-4节）
    mainSubjects.forEach(subject => {
      const teacher = teachers[Math.floor(Math.random() * teachers.length)];
      const sessionsPerWeek = 3 + Math.floor(Math.random() * 2); // 3-4节

      for (let session = 0; session < sessionsPerWeek; session++) {
        let day, period;
        let attempts = 0;
        
        do {
          day = 1 + Math.floor(Math.random() * 5); // 周一到周五
          period = 1 + Math.floor(Math.random() * 8); // 1-8节
          attempts++;
        } while (usedSlots.has(`${day}-${period}`) && attempts < 50);

        if (attempts < 50) {
          usedSlots.add(`${day}-${period}`);
          
          courses.push({
            id: uuidv4(),
            subjectId: uuidv4(),
            teacherId: uuidv4(),
            classId: uuidv4(),
            roomId: uuidv4(),
            day: day,
            period: period,
            duration: 1,
            // 兼容性字段
            name: subject,
            teacher: teacher,
            class_name: className,
            room: getSubjectRoom(subject, rooms)
          });
        }
      }
    });

    // 安排次要科目（每周2节）
    minorSubjects.forEach(subject => {
      const teacher = teachers[Math.floor(Math.random() * teachers.length)];
      const sessionsPerWeek = 2;

      for (let session = 0; session < sessionsPerWeek; session++) {
        let day, period;
        let attempts = 0;
        
        do {
          day = 1 + Math.floor(Math.random() * 5);
          period = 1 + Math.floor(Math.random() * 8);
          attempts++;
        } while (usedSlots.has(`${day}-${period}`) && attempts < 50);

        if (attempts < 50) {
          usedSlots.add(`${day}-${period}`);
          
          courses.push({
            id: uuidv4(),
            subjectId: uuidv4(),
            teacherId: uuidv4(),
            classId: uuidv4(),
            roomId: uuidv4(),
            day: day,
            period: period,
            duration: 1,
            // 兼容性字段
            name: subject,
            teacher: teacher,
            class_name: className,
            room: getSubjectRoom(subject, rooms)
          });
        }
      }
    });

    // 安排特殊科目（每周1-2节）
    specialSubjects.forEach(subject => {
      const teacher = teachers[Math.floor(Math.random() * teachers.length)];
      const sessionsPerWeek = 1 + Math.floor(Math.random() * 2); // 1-2节

      for (let session = 0; session < sessionsPerWeek; session++) {
        let day, period;
        let attempts = 0;
        
        do {
          day = 1 + Math.floor(Math.random() * 5);
          period = 1 + Math.floor(Math.random() * 8);
          attempts++;
        } while (usedSlots.has(`${day}-${period}`) && attempts < 50);

        if (attempts < 50) {
          usedSlots.add(`${day}-${period}`);
          
          courses.push({
            id: uuidv4(),
            subjectId: uuidv4(),
            teacherId: uuidv4(),
            classId: uuidv4(),
            roomId: uuidv4(),
            day: day,
            period: period,
            duration: subject === '体育' ? 2 : 1, // 体育课2节连上
            // 兼容性字段
            name: subject,
            teacher: teacher,
            class_name: className,
            room: getSubjectRoom(subject, rooms)
          });
        }
      }
    });
  });

  return courses;
}

// 根据科目分配合适的教室
function getSubjectRoom(subject: string, rooms: string[]): string {
  const subjectRoomMap: Record<string, string[]> = {
    '物理': ['物理实验室', '301教室', '302教室'],
    '化学': ['化学实验室', '303教室', '304教室'],
    '生物': ['生物实验室', '305教室'],
    '信息技术': ['计算机教室'],
    '音乐': ['音乐教室'],
    '美术': ['美术教室'],
    '体育': ['体育馆'],
  };

  const preferredRooms = subjectRoomMap[subject];
  if (preferredRooms) {
    return preferredRooms[Math.floor(Math.random() * preferredRooms.length)];
  }

  // 其他科目使用普通教室
  const normalRooms = rooms.filter(room => 
    !room.includes('实验室') && 
    !room.includes('计算机') && 
    !room.includes('音乐') && 
    !room.includes('美术') && 
    !room.includes('体育馆')
  );
  
  return normalRooms[Math.floor(Math.random() * normalRooms.length)];
}

// 生成年级和班级演示数据
export function generateDemoGradesAndClasses(): { grades: GradeInfo[], classes: ClassInfo[] } {
  const grades: GradeInfo[] = [];
  const classes: ClassInfo[] = [];

  // 定义年级信息
  const gradeNames = ['高一', '高二', '高三'];
  const classCountPerGrade = [6, 5, 4]; // 每个年级的班级数量
  const teachers = ['张老师', '李老师', '王老师', '赵老师', '陈老师', '刘老师', '杨老师', '黄老师'];

  gradeNames.forEach((gradeName, gradeIndex) => {
    const gradeId = uuidv4();

    // 为每个年级创建班级
    for (let classNum = 1; classNum <= classCountPerGrade[gradeIndex]; classNum++) {
      const classInfo: ClassInfo = {
        id: uuidv4(),
        name: `${gradeName}(${classNum})班`,
        grade: gradeName,
        gradeId: gradeId,
        classNumber: classNum,
        studentCount: 35 + Math.floor(Math.random() * 15), // 35-50人
        classTeacher: teachers[Math.floor(Math.random() * teachers.length)],
        description: classNum === 1 ? '重点班' : (classNum === 2 ? '实验班' : '')
      };

      classes.push(classInfo);
    }

    // 创建年级信息（不包含classes字段）
    const gradeInfo: GradeInfo = {
      id: gradeId,
      name: gradeName,
      order: gradeIndex + 1,
      description: `${gradeName}年级，共${classCountPerGrade[gradeIndex]}个班级`
    };

    grades.push(gradeInfo);
  });

  return { grades, classes };
}

// 生成演示数据的API调用
export async function loadDemoData(): Promise<Course[]> {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  return generateDemoData();
}

// 生成年级班级演示数据的API调用
export async function loadDemoGradesAndClasses(): Promise<{ grades: GradeInfo[], classes: ClassInfo[] }> {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 300));
  return generateDemoGradesAndClasses();
}
