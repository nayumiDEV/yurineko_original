import React, { useEffect } from 'react'
import { Row, Col, Divider, Avatar, List, Skeleton } from 'antd'
import AdminStatusCard from '../card/AdminStatusCard'
import { Table, Tag, Space } from 'antd'
import AdminUserCard from '../card/AdminUserCard'
import { getDashboard } from '../../redux/actions'
import { connect } from 'react-redux'

const columns = [
  {
    title: 'Tên',
    dataIndex: 'mangaName',
    key: 'mangaName',
    render: (text) => <a>{text?.length > 30 ? text.slice(0, 30) + '...' : text}</a>,
  },
  {
    title: 'Thể loại',
    dataIndex: 'type',
    key: 'type',
    render: (type) => (type == 1 ? 'Truyện thường' : type == 2 ? 'Doujin' : ''),
  },
  {
    title: 'Tình trạng',
    dataIndex: 'status',
    key: 'status',
    render: (status) => {
      if (status == 1) return <Tag color={'red'}>Chưa ra mắt</Tag>
      if (status == 2) return <Tag color={'blue'}>Đã xong</Tag>
      if (status == 3) return <Tag color={'blue'}>Sắp ra mắt</Tag>
      if (status == 4) return <Tag color={'blue'}>Đang tiến hành</Tag>
      if (status == 5) return <Tag color={'blue'}>Tạm dừng</Tag>
      return null
    },
  },
  {
    title: 'Lượt xem',
    key: 'dailyView',
    dataIndex: 'dailyView',
  },
  {
    title: 'Cập nhật',
    key: 'lastUpdate',
    dataIndex: 'lastUpdate',
    render: (time) =>
      new Date(time).toLocaleDateString('vi') + ' ' + new Date(time).toLocaleTimeString('vi'),
  },
]

function TabAdminMonitor({ data, isLoading, ...props }) {
  useEffect(() => {
    props.getDashboard()
  }, [])
  const { stats, newUser, newComment, newManga } = data
  return (
    <div className="p-2 md:p-8">
      <Row gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
        <Col xs={24} sm={12} lg={6}>
          <AdminStatusCard
            bgColor=""
            icon={<i class="far fa-eye"></i>}
            value={stats?.totalWeeklyView}
            title="Lượt xem"
            description="Lượt xem tuần này"
            isLoading={isLoading}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <AdminStatusCard
            bgColor=""
            icon={<i class="fas fa-book"></i>}
            value={stats?.totalManga}
            title="Manga"
            description="Tổng số truyện"
            isLoading={isLoading}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <AdminStatusCard
            bgColor=""
            icon={<i class="fas fa-book-open"></i>}
            title="Truyện gốc"
            value={stats?.totalOrigin}
            description="Tổng số truyện gốc"
            isLoading={isLoading}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <AdminStatusCard
            bgColor=""
            icon={<i class="fas fa-book-open"></i>}
            title="Doujin"
            value={stats?.totalDoujin}
            description="Tổng số doujin"
            isLoading={isLoading}
          />
        </Col>
      </Row>
      <Row gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]} className="mt-5">
        <Col xs={24} sm={12} lg={6}>
          <AdminUserCard isLoading={isLoading} value={newUser ? newUser[0] : {}} />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <AdminUserCard isLoading={isLoading} value={newUser ? newUser[1] : {}} />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <AdminUserCard isLoading={isLoading} value={newUser ? newUser[2] : {}} />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <AdminUserCard isLoading={isLoading} value={newUser ? newUser[3] : {}} />
        </Col>
      </Row>
      <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 12]} className="mt-5">
        <Col xs={24} lg={8}>
          <div className="bg-white rounded ">
            <div className="p-3 border-b">
              <p className="text-xl">Comment mới nhất</p>
            </div>
            <div className="p-3">
              <List
                dataSource={newComment ? newComment : []}
                renderItem={(item, index) => {
                  return (
                    <List.Item key={index}>
                      <List.Item.Meta
                        avatar={<Avatar src={item.avatar} />}
                        title={<a href="#">{item.name}</a>}
                        description={
                          item.content?.length > 30
                            ? item.content.slice(0, 30) + '...'
                            : item.content
                        }
                      />
                      <a className="text-red-500">Delete</a>
                    </List.Item>
                  )
                }}
              ></List>
            </div>
          </div>
        </Col>
        <Col xs={24} lg={16}>
          <div className="bg-white rounded ">
            <div className="p-3 border-b">
              <p className="text-xl">Manga mới nhất</p>
            </div>
            <div className="p-3 w-100 overflow-auto">
              <Table columns={columns} dataSource={newManga} pagination={false} />
            </div>
          </div>
        </Col>
      </Row>
    </div>
  )
}

const mapStateToProps = (state) => ({
  data: state.admin.dashboard,
  isLoading: state.general.isLoading,
})

const mapDispatchToProps = {
  getDashboard,
}

export default connect(mapStateToProps, mapDispatchToProps)(TabAdminMonitor)
