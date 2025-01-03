const fs = require('fs').promises;
const { XMLParser } = require('fast-xml-parser'); // Thư viện để xử lý XML

/**
 * Hàm để trích xuất và ghi dữ liệu từ tệp XML (SSML) sang tệp văn bản
 */
async function extractTextFromSsml() {
    const pathRead = "./input/ssml.xml";  // Đường dẫn tệp XML đầu vào
    const pathWrite = "./output/output.txt";  // Đường dẫn tệp văn bản đầu ra

    try {
        // Kiểm tra xem tệp đầu vào có tồn tại không
        await fs.access(pathRead);

        // Đọc nội dung tệp XML
        const xml = await fs.readFile(pathRead, 'utf8');

        // Phân tích XML thành đối tượng JSON
        const parser = new XMLParser();
        const jsonData = parser.parse(xml);

        // Kiểm tra xem dữ liệu có đúng định dạng không
        if (!jsonData.speak || !jsonData.speak.voice) {
            throw new Error("Dữ liệu SSML không đúng định dạng.");
        }

        // Trích xuất tất cả các dòng 'voice' và tạo chuỗi dữ liệu sẽ ghi vào tệp đầu ra
        const rows = jsonData.speak.voice.map(row => row).join('\n\n');  // Kết nối các dòng bằng ký tự '\n\n' để dễ đọc

        // Kiểm tra thư mục đầu ra, nếu không tồn tại thì tạo mới
        const outputDir = './output';
        await fs.mkdir(outputDir, { recursive: true });

        // Ghi tất cả dữ liệu vào tệp đầu ra một lần
        await fs.writeFile(pathWrite, rows, 'utf8');

        console.log('Ghi thành công vào tệp output.txt');
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

extractTextFromSsml();
