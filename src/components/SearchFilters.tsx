import React from 'react';
import { Form, Input, Select, Button, Row, Col, Card } from 'antd';
import { SearchOutlined, ClearOutlined } from '@ant-design/icons';
import { SearchFilters, dayMap } from '../types';

interface SearchFiltersProps {
  onSearch: (filters: SearchFilters) => void;
  onClear: () => void;
}

const SearchFiltersComponent: React.FC<SearchFiltersProps> = ({ onSearch, onClear }) => {
  const [form] = Form.useForm();

  const handleSearch = (values: any) => {
    // 过滤掉空值
    const filters: SearchFilters = {};
    Object.keys(values).forEach(key => {
      if (values[key] && values[key].trim && values[key].trim() !== '') {
        (filters as any)[key] = values[key];
      } else if (values[key] && typeof values[key] === 'number') {
        (filters as any)[key] = values[key];
      }
    });
    onSearch(filters);
  };

  const handleClear = () => {
    form.resetFields();
    onClear();
  };

  return (
    <Card title="搜索筛选" size="small" style={{ marginBottom: 16 }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSearch}
      >
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item name="name" label="课程名称">
              <Input placeholder="请输入课程名称" allowClear />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="teacher" label="教师">
              <Input placeholder="请输入教师姓名" allowClear />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="class_name" label="班级">
              <Input placeholder="请输入班级" allowClear />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="room" label="教室">
              <Input placeholder="请输入教室" allowClear />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item name="day" label="星期">
              <Select placeholder="请选择星期" allowClear>
                {Object.entries(dayMap).map(([key, value]) => (
                  <Select.Option key={key} value={Number(key)}>
                    {value}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={18}>
            <Form.Item label=" " style={{ marginBottom: 0 }}>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                搜索
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={handleClear} icon={<ClearOutlined />}>
                清空
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default SearchFiltersComponent;
