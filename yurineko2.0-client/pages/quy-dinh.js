import LayoutHome from '@/layouts/Home'
import React from 'react'
import Link from 'next/link'

export default function rule() {
  return (
    <LayoutHome>
      <div className="container mx-auto px-2 xl:px-40 dark:text-dark-text">
        <div className="flex justify-center mt-8 overflow-hidden h-full w-full flex-col text-left">
          <h1 className="text-center text-lg font-bold mb-2 dark:text-dark-text">
            QUY ĐỊNH DÀNH CHO CỘNG ĐỒNG CỦA YURINEKO
          </h1>
          <p className="mb-2">
            Chào mừng tất cả thành viên của cộng đồng yurineko, cảm ơn bạn đã đến với ngôi nhà chung
            này ❤️
          </p>
          <p className="mb-2">
            Yurineko là nền tảng được xây dựng để mang tới sự vui vẻ, tương tác thân thiện giữa mọi
            người, chúng mình mong rằng mọi người sẽ tuân thủ những quy định được yurineko đề ra để
            chúng ta có được một cộng đồng văn minh, bền vững.
          </p>
          <p className="mb-2">
            Quy định được ghi rõ ra từng mục, trường hợp vi phạm chúng mình sẽ xử lý nghiêm khắc.
          </p>
          <ol className="px-2 mb-2">
            <li classNamae="mb-1">
              1. Không đặt tên hiển thị, ảnh đại diện, ảnh bìa có chứa nội dung kinh dị, kinh tởm,
              khiêu dâm, thô tục, phân biệt, xúc phạm, miệt thị với bất cứ cá nhân, nhóm hay thể
              loại truyện khác.
            </li>
            <li classNamae="mb-1">
              2. Không bình luận từ ngữ thô tục, gạ gẫm, quấy rối, phân biệt, xúc phạm, hăm dọa với
              bất cứ cá nhân, nhóm hay thể loại truyện khác.
            </li>
            <li classNamae="mb-1">
              3. Không hối chap, không tỏ thái độ thiếu tôn trọng với nhóm dịch. (Nếu mong chap mới
              hãy bình luận một cách tử tế, lịch sự)
            </li>
            <li classNamae="mb-1">
              4. Không giới thiệu bản dịch hoặc truyện của nhóm khác nằm ngoài phạm vi yurineko.
            </li>
            <li classNamae="mb-1">5. Không spoil, làm ảnh hưởng đến trải nghiệm của người khác.</li>
            <li classNamae="mb-1">6. Không pr, share, mời gọi vào các nhóm chat 18+, chat s*x, fwb.</li>
            <li classNamae="mb-1">7. Không bình luận ảnh kinh dị, kinh tởm, gây ám ảnh cho người khác.</li>
            <li classNamae="mb-1">8. Không bình luận ảnh, nội dung 18+ ở những truyện không có tag R18.</li>
            <li classNamae="mb-1">9. Không chửi bới, xúc phạm nhân vật truyện nếu họ không làm gì sai.</li>
            <li classNamae="mb-1">
              10. Không spam emoji, kí tự, văn bản vô nghĩa, làm loãng web và gây khó chịu cho người
              khác.
            </li>
            <li classNamae="mb-1">
              11. Không bình luận kiểu: “Bộ này mình đọc ở page A/web X rồi” “Bộ này có ở page A/web
              X này”. Bạn đọc ở đâu hay biết có ở đâu là việc của bạn, bình luận kiểu vậy là thiếu
              tôn trọng nhóm dịch ở yurineko.
            </li>
            <li classNamae="mb-1">
              12. Bình luận lịch sự, không quá khích gây phản cảm.
              <br />
              Ví dụ: Truyện trong sáng lành mạnh không bình luận kiểu "dduj nhau đi" "dduj nhau đi
              nói nhiều"...
            </li>
          </ol>
          <p className="mb-2">
            Vi phạm nhẹ bị ban 3-7 ngày, nặng có thể sẽ là vĩnh viễn. Lặp lại lỗi nhiều lần sẽ
            tăng thời gian phạt.
          </p>
          <p className="mb-2">Note: Quy định phiên bản 1.0 - Có hiệu lực từ ngày 15/7/2022.</p>
          <p className="mb-2">
            Những bình luận vi phạm từ trước ngày quy định có hiệu lực sẽ bị xóa.
          </p>
        </div>
      </div>
    </LayoutHome>
  )
}
