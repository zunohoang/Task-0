const fs = require('fs').promises;

// Hàm parse timestamp từ text
const parseTimestamps = (timestampText) => {
    // Tách timestamp thành từng dòng và lấy ra các giá trị timeElapsed, duration, index, wordLength
    return timestampText.split("\n").map((line) => {
      const [timeElapsed, duration, index, wordLength] = line.split(",").map(Number);
      return { timeElapsed, duration, index, wordLength };
    });
};

const parseCaption = (captionText) => {
    const result = captionText.match(/[\p{L}\p{M}]+|\W/gu).filter(char => char !== '\n');
    return result;
}
  

const fixIndex = async () => {
    const data1 = await fs.readFile('./input_AB.txt', 'utf-8');
    const words = parseCaption(data1);

    const data2 = await fs.readFile('./timestamp.txt', 'utf-8');
    const timestamps = parseTimestamps(data2);

    let countWord = 0;
    let countChar = 0;
    for(let i = 0; i < words.length; i++) {
        if(words[i] === ' ') {
            countChar += words[i].length;
            continue;
        }
        timestamps[countWord].index = countChar;
        countChar += words[i].length;
        countWord++;
    }
    console.log(timestamps);
    let res = "";
    for(let i = 0; i < timestamps.length; i++) {
        const line = `${Math.round(timestamps[i].timeElapsed / 1.02657142857)},${timestamps[i].duration},${timestamps[i].index},${timestamps[i].wordLength}\n`;
        res += line;
    }
    await fs.writeFile('./data_out.txt', res);
}

fixIndex();