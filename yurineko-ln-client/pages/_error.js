function Error({ statusCode }) {
  return (
    <p>
      {statusCode
        ? `Hãy báo admin mã lỗi: ${statusCode}.`
        : 'Xin lỗi vì sự bất tiện, hãy thông báo cho admin khi bạn thấy thông báo này.'}
    </p>
  )
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error
