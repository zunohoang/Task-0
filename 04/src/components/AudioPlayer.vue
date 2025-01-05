<!--
  Component hiển thị audio player
  - Hiển thị phụ đề: SubtitlesDisplay
  - Hiển thị audio controls: AudioControls
  Ý tưởng:
  - Tiền xử lý dữ liệu theo định dạng phù hợp để việc hiển thị phụ đề và highlight từng từ không mất thời gian
      + Ưu điểm là việc tìm kiếm, highlight từng từ trong phụ đề sẽ nhanh chóng hơn
      + Nhước điểm là thời điểm đầu tiên phải xử lý dữ liệu phụ đề và timestamp
      -> E nhận thấy việc ưu điểm trên sẽ có lợi hơn só với nhược điểm mà nó mang lại
  - Tạo một mảng lines để lưu trữ dữ liệu phụ đề nó sẽ dạng 
    isHighlighted: true/false để xác định từ đang được highlight hay không
    VD: lines:
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
        user: "A"  // yêu câu thì mình chỉ cần đánh chẵn lẽ để xác định A hay B nhưng nếu dữ liệu nhiều người hơn thì e sử dụng thêm trường user này
      },
      ...
    ]
  - Tạo một Map để tối ưu hóa tìm kiếm dạng <index, {lineIndex, wordIndex}> để lưu vị trí của từng từ trong lines (với index là timestamp.index)
  - Lắng nghe currentTime thay đổi thì sẽ cập nhật highlights cho từng từ
-->

<script>
export default {

}
</script>

<style>

</style>

<script setup>
import { ref, onMounted, watch } from "vue";
import { Howl } from "howler";
import AudioControls from "./AudioControls.vue";
import SubtitlesDisplay from "./SubtitlesDisplay.vue";

// Các đường dẫn tới file audio, phụ đề và timestamp
const audioSrc = "/voice/audio.opus";
const captionSrc = "/voice/output_AB.txt";
const timeStampSrc = "/voice/timestamp.txt";

// Các biến dùng để lưu trữ dữ liệu state
const lines = ref([]); // Mảng lưu dữ liệu phụ đề
const timeStamps = ref([]); // Mảng lưu dữ liệu timestamp
const isPlaying = ref(false); // Trạng thái phát audio
const currentTime = ref(0); // Thời gian hiện tại của audio
const duration = ref(0); // Thời lượng của audio
const sound = ref(null); // Biến lưu trữ audio
const wordIndexMap = new Map(); // Map lưu vị trí của từng từ trong lines để tránh việc lặp mất hiệu năng
const beforeTimestamp = ref(null); // Biến lưu trữ timestamp trước đó

