const fs = require('fs').promises;  // Sử dụng fs.promises

/**
 * Hàm để trích xuất và ghi dữ liệu từ tệp json sang dạng theo yêu cầu (.txt (csv))
 */
async function extractTimestampData() {
    const inputPath = './input/timestamp.json';  // Đường dẫn tệp JSON đầu vào
    const outputPath = './output/timestamp.txt';  // Đường dẫn tệp văn bản đầu ra

    try {
        // Kiểm tra xem tệp đầu vào có tồn tại không
        await fs.access(inputPath);

        // Đọc file json
        const data = await fs.readFile(inputPath, 'utf8');

        // Chuyển từ string sang json
        const jsonData = JSON.parse(data);

        // Kiểm tra cấu trúc của jsonData, đảm bảo có timestamp
        if (!jsonData.timestamp) {
            throw new Error('Dữ liệu không hợp lệ: Không tìm thấy timestamp');
        }

        // Tạo một mảng các dòng cần ghi vào tệp
        const rows = jsonData.timestamp.map(item => {
            const timeElapsed = item[0];
            const duration = item[1];
            const index = item[2];
            const wordLength = item[3];

            // Trả về chuỗi với định dạng cần ghi
            return `${timeElapsed},${duration},${index},${wordLength}\n`;
        });

        // Kiểm tra thư mục đầu ra, nếu không tồn tại thì tạo mới
        const outputDir = './output';
        await fs.mkdir(outputDir, { recursive: true });  // Tạo thư mục nếu chưa có

        // Ghi toàn bộ nội dung vào tệp văn bản một lần (kết hợp các dòng thành một chuỗi)
        await fs.writeFile(outputPath, rows.join(''), 'utf8');  // Nối các chuỗi lại với nhau

        console.log('Trích xuất timestamp thành công!');
    } catch (err) {
        // Xử lý các lỗi có thể xảy ra
        if (err.code === 'ENOENT') {
            console.error('Tệp hoặc thư mục không tồn tại:', err.path);
        } else if (err instanceof Error) {
            console.error('Lỗi khi xử lý tệp:', err.message);
        } else {
            console.error('Lỗi không xác định:', err);
        }
    }
}

extractTimestampData();
