import LayoutHome from '@/layouts/Home'
import { Button, Col, Descriptions, Result, Row } from 'antd'
import confirm from 'antd/lib/modal/confirm'
import { DollarOutlined } from '@ant-design/icons'
import React, { useEffect, useState } from 'react'
import Modal from 'antd/lib/modal/Modal'
import { getPremium, regPremium } from 'api/general'
import handleErrorApi from '@/utils/handleErrorApi'
import BlockLoading from '@/components/loading/BlockLoading'
import ReactImageFallback from 'react-image-fallback'
import { connect } from 'react-redux'
import useAuth from '@/hooks/useAuth'
import GoogleAd from '@/components/ads/GGAds'
import Link from 'next/link'

function premium({ plan, user }) {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [plans, setPlans] = useState('')
  const [selectPlan, setSelect] = useState('')
  const [isSuccess, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const showModal = (plan) => {
    if (user) {
      setSelect(plan)
      setIsModalVisible(true)
    }
  }

  const handleOk = async (id) => {
    // setIsModalVisible(false)
    try {
      setLoading(true)
      const res = await regPremium({ planID: id })
      setSuccess(true)
      setLoading(false)
    } catch (err) {
      handleErrorApi(err)
      handleCancel()
    }
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    setSelect('')
    if (isSuccess == true) {
      window.location.reload()
    } else {
      setSuccess(false)
    }
  }

  useEffect(async () => {
    try {
      const res = await getPremium()
      setPlans(res)
    } catch (err) {
      handleErrorApi(err)
    }
  }, [])

  return (
    <LayoutHome>
      <GoogleAd />
      <Modal
        title={isSuccess ? 'Thành công!' : 'Xác nhận thanh toán'}
        visible={isModalVisible}
        // onOk={() => handleOk(selectPlan.id)}
        onCancel={handleCancel}
        footer={false}
      >
        {loading ? null : isSuccess ? (
          <Result
            status="success"
            title="Thanh toán gói premium thành công!"
            subTitle="Cảm ơn bạn đã ủng hộ chúng mình."
          />
        ) : (
          selectPlan &&
          user && (
            <>
              <div className="flex items-center justify-between mb-2">
                <p className="text-left text-md font-semibold">Tên gói:</p>
                <p className="text-right text-md font-bold text-gray-dark">{selectPlan.name}</p>
              </div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-left text-md font-semibold">Thời gian:</p>
                <p className="text-right text-md font-semibold text-gray-dark">
                  {selectPlan.month} tháng
                </p>
              </div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-left text-md font-semibold">Yunecoin trong tài khoản:</p>
                <p className="text-right text-md font-semibold text-gray-darkness">{user.money}</p>
              </div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-left text-md font-semibold">Thanh toán:</p>
                <p className="text-right text-md font-semibold text-red-500">-{selectPlan.price}</p>
              </div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-left text-md font-semibold">Còn lại:</p>
                <p
                  className={`text-right text-md font-semibold ${
                    user.money - selectPlan.price >= 0 ? 'text-green' : 'text-red-500 line-through'
                  }`}
                >
                  {user.money - selectPlan.price}
                </p>
              </div>
              <div className="flex justify-end">
                <Button
                  disabled={user.money - selectPlan.price < 0}
                  onClick={() => handleOk(selectPlan.id)}
                  type="primary"
                  className="bg-pink text-white border-none hover:bg-pink-dark ml-auto "
                >
                  Xác nhận
                </Button>
                <Button onClick={handleCancel} style={{ margin: '0 8px' }} onClick={handleCancel}>
                  Hủy
                </Button>
              </div>
            </>
          )
        )}
      </Modal>
      <div className="container mx-auto xl:px-40">
        {!plans ? (
          <BlockLoading isLoading={true} />
        ) : (
          <>
            <Link href="https://www.facebook.com/yurineko.moe/posts/1771443086360014">
              <div className="w-full flex items-center justify-center ">
                <img
                  className="flex-shrink-0 max-w-full max-h-full"
                  src={plans.banner}
                  alt="features"
                />
              </div>
            </Link>
            <div>
              <p className="text-3xl text-center font-semibold text-gray-footer my-8 dark:text-dark-text">
                Chọn gói premium của chúng tôi
              </p>

              <Row gutter={[12, 12]}>
                {plans &&
                  plans.result.map((item) => (
                    <Col xs={24} md={12}>
                      <div
                        onClick={() => showModal(item)}
                        className="mb-8 relative mx-auto premium-box rounded-2xl w-full "
                      >
                        <div className="rounded-2xl flex items-center justify-center w-full overflow-hidden">
                          <ReactImageFallback
                            className="flex-shrink-0 max-w-full max-h-full"
                            src={item.thumbnail}
                            alt="image"
                          />
                        </div>
                      </div>
                    </Col>
                  ))}
              </Row>
            </div>
          </>
        )}
      </div>
    </LayoutHome>
  )
}

const mapStateToProps = (state) => ({
  user: state.user.user,
})

export default connect(mapStateToProps, null)(premium)

export async function getServerSideProps(context) {
  // const plan = await getPremium()
  // return {
  //   props: { plan }, // will be passed to the page component as props
  // }
  return {
    props: {},
  }
}
