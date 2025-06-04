// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use std::fs;
use std::path::Path;
use std::sync::Mutex;
use serde::{Deserialize, Serialize};
use tauri::State;
use tauri::Manager;

// 课程数据结构
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Course {
    id: String,
    name: String,
    teacher: String,
    class_name: String,
    day: u8,        // 1-7 表示周一到周日
    period: u8,     // 第几节课
    duration: u8,   // 持续几节课
    room: String,
}

// 应用状态
pub struct AppState {
    courses: Mutex<Vec<Course>>,
    data_path: String,
}

impl AppState {
    pub fn new(data_path: &str) -> Self {
        let courses = if Path::new(data_path).exists() {
            match fs::read_to_string(data_path) {
                Ok(data) => match serde_json::from_str(&data) {
                    Ok(courses) => courses,
                    Err(_) => Vec::new(),
                },
                Err(_) => Vec::new(),
            }
        } else {
            Vec::new()
        };
        
        Self {
            courses: Mutex::new(courses),
            data_path: data_path.to_string(),
        }
    }
    
    fn save_courses(&self) -> Result<(), String> {
        let courses = self.courses.lock().unwrap();
        let json = serde_json::to_string_pretty(&*courses)
            .map_err(|e| format!("序列化失败: {}", e))?;
        
        fs::write(&self.data_path, json)
            .map_err(|e| format!("保存失败: {}", e))?;
        
        Ok(())
    }
}

// 命令: 获取所有课程
#[tauri::command]
fn get_courses(state: State<AppState>) -> Vec<Course> {
    state.courses.lock().unwrap().clone()
}

// 命令: 添加课程
#[tauri::command]
fn add_course(course: Course, state: State<AppState>) -> Result<(), String> {
    let mut courses = state.courses.lock().unwrap();
    courses.push(course);
    drop(courses);
    state.save_courses()
}

// 命令: 更新课程
#[tauri::command]
fn update_course(course: Course, state: State<AppState>) -> Result<(), String> {
    let mut courses = state.courses.lock().unwrap();
    if let Some(index) = courses.iter().position(|c| c.id == course.id) {
        courses[index] = course;
        drop(courses);
        state.save_courses()
    } else {
        Err("课程不存在".to_string())
    }
}

// 命令: 删除课程
#[tauri::command]
fn delete_course(id: String, state: State<AppState>) -> Result<(), String> {
    let mut courses = state.courses.lock().unwrap();
    if let Some(index) = courses.iter().position(|c| c.id == id) {
        courses.remove(index);
        drop(courses);
        state.save_courses()
    } else {
        Err("课程不存在".to_string())
    }
}

// 命令: 导出课表为CSV
#[tauri::command]
fn export_to_csv(state: State<AppState>) -> Result<(), String> {
    let courses = state.courses.lock().map_err(|_| "Failed to lock courses")?;
    
    // 创建一个临时文件路径
    let temp_path = std::env::temp_dir().join("课程表.csv");
    
    // 创建CSV文件
    let mut wtr = csv::Writer::from_path(&temp_path)
        .map_err(|e| format!("Failed to create CSV file: {}", e))?;
    
    // 写入表头
    wtr.write_record(&["课程ID", "课程名称", "教师", "班级", "星期", "第几节", "持续节数", "教室"])
        .map_err(|e| format!("Failed to write header: {}", e))?;
    
    // 写入数据
    for course in courses.iter() {
        wtr.write_record(&[
            &course.id,
            &course.name,
            &course.teacher,
            &course.class_name,
            &course.day.to_string(),
            &course.period.to_string(),
            &course.duration.to_string(),
            &course.room,
        ]).map_err(|e| format!("Failed to write record: {}", e))?;
    }
    
    // 关闭CSV文件
    wtr.flush().map_err(|e| format!("Failed to flush CSV: {}", e))?;
    
    // 打开保存对话框并让用户选择保存位置
    let dialog_result = std::process::Command::new("powershell")
        .args(&[
            "-Command",
            &format!(
                "Add-Type -AssemblyName System.Windows.Forms; \
                $saveFileDialog = New-Object System.Windows.Forms.SaveFileDialog; \
                $saveFileDialog.Filter = 'CSV Files (*.csv)|*.csv'; \
                $saveFileDialog.Title = '保存课程表'; \
                $saveFileDialog.FileName = '课程表.csv'; \
                if ($saveFileDialog.ShowDialog() -eq 'OK') {{ \
                    Copy-Item -Path '{}' -Destination $saveFileDialog.FileName -Force; \
                    echo $saveFileDialog.FileName; \
                }}", 
                temp_path.to_string_lossy()
            )
        ])
        .output()
        .map_err(|e| format!("Failed to show save dialog: {}", e))?;
    
    if !dialog_result.status.success() {
        return Err("保存对话框操作失败".to_string());
    }
    
    Ok(())
}

// 命令: 导入课程数据
#[tauri::command]
fn import_from_csv() -> Result<Vec<Course>, String> {
    // 打开文件选择对话框
    let dialog_result = std::process::Command::new("powershell")
        .args(&[
            "-Command",
            "Add-Type -AssemblyName System.Windows.Forms; \
            $openFileDialog = New-Object System.Windows.Forms.OpenFileDialog; \
            $openFileDialog.Filter = 'CSV Files (*.csv)|*.csv'; \
            $openFileDialog.Title = '选择要导入的课程表文件'; \
            if ($openFileDialog.ShowDialog() -eq 'OK') { \
                echo $openFileDialog.FileName; \
            }"
        ])
        .output()
        .map_err(|e| format!("Failed to show open dialog: {}", e))?;

    if !dialog_result.status.success() {
        return Err("文件选择对话框操作失败".to_string());
    }

    let file_path_raw = String::from_utf8_lossy(&dialog_result.stdout);
    let file_path = file_path_raw.trim();
    if file_path.is_empty() {
        return Err("未选择文件".to_string());
    }

    // 读取CSV文件
    let mut rdr = csv::Reader::from_path(file_path)
        .map_err(|e| format!("Failed to read CSV file: {}", e))?;

    let mut courses = Vec::new();
    for result in rdr.records() {
        let record = result.map_err(|e| format!("Failed to parse CSV record: {}", e))?;

        if record.len() < 8 {
            continue; // 跳过不完整的记录
        }

        let course = Course {
            id: record[0].to_string(),
            name: record[1].to_string(),
            teacher: record[2].to_string(),
            class_name: record[3].to_string(),
            day: record[4].parse().unwrap_or(1),
            period: record[5].parse().unwrap_or(1),
            duration: record[6].parse().unwrap_or(1),
            room: record[7].to_string(),
        };

        courses.push(course);
    }

    Ok(courses)
}

// 命令: 批量添加课程
#[tauri::command]
fn batch_add_courses(courses: Vec<Course>, state: State<AppState>) -> Result<(), String> {
    let mut existing_courses = state.courses.lock().unwrap();
    existing_courses.extend(courses);
    drop(existing_courses);
    state.save_courses()
}



#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let app_handle = app.handle();
            let data_dir = app_handle.path().app_data_dir().expect("Failed to get app data dir");
            std::fs::create_dir_all(&data_dir).expect("Failed to create app data directory");
            let data_path = data_dir.join("courses.json");
            
            app.manage(AppState::new(data_path.to_str().unwrap()));
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_courses,
            add_course,
            update_course,
            delete_course,
            export_to_csv,
            import_from_csv,
            batch_add_courses
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
