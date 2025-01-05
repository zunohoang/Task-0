const { time } = require('console');

const fs = require('fs').promises;

const parseTimestamps = (timestampText) => {
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
    const START = 925;
    const data1 = await fs.readFile('./input_AB.txt', 'utf-8');
    const words = parseCaption(data1);

    const data2 = await fs.readFile('./timestamp.txt', 'utf-8');
    const timestamps = parseTimestamps(data2);

    
    let index = 0;
    while(timestamps[index].index < 1028) {
        timestamps[index].index -= START;
        index++;
    }

    while(timestamps[index].index < 1143) {
        timestamps[index].index -= (START + 43);
        index++;
    }

    while(timestamps[index].index < 1210) {
        timestamps[index].index -= (START + 43 + 44);
        index++;
    }

    while(timestamps[index].index < 1292) {
        timestamps[index].index -= (START + 43 + 44 + 43);
        index++;
    }

    while(timestamps[index].index < 1359) {
        timestamps[index].index -= (START + 43 + 44 + 43 + 44);
        index++;
    }

    while(timestamps[index].index < 1445) {
        timestamps[index].index -= (START + 43 + 44 + 43 + 44 + 43);
        index++;
    }

    while(timestamps[index].index < 1518) {
        timestamps[index].index -= (START + 43 + 44 + 43 + 44 + 43 + 44);
        index++;
    }

    while(timestamps[index].index < 1591) {
        timestamps[index].index -= (START + 43 + 44 + 43 + 44 + 43 + 44 + 43);
        index++;
    }

    while(index < timestamps.length) {
        timestamps[index].index -= (START + 43 + 44 + 43 + 44 + 43 + 44 + 43 + 44);
        index++;
    }


    console.log(timestamps);
    let res = "";
    for(let i = 0; i < timestamps.length; i++) {
        const line = `${timestamps[i].timeElapsed},${timestamps[i].duration},${timestamps[i].index},${timestamps[i].wordLength}\n`;
        res += line;
    }
    await fs.writeFile('./data_out2.txt', res);
}

fixIndex();