import { Tabs } from 'antd'
import React from 'react'
import { Picker } from 'emoji-mart'

const P_number = 40
const QooBee_number = 50
const Mdq_number = 24
const Emoji_number = 64
const Emoji2_number = 99
const BASE_STORAGE = process.env.BASE_STORAGE

const { TabPane } = Tabs
export default function Emoji({ handleEmoji }) {
  return (
    <div
      style={{ width: 400, height: 500 }}
      className="shadow flex items-center justify-center p-2 rounded-md bg-white shadow-md"
    >
      <Tabs defaultActiveKey="4">
        <TabPane tab="Emoji" key="4">
          <div
            className="flex items-center justify-between flex-wrap overflow-auto"
            style={{ height: 400 }}
          >
            {new Array(Emoji_number).fill(0).map((item, index) => (
              <button
                key={index}
                onClick={() => handleEmoji(`${1 + index + QooBee_number + P_number + Mdq_number}`)}
                className="w-12 h-12 flex items-center justify-center overflow-hidden"
                style={{ margin: 4 }}
              >
                <img
                  className="w-max-full h-max-full flex-shrink-0"
                  src={`${BASE_STORAGE}/emoji/QooBee/qiubilong_${
                    1 + index + QooBee_number + P_number + Mdq_number
                  }.gif`}
                  alt={`emoji-${index}`}
                />
              </button>
            ))}
          </div>
        </TabPane>
        <TabPane tab="Emoji 2" key="5">
          <div
            className="flex items-center justify-between flex-wrap overflow-auto"
            style={{ height: 400 }}
          >
            {new Array(Emoji2_number).fill(0).map((item, index) => (
              <button
                key={index}
                onClick={() =>
                  handleEmoji(`${1 + index + QooBee_number + P_number + Mdq_number + Emoji_number}`)
                }
                className="w-12 h-12 flex items-center justify-center overflow-hidden"
                style={{ margin: 4 }}
              >
                <img
                  className="w-max-full h-max-full flex-shrink-0"
                  src={`${BASE_STORAGE}/emoji/QooBee/qiubilong_${
                    1 + index + QooBee_number + P_number + Mdq_number + Emoji_number
                  }.gif`}
                  alt={`emoji2-${index}`}
                />
              </button>
            ))}
          </div>
        </TabPane>
        <TabPane tab="GL Story" key="2">
          <div
            className="flex items-center justify-between flex-wrap overflow-auto"
            style={{ height: 400 }}
          >
            {new Array(P_number).fill(0).map((item, index) => (
              <button
                onClick={() => handleEmoji(`${1 + index + QooBee_number}`)}
                className="w-12 h-12 flex items-center justify-center overflow-hidden"
                style={{ margin: 4 }}
              >
                <img
                  className="w-max-full h-max-full flex-shrink-0"
                  src={`${BASE_STORAGE}/emoji/QooBee/qiubilong_${1 + index + QooBee_number}.gif`}
                  alt={`girl-${index}`}
                />
              </button>
            ))}
          </div>
        </TabPane>
        <TabPane tab="MDQ" key="1">
          <div
            className="flex items-center justify-between flex-wrap overflow-auto"
            style={{ height: 400 }}
          >
            {new Array(Mdq_number).fill(0).map((item, index) => (
              <button
                onClick={() => handleEmoji(`${1 + index + QooBee_number + P_number}`)}
                className="w-12 h-12 flex items-center justify-center overflow-hidden"
                style={{ margin: 4 }}
              >
                <img
                  className="w-max-full h-max-full flex-shrink-0"
                  src={`${BASE_STORAGE}/emoji/QooBee/qiubilong_${
                    1 + index + QooBee_number + P_number
                  }.gif`}
                  alt={`girl-${index}`}
                />
              </button>
            ))}
          </div>
        </TabPane>

        <TabPane tab="QooBee" key="3">
          <div
            className="flex items-center justify-between flex-wrap overflow-auto"
            style={{ height: 400 }}
          >
            {new Array(QooBee_number).fill(0).map((item, index) => (
              <button
                className="w-12 h-12 flex items-center justify-center overflow-hidden"
                style={{ margin: 4 }}
                onClick={() => handleEmoji(`${index}`)}
              >
                <img
                  className="w-max-full h-max-full flex-shrink-0"
                  src={`${BASE_STORAGE}/emoji/QooBee/qiubilong_${index}.gif`}
                  alt={`QooBee_${index}`}
                />
              </button>
            ))}
          </div>
        </TabPane>
      </Tabs>
    </div>
  )
}
