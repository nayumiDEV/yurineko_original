import { Button, Form, Input, Select } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import React, { useState, useEffect } from 'react'

const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 },
}

const formTailLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19, offset: 5 },
}

export default function AddDonate({ onCancel, handleOk, data }) {
  const [form] = useForm()
  const [fields, setFields] = useState([
    {
      name: ['type'],
      value: 'Thẻ cào',
    },
    {
      name: ['money'],
      value: '',
    },
  ])
  useEffect(() => {
    if (data) {
      let newFields = fields.map((item) => {
        return {
          ...item,
          value: data[item.name[0]] ? data[item.name[0]] : '',
        }
      })
      setFields(newFields)
    } else {
      setFields(fields)
    }
  }, [data])
  const onReset = () => {
    form.resetFields()
  }
  return (
    <div>
      <Form
        name="tag-form"
        {...formItemLayout}
        form={form}
        fields={fields}
        onFieldsChange={(_, allFields) => {
          //   setFields(allFields)
        }}
        onFinish={(data) => {
          // form.resetFields()
          setFields([
            {
              name: ['type'],
              value: 'Thẻ cào',
            },
            {
              name: ['money'],
              value: '',
            },
          ])
          handleOk(data)
        }}
      >
        <Form.Item name="type" label="Hình thức" type="text">
          <Select defaultValue="Thẻ cào">
            <Select.Option value="Thẻ cào">Thẻ cào</Select.Option>
            <Select.Option value="ATM">ATM</Select.Option>
            <Select.Option value="Khác">Khác</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="money"
          label="Số tiền"
          type="money"
          rules={[{ required: true, step: 5000, message: 'Số tiền không hợp lệ' }]}
        >
          <Input type="number" step={5000} />
        </Form.Item>

        <Form.Item {...formTailLayout}>
          <div className="flex items-center justify-end">
            <Button type="danger" className="login-form-button mr-2" onClick={onCancel}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" className="login-form-button">
              Lưu
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  )
}
