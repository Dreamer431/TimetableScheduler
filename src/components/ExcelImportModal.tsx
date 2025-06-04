import React, { useState } from 'react';
import { Modal, Upload, Button, Table, message, Alert, Space, Divider } from 'antd';
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import { ClassInfo, GradeInfo } from '../types';
import { v4 as uuidv4 } from 'uuid';
import * as XLSX from 'xlsx';

interface ExcelImportModalProps {
  visible: boolean;
  onCancel: () => void;
  onOk: (grades: GradeInfo[], classes: ClassInfo[]) => void;
}

interface ImportedClass {
  grade: string;
  classNumber: number;
  className: string;
  studentCount: number;
  classTeacher?: string;
  description?: string;
}

const ExcelImportModal: React.FC<ExcelImportModalProps> = ({
  visible,
  onCancel,
  onOk
}) => {
  const [importedData, setImportedData] = useState<ImportedClass[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (file: File) => {
    setLoading(true);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // 解析数据
        const parsedData: ImportedClass[] = [];
        
        // 跳过标题行，从第二行开始
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i] as any[];
          if (row.length >= 3 && row[0] && row[1] && row[2]) {
            parsedData.push({
              grade: String(row[0]).trim(),
              classNumber: Number(row[1]) || 1,
              className: String(row[2]).trim(),
              studentCount: Number(row[3]) || 40,
              classTeacher: row[4] ? String(row[4]).trim() : undefined,
              description: row[5] ? String(row[5]).trim() : undefined
            });
          }
        }

        if (parsedData.length === 0) {
          message.error('未找到有效的班级数据');
        } else {
          setImportedData(parsedData);
          message.success(`成功解析 ${parsedData.length} 条班级数据`);
        }
      } catch (error) {
        console.error('解析Excel文件失败:', error);
        message.error('解析Excel文件失败，请检查文件格式');
      } finally {
        setLoading(false);
      }
    };

    reader.readAsArrayBuffer(file);
    return false; // 阻止自动上传
  };

  const handleOk = () => {
    if (importedData.length === 0) {
      message.error('请先导入Excel文件');
      return;
    }

    // 按年级分组
    const gradeMap = new Map<string, ImportedClass[]>();
    importedData.forEach(item => {
      if (!gradeMap.has(item.grade)) {
        gradeMap.set(item.grade, []);
      }
      gradeMap.get(item.grade)!.push(item);
    });

    // 生成年级和班级数据
    const grades: GradeInfo[] = [];
    const classes: ClassInfo[] = [];
    let gradeOrder = 1;

    gradeMap.forEach((gradeClasses, gradeName) => {
      const gradeId = uuidv4();
      const gradeInfo: GradeInfo = {
        id: gradeId,
        name: gradeName,
        order: gradeOrder++
      };

      gradeClasses.forEach(classData => {
        const classInfo: ClassInfo = {
          id: uuidv4(),
          name: classData.className,
          grade: gradeName,
          gradeId: gradeId,
          classNumber: classData.classNumber,
          studentCount: classData.studentCount,
          classTeacher: classData.classTeacher,
          description: classData.description
        };
        
        classes.push(classInfo);
      });

      grades.push(gradeInfo);
    });

    onOk(grades, classes);
    setImportedData([]);
  };

  const handleCancel = () => {
    setImportedData([]);
    onCancel();
  };

  const downloadTemplate = () => {
    // 创建模板数据
    const templateData = [
      ['年级', '班级序号', '班级名称', '学生人数', '班主任', '备注'],
      ['高一', 1, '高一(1)班', 45, '张老师', '重点班'],
      ['高一', 2, '高一(2)班', 42, '李老师', ''],
      ['高二', 1, '高二(1)班', 40, '王老师', '理科班'],
      ['高二', 2, '高二(2)班', 38, '赵老师', '文科班']
    ];

    // 创建工作簿
    const ws = XLSX.utils.aoa_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '班级信息');

    // 下载文件
    XLSX.writeFile(wb, '班级导入模板.xlsx');
    message.success('模板下载成功');
  };

  const columns = [
    {
      title: '年级',
      dataIndex: 'grade',
      key: 'grade',
    },
    {
      title: '班级序号',
      dataIndex: 'classNumber',
      key: 'classNumber',
    },
    {
      title: '班级名称',
      dataIndex: 'className',
      key: 'className',
    },
    {
      title: '学生人数',
      dataIndex: 'studentCount',
      key: 'studentCount',
    },
    {
      title: '班主任',
      dataIndex: 'classTeacher',
      key: 'classTeacher',
    },
    {
      title: '备注',
      dataIndex: 'description',
      key: 'description',
    }
  ];

  return (
    <Modal
      title="Excel导入班级信息"
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      width={900}
      okText="确定导入"
      cancelText="取消"
      okButtonProps={{ disabled: importedData.length === 0 }}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <Alert
          message="导入说明"
          description="请按照模板格式准备Excel文件，包含年级、班级序号、班级名称、学生人数、班主任、备注等信息。"
          type="info"
          showIcon
        />

        <Space>
          <Button 
            icon={<DownloadOutlined />} 
            onClick={downloadTemplate}
          >
            下载模板
          </Button>
          
          <Upload
            accept=".xlsx,.xls"
            beforeUpload={handleFileUpload}
            showUploadList={false}
          >
            <Button 
              icon={<UploadOutlined />} 
              loading={loading}
            >
              选择Excel文件
            </Button>
          </Upload>
        </Space>

        {importedData.length > 0 && (
          <>
            <Divider>预览数据 ({importedData.length} 条)</Divider>
            <Table
              columns={columns}
              dataSource={importedData.map((item, index) => ({ ...item, key: index }))}
              pagination={{ pageSize: 10 }}
              size="small"
              scroll={{ y: 300 }}
            />
          </>
        )}
      </Space>
    </Modal>
  );
};

export default ExcelImportModal;
