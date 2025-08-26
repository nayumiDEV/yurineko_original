import { Col } from 'antd'
import React, { useState } from 'react'

export default function CheckboxTag({ defaultStatus = 0, item, handlePickTag }) {
  const [status, setStatus] = useState(defaultStatus)

  const handleClick = () => {
    setStatus(status == 0 ? 1 : status == 1 ? 2 : 0);
    handlePickTag(item.id, status == 0 ? 1 : status == 1 ? 2 : 0)
  }
  return (
    <Col md={6} xs={8}>
      <div className="m-2">
        {/* <input
          type="checkbox"
          id={`tag-${item.id}`}
          name={`tag-${item.id}`}
          value={item.name}
          hidden
        /> */}
        <label
          htmlFor={`tag-${item.id}`}
          className="flex items-center cursor-pointer"
          onClick={() => handleClick(item.id)}
        >
          <div className="shadow-inner border rounded w-6 h-6 block flex items-center justify-center">
            {status == 1 ? (
              <i className="fas fa-check text-green"></i>
            ) : status == 2 ? (
              <i className="fas fa-times text-red-500"></i>
            ) : null}
          </div>
          <span className="ml-2 text-base text-gray-dark dark:text-dark-text">{item.name}</span>
        </label>
      </div>
    </Col>
  )
}
