# Kết quả đạt được

## Mục lục

- [Task 1](#task-1)
- [Task 2](#task-2)
- [Task 3](#task-3)
- [Task 4](#task-4)

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

- Viết ứng dụng Vue.js đọc vào file `output/timestamp.txt` và `output/output_AB.txt`. Và file audio.opus
- Dòng thoại của nhân vật A và B cần có màu khác nhau để phân biệt. (thêm nhiều người hơn vẫn có thể)
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

E có chỉnh sửa lại index và timeElapsed, yêu cầu đề bảo sửa index nhưng mà e nhận thấy thời gian audio là 31.5s và thời gian từ cuối được highlight là 32.3s nó gây chênh lệch và không highlight được nên em có hiệu chỉnh lại dữ liệu thời gian trong timeElapsed thành timeElapsed \* (32.3 / 31.5), thử nghiệm thì thấy phù hợp

#### Cách xử lý:

Component hiển thị audio player

- Hiển thị phụ đề: SubtitlesDisplay
- Hiển thị audio controls: AudioControls
  Ý tưởng:
- `Tiền xử lý dữ liệu` theo định dạng phù hợp để việc `hiển thị phụ đề và highlight` từng từ `không mất thời gian`

  - `Ưu điểm` là việc `tìm kiếm, highlight` từng từ trong phụ đề sẽ `nhanh chóng` hơn
  - `Nhước điểm` là `thời điểm đầu tiên` phải `xử lý dữ liệu` phụ đề và timestamp với `độ phức tạp chấp nhận được` ở thời điểm đầu.

    -> E nhận thấy việc `ưu điểm` trên sẽ có `lợi hơn só với nhược điểm mà nó mang lại`

- Tạo một mảng lines để lưu trữ dữ liệu phụ đề nó sẽ dạng json dưới

  - isHighlighted: true/false để xác định từ đang được highlight hay không
    VD: lines:

  ```json
  [
    {
      row: [
        { word: "Chào", isHighlighted: false },
        { word: "", isHighlighted: false },
        { word: "bạn", isHighlighted: false },
        { word: "!", isHighlighted: false },
        // Tách từ ra như này tùy thuộc vào dữ liệu ở timestamp
        ...
      ],
      user: "A" // yêu câu thì mình chỉ cần đánh chẵn lẽ để xác định A hay B nhưng nếu dữ liệu nhiều người hơn thì e sử dụng thêm trường user này
    },
    ...
  ]
  ```

- Tạo một `Map` để `tối ưu hóa tìm kiếm` dạng <index, {lineIndex, wordIndex}> để lưu vị trí của từng từ trong lines (với index là timestamp.index)
- Lắng nghe currentTime thay đổi thì sẽ cập nhật highlights cho từng từ

Kết quả:

[Xem video trên YouTube](https://www.youtube.com/watch?v=DGHZvKcjfPI)

![Ảnh task4](https://zunohoang.github.io/HTML-CSS-JS-Documents/Screenshot%202025-01-05%20160354.png)

---

## --Hết--

##### Ngoài ra còn thư mục /script_fix_index để chỉnh sửa index và timestamp bị nhanh