// Hàm fetch file từ url
const fetchFile = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load file: ${url}`);
  }
  return response.text();
};

// Hàm parse phụ đề từ text
const parseCaption = (captionText) => {
  // Tách phụ đề thành từng dòng
  let countChar = 0; // Đếm số ký tự đã đọc
  let currentIndexInTimeStamp = 0; // Vị trí hiện tại trong mảng timeStamps
  // Tách phụ đề thành từng dòng và lưu vào mảng thoe format
  const parsedLines = captionText.split("\n").map((line) => {
    const user = line[0]; // Lấy user từ ký tự đầu tiên
    const tempLine = line.slice(3); // Bỏ qua 3 ký tự đầu tiên VD: 'A: '
    let row = []; // Mảng lưu từng từ trong dòng
    // Duyệt qua từng ký tự trong dòng
    for (let i = 0; i < tempLine.length; i++) {
      // Nếu ký tự hiện tại là bắt đầu của chuỗi có thể highlight thì push vào mảng row
      if (countChar == timeStamps.value[currentIndexInTimeStamp].index) {
        // Thêm vào từ  i -> i + wordLength
        row.push({
          word: tempLine.slice(
            i,
            i + timeStamps.value[currentIndexInTimeStamp].wordLength
          ),
          isHighlighted: false,
        });
        // Tăng vị trí hiện tại trong mảng timeStamps
        currentIndexInTimeStamp += 1;
      } else if (tempLine[i] == " ") {
        // Nếu ký tự hiện tại là khoảng trắng thì push vào mảng row
        row.push({
          word: " ",
          isHighlighted: false,
        });
      }
      // Tăng biến đếm ký tự
      countChar += 1;
    }
    return { row, user };
  });
  console.log(parsedLines);

  // Tạo map để lưu vị trí của từng từ trong lines
  let sumLength = 0;
  // Duyệt qua từng dòng trong mảng lines
  parsedLines.forEach((line, lineIndex) =>
    // Duyệt qua từng từ trong mỗi dòng
    line.row.forEach((word, wordIndex) => {
      // lưu vị trí của từ trong lines
      wordIndexMap.set(sumLength, { lineIndex, wordIndex });
      sumLength += word.word.length;
    })
  );

  return parsedLines;
};

// Hàm parse timestamp từ text
const parseTimestamps = (timestampText) => {
  // Tách timestamp thành từng dòng và lưu vào mảng
  return timestampText.split("\n").map((line) => {
    const [timeElapsed, duration, index, wordLength] = line.split(",").map(Number);
    return { timeElapsed, duration, index, wordLength };
  });
};

// Hàm load file và khởi tạo audio
const loadFiles = async () => {
  try {
    const [captionText, timestampText] = await Promise.all([
      fetchFile(captionSrc),
      fetchFile(timeStampSrc),
    ]);

    // parse dữ liệu từ file cho timeStamps
    timeStamps.value = parseTimestamps(timestampText);
    // sắp xếp mảng timeStamps theo timeElapsed
    timeStamps.value.sort((a, b) => a.timeElapsed - b.timeElapsed);

    // parse dữ liệu từ file cho lines
    lines.value = parseCaption(captionText);
  } catch (error) {
    console.error("Error loading files:", error);
  }
};

// Hàm khởi tạo audio
const initAudio = () => {
  sound.value = new Howl({
    src: [audioSrc],
    html5: true,
    onload: () => {
      // Khi audio load xong thì set giá trị cho duration
      duration.value = sound.value.duration() * 1000;
    },
    onplay: () => {
      // Khi audio play thì set giá trị cho isPlaying và gọi hàm syncCurrentTime
      isPlaying.value = true;
      syncCurrentTime();
    },
    onend: () => {
      // Khi audio kết thúc thì set giá trị cho isPlaying và currentTime
      isPlaying.value = false; // Dừng audio
      currentTime.value = 0; // Reset lại thời gian
      sound.value.seek(0); // Đặt lại audio về đầu
    },
  });
};

// Hàm phát audio
const playAudio = () => {
  // Nếu không có sound thì return
  if (!sound.value) return;

  // Nếu đang phát thì pause, ngược lại thì play
  if (isPlaying.value) {
    // pause audio
    sound.value.pause();
  } else {
    // play audio
    sound.value.play();
  }
  isPlaying.value = !isPlaying.value; // toggle isPlaying
};

// Hàm đồng bộ currentTime với audio
const syncCurrentTime = () => {
  // Nếu sound và isPlaying tồn tại thì set currentTime và gọi lại hàm syncCurrentTime
  if (sound.value && isPlaying.value) {
    currentTime.value = sound.value.seek() * 1000;
    // Gọi lại hàm syncCurrentTime sau mỗi frame (requestAnimationFrame là hàm chạy sau mỗi frame)
    requestAnimationFrame(syncCurrentTime);
  }
};

// Hàm cập nhật highlights
const updateHighlights = () => {
  // Tìm timestamp hiện tại, nó sẽ nằm trong khoảng thời gian currentTime đến currentTime + duration
  const currentTimestamp = timeStamps.value.find(
    (timestamp) =>
      timestamp.timeElapsed <= currentTime.value &&
      currentTime.value < timestamp.timeElapsed + timestamp.duration
  );

  // Nếu có timestamp trước đó thì bỏ highlight
  if (beforeTimestamp.value) {
    // Lấy vị trí của từ trong lines
    const { lineIndex, wordIndex } = wordIndexMap.get(beforeTimestamp.value.index);
    // Bỏ highlight cho từng từ trong khoảng từ index đến index + wordLength
    lines.value[lineIndex].row[wordIndex].isHighlighted = false;
  }

  // Lưu timestamp hiện tại vào beforeTimestamp
  beforeTimestamp.value = currentTimestamp;

  // Nếu không có timestamp hiện tại thì return
  if (!currentTimestamp) return;

  // Lấy vị trí của từ trong lines
  const { lineIndex, wordIndex } = wordIndexMap.get(currentTimestamp.index);
  // Highlight cho từng từ trong khoảng từ index đến index + wordLength
  lines.value[lineIndex].row[wordIndex].isHighlighted = true;
};

// Lắng nghe currentTime để cập nhật highlights
watch(currentTime, updateHighlights);

// Khi component được mount thì load file và khởi tạo audio
onMounted(async () => {
  await loadFiles();
  initAudio();
});
</script>

<template>
  <div
    class="flex flex-col items-center p-10 text-2xl max-w-2xl mx-auto gap-5 bg-white rounded-lg shadow-md mt-20"
  >
    <!-- Hiển thị phụ đề -->
    <SubtitlesDisplay :lines="lines" />

    <!-- Hiển thị audio controls -->
    <AudioControls
      :isPlaying="isPlaying"
      :currentTime="currentTime"
      :duration="duration"
      @playPause="playAudio"
      @update:currentTime="
        (value) => {
          currentTime = +value; // Chuyển chu sang số
          sound.seek(currentTime / 1000); // Tời tới ví trí currentTime
        }
      "
    />
  </div>
</template>