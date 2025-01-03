const fs = require('fs').promises;
const { XMLParser } = require('fast-xml-parser'); // Thư viện để xử lý XML

/**
 * Hàm để trích xuất và ghi dữ liệu từ tệp XML (SSML) sang tệp văn bản
 */
async function extractTextFromSsml() {
    const pathRead = "./input/ssml.xml";  // Đường dẫn tệp XML đầu vào
    const pathWrite = "./output/output_AB.txt";  // Đường dẫn tệp văn bản đầu ra

    try {
        // Kiểm tra xem tệp đầu vào có tồn tại không
        await fs.access(pathRead);

        // Đọc nội dung tệp XML
        const xml = await fs.readFile(pathRead, 'utf8');

        // Phân tích XML thành đối tượng JSON
        const options = { ignoreAttributes: false }; // Tắt ẩn những attributes
        const parser = new XMLParser(options);
        const jsonData = parser.parse(xml);

        // Kiểm tra xem dữ liệu có đúng định dạng không
        if (!jsonData.speak || !jsonData.speak.voice) {
            throw new Error("Dữ liệu SSML không đúng định dạng.");
        }

        // Tạo một Map để lưu trữ tên người (name) và nhãn (label) tương ứng.
        // Dùng Map để đảm bảo rằng mỗi người chỉ được gán một nhãn duy nhất.
        const people = new Map();  // Map để lưu dạng <name - label>, name là thuộc tính @name trong thẻ voice
        let name = 'A';  // Bắt đầu với nhãn là 'A'

        // Dùng map() để lặp qua tất cả các phần tử 'voice' trong dữ liệu json
        const rows = jsonData.speak.voice.map(row => {
            // Kiểm tra nếu người này chưa có trong Map (tức là chưa được gán nhãn)
            if (!people.has(row['@_name'])) {
                // Nếu chưa có, thêm vào Map với tên người (row['@_name']) và nhãn (name)
                people.set(row['@_name'], name);

                // Tăng nhãn lên một ký tự (chuyển 'A' -> 'B', 'B' -> 'C', v.v.)
                name = String.fromCharCode(name.charCodeAt(0) + 1);
            }

            // Tạo chuỗi kết quả với nhãn của người và nội dung văn bản trong thẻ voice (#text)
            return people.get(row['@_name']) + ": " + row['#text'] + "\n";
        });


        // Kiểm tra thư mục đầu ra, nếu không tồn tại thì tạo mới
        const outputDir = './output';
        await fs.mkdir(outputDir, { recursive: true });  // Tạo thư mục nếu chưa có

        // Ghi dữ liệu vào file
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
