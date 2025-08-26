import { Form, Select } from 'antd'
import React, { useEffect, useState } from 'react'
const mapDataToSelect = (data) => {
  if (!data || data.length == 0) return []
  return data.map((item) => item.id)
}

export default function MultiSelect({
  placeholder,
  name,
  data,
  handleSearch,
  defaultData,
  label,
  isEdit,
  required = true,
}) {
  return (
    <Form.Item
      initialValue={[...(defaultData ? defaultData.map((item) => item.id) : [])]}
      name={name}
      label={label}
      rules={[{ required }]}
    >
      <Select
        mode="multiple"
        onSearch={handleSearch}
        style={{ width: '100%' }}
        placeholder={placeholder}
        notFoundContent={null}
        defaultActiveFirstOption={false}
        showSearch
        filterOption={false}
        // defaultValue={[...initialValue]}
        options={[
          ...(defaultData
            ? defaultData.map((item) => ({
                label: item.name,
                value: item.id,
              }))
            : []),
          ...data.map((item) => ({
            label: item.name,
            value: item.id,
          })),
        ]}
      ></Select>
    </Form.Item>
  )
}
