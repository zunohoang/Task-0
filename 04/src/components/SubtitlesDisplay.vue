<script setup>
// Nhận các props từ component cha
defineProps(["lines"]);

// Hàm lấy màu cho từng user
const getColor = (user) => {
  const colors = {
    A: "black",
    B: "blue",
    // có thể thêm user và màu nhất định vào ...
  };
  return colors[user] || "red";
};
</script>

<template>
  <div class="w-full overflow-y-auto max-h-[60vh]">
    <!-- Hiển thị từng dòng văn bản -->
    <p
      v-for="(line, lineIndex) in lines"
      :key="lineIndex"
      :style="{ color: getColor(line.user) }"
    >
      {{ line.user }}:
      <!-- Hiển thị từng từ trong dòng văn bản -->
      <mark
        v-for="(elem, elemIndex) in line.row"
        :key="`${lineIndex}-${elemIndex}`"
        :class="{ highlighted: elem.isHighlighted }"
      >
        {{ elem.word }}
      </mark>
    </p>
  </div>
</template>

<style scoped>
/* Tùy chỉnh style cho thẻ <mark> */
mark {
  background-color: transparent; /* Mặc định không highlight */
  padding: 0; /* Để tránh khoảng cách không mong muốn */
}

/* Style khi được highlight */
mark.highlighted {
  background-color: yellow; /* Màu nền khi highlight */
}
</style>
