import { Col, Pagination, Row, Select } from 'antd'
import Item from 'antd/lib/list/Item'
import { useRouter } from 'next/router'
import React, { useEffect, useMemo, useState } from 'react'
// import ViewMode from '../button/ViewMode'
import BlockLoading from '../loading/BlockLoading'
import MangaBoxGrid from '../manga/MangaBoxGrid'
import MangaBoxList from '../manga/MangaBoxList'
import ViewMode from '../toggle/ViewMode'
import _ from 'lodash'
import FrameAds from '../ads/FrameAds'
import RowAds from '../ads/RowAds'

export default function DynamicSection({
    selector,
    data,
    getData,
    apiType,
    isLoading,
    pagination = true,
    list = null,
    ...props
}) {
    const [isGrid, setIsGrid] = useState(false)
    const [page, setPage] = useState(1)

    const route = useRouter()
    const { query } = route

    const handleChangeView = (view) => {
        setIsGrid(view)
        localStorage.setItem('isGrid', view)
    }

    const handleChangePage = async (newPage) => {
        if (newPage != 1) {
            route.push(
                `${route.route}?page=${newPage}${Object.keys(route.query).length >= 1 && !route.query.page ? '&' : ''
                }${Object.keys(route.query)
                    .map((item) => {
                        if (item != 'page') return `${item}=${route.query[item]}`
                        else if (item == 'page') return `page=`
                    })
                    .join('&')
                    .replace(/page=/g, '')}`,
                '',
                { shallow: true }
            )
        } else {
            setPage(newPage)
        }
        setPage(newPage)
        getData(newPage)
    }

    useMemo(() => {
        const { query } = route
        handleChangePage(query.page ?? page)
    }, [])

    useMemo(() => {
        setPage(query.page ?? 1);
    }, [query.page])

    useEffect(() => {
        handleChangePage(1);
    }, [apiType])

    return (
        <>
            <div className="relative">
                <div className="px-1 md:px-0 py-3">
                    <div className="flex items-center justify-between px-1 md:px-0">
                        {selector}
                        <ViewMode handleChangeView={handleChangeView} isGrid={isGrid} />
                    </div>
                    {isLoading == true || _.isEmpty(data[apiType]) || _.isEmpty(data[apiType][page]) ? (
                        <BlockLoading isLoading={isLoading} />
                    ) : (
                        <>
                            {isGrid == true ? (
                                <div className="">
                                    <Row className="p-2" gutter={{ xs: 8, sm: 16, md: 20 }}>
                                        {data[apiType][page].result.map((item) => (
                                            <Col xs={12} sm={8} xxl={6} key={`grid-${item.id}`}>
                                                <MangaBoxGrid manga={item} list={list} type={apiType}/>
                                            </Col>
                                        ))}
                                    </Row>
                                </div>
                            ) : (
                                <div className="mt-2">
                                    <Row>
                                        {data[apiType][page].result.map((item) => (
                                            <Col className="mb-2" xs={24} key={`list-${item.id}`}>
                                                <MangaBoxList manga={item} list={list} type={apiType}/>
                                            </Col>
                                        ))}
                                    </Row>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
            <RowAds />
            {pagination && (
                <div className="flex justify-center mt-3">
                    <Pagination
                        current={parseInt(page)}
                        total={data[apiType]?.resultCount ?? 0}
                        pageSize={20}
                        onChange={handleChangePage}
                        showSizeChanger={false}
                    />
                </div>
            )}
        </>
    )
}
