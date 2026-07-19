# Exam Watch

Web app tĩnh ghi nhận các tín hiệu gián đoạn trong phiên làm bài trên trình duyệt, tối ưu giao diện cho iPhone Safari.

## Tín hiệu được ghi nhận

- Trang bị ẩn qua Page Visibility API (có thể do chuyển tab, chuyển ứng dụng hoặc khóa màn hình)
- Cửa sổ mất tiêu điểm
- Trang bị đóng, điều hướng hoặc đưa vào back-forward cache
- Thời gian người dùng rời trang và quay lại

## Giới hạn

Trình duyệt không cho website biết tên ứng dụng khác, nội dung màn hình hay toàn bộ hành vi ngoài Safari. Các sự kiện trên là tín hiệu để người coi thi xem xét, không phải bằng chứng kết luận gian lận.

## Chạy cục bộ

Mở `index.html` hoặc chạy một static server:

```bash
python3 -m http.server 8000
```

Sau đó truy cập `http://localhost:8000`.
