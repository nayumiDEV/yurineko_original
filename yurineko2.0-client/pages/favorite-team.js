import withAuth from '@/components/HOC/withAuth'
import TeamFollow from '@/components/team/TeamFollow'
import LayoutHome from '@/layouts/Home'
import handleErrorApi from '@/utils/handleErrorApi'
import { Col, Row, Select } from 'antd'
import { getFollowTeam } from 'api/general'
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import BlockLoading from '../src/components/loading/BlockLoading'

function favorite() {
  const [listTeam, setList] = useState()

  useEffect(async () => {
    try {
      const res = await getFollowTeam()
      if (res) {
        setList(res)
      }
    } catch (err) {
      handleErrorApi(err)
    }
  }, [])
  return (
    <LayoutHome>
      <Helmet>
        <title>Nhóm theo dõi</title>
        <meta property="og:image" content="https://yurineko.moe/icons/icon-144.png" />

      </Helmet>
      {!listTeam ? (
        <BlockLoading isLoading={true} />
      ) : (
        <div className="container mx-auto xl:px-40">
          <p className="p-2 text-pink text-center text-2xl font-semibold mt-2 dark:text-dark-text">
            Nhóm theo dõi
          </p>
          <Row
            className="p-2"
            gutter={[
              { xs: 6, md: 12 },
              { xs: 6, md: 12 },
            ]}
          >
            {listTeam.list.map((item) => (
              <Col key={item.index} xs={24} md={12}>
                <TeamFollow item={item} />
              </Col>
            ))}
          </Row>
        </div>
      )}
    </LayoutHome>
  )
}

export default withAuth(favorite)
