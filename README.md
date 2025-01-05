# Kết quả đạt được

## Task 1

Yêu cầu:

- Viết hàm JavaScript có tên là `extractTextFromSsml` để trích xuất text thuần từ `ssml.xml` ra file có dạng như `output/output.txt`.

- Mỗi dòng trong file `output/output.txt` là một câu nói của một người được phân cách bởi ký tự xuống dòng.

Cách thử nghiệm:

```bash
cd 01
npm i
node index.js
```

Thư viện ngoài sử dụng: `fast-xml-parser` để xử lý `ssml.xml`.

Kết quả:

![Ảnh task1](https://zunohoang.github.io/HTML-CSS-JS-Documents/Screenshot%202025-01-05%20160236.png)

## Task 2

Yêu cầu: (Cài tiến hàm thứ nhất)

- Viết hàm JavaScript có tên là `extractTextFromSsml` để trích xuất text thuần từ `ssml.xml` ra file có dạng như `output/output_AB.txt`.

- File `output/output_AB.txt` có label `A` và `B` để phân biệt giữa 2 người nói.

Cách thử nghiệm:

```bash
cd 02
npm i
node index.js
```

Thư viện ngoài sử dụng: `fast-xml-parser` để xử lý `ssml.xml`.

Kết quả:

![Ảnh task2](https://zunohoang.github.io/HTML-CSS-JS-Documents/Screenshot%202025-01-05%20160308.png)

## Task 3

Yêu cầu:

Trích suất timestamp từ `timestamp.json` xuất ra file có dạng như `output/timestamp.txt`.
Mỗi một dòng trong file `output/timestamp.txt` có 4 số, mỗi số cách nhau bởi dấu phẩy:

- time ellapsed: thời gian audio đã phát tính theo miliseconds
- duration: thời gian đoạn phát âm đã phát tính theo miliseconds
- index: vị trí của bắt đầu của từ đang được phát âm
- word length: độ dài của từ đang được phát âm

Cách thử nghiệm:

```bash
cd 03
npm i
node index.js
```

Xử lý: Vì số lượng người không biết trước nên mình sẽ sử dụng Map hoặc Set để lưu danh sách các người nói

Kết quả:

![Ảnh task3](https://zunohoang.github.io/HTML-CSS-JS-Documents/Screenshot%202025-01-05%20160330.png)

## Task 4

Yêu cầu:

- Viết ứng dụng Vue.js đọc vào file `output/timestamp.txt` và `output/output_AB.txt`.
  Nạp sẵn file âm thành audio.opus. Và lập trình như ảnh dưới đây.
- Để higlight cho đúng thì file `timestamp.txt` cần được chỉnh lại `index` cho phù hợp.
- Dòng thoại của nhân vật A và B cần có màu khác nhau để phân biệt.
- Ấn nút play thì phát, khi đang phát ấn stop để dừng
- Âm thanh kéo đến đâu bôi vàng từ đó
- Kéo slide để tua nhanh, và đồng bộ bôi vàng

Cách thử nghiệm (yêu cầu đã cài đặt vite trước):

```bash
cd 04
npm i
npm run dev
```

-> Truy cập vào url mà terminal hiện

Thư viện ngoài sử dụng: `howler` để xử lý audio.

Kết quả:

[Xem video trên YouTube](https://www.youtube.com/watch?v=DGHZvKcjfPI)

![Ảnh task4](https://zunohoang.github.io/HTML-CSS-JS-Documents/Screenshot%202025-01-05%20160354.png)
