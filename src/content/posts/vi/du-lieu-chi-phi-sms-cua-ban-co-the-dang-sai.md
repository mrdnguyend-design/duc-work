---
title: "Dữ liệu chi phí SMS của bạn có thể đang sai, và ROI sai theo"
description: "Một bảng trong kho dữ liệu lặng lẽ rớt mất 25 trên 31 ngày của một store. Mọi con số chi phí xây trên đó đều bị báo thiếu suốt hai tháng."
pubDate: 2026-09-15
tags: ["SMS", "Dữ liệu", "Mổ xẻ sự cố"]
draft: false
translationOf: "your-sms-cost-data-is-probably-wrong"
---

<!-- TODO: bài mẫu dựng theo sự cố thật. Anh chỉnh mức độ công khai số liệu
     trước khi bỏ `draft: true`. -->

Báo cáo tháng nào tôi cũng bắt đầu giống nhau: kéo doanh thu, kéo chi phí, chia.
Suốt hai tháng, phép chia đó sai với một store của chúng tôi, và không có gì
trong pipeline lên tiếng.

## Chuyện gì đã xảy ra

Chúng tôi đọc chi phí SMS từ một bảng trong kho, đồng bộ từ nền tảng. Tháng 8,
bảng đó chỉ có sáu ngày dữ liệu campaign cho một store. Tháng có ba mươi mốt ngày.

Không có lỗi nào. Truy vấn vẫn trả về dòng. Các dòng vẫn nhất quán với nhau. Con
số chỉ đơn giản là nhỏ.

Chi phí nhỏ đặt cạnh doanh thu đúng thì cho ra một ROI rất đẹp. Đó mới là kiểu
hỏng nguy hiểm — pipeline hỏng theo hướng tin vui luôn bị nghi ngờ muộn hơn
nhiều so với pipeline hỏng theo hướng tin buồn.

## Nó lộ ra bằng cách nào

Không phải nhờ giám sát. Người sáng lập mở màn hình billing của chính nền tảng
lên và thấy số không khớp với báo cáo. Chi phí thật cao gần gấp đôi con số chúng
tôi đang báo.

## Tôi đã đổi gì

Ba quy tắc, áp cho mọi con số chi phí trước khi nó vào báo cáo:

1. **Kiểm độ phủ trước khi kiểm giá trị.** `COUNT(DISTINCT date)` theo từng store,
   đối chiếu với số ngày của kỳ. Chưa đủ thì dừng.
2. **Đối chiếu với màn hình billing, không phải màn hình analytics.** Analytics là
   số mô hình hoá. Billing là số thật sự rời khỏi tài khoản ngân hàng.
3. **Kiểm chéo doanh thu bằng một nguồn độc lập.** Nếu doanh thu nền tảng báo và
   doanh thu analytics báo khớp nhau, phần doanh thu nhiều khả năng ổn, và bạn có
   thể dồn nghi ngờ sang phần chi phí.

## Phần đáng rút ra

Thiếu ngày đồng bộ không phải sự cố hiếm mà bạn thiết kế chống một lần là xong.
Nó là trạng thái thường trực của mọi pipeline dữ liệu bên thứ ba mà bạn không sở
hữu. Câu hỏi không phải là kho của bạn có lặng lẽ rớt ngày hay không — mà là báo
cáo của bạn có phát hiện ra khi điều đó xảy ra hay không.

Báo cáo của chúng tôi thì không. Bây giờ thì có.
