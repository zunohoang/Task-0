<script setup>
import { PlayCircleIcon, PauseCircleIcon } from "@heroicons/vue/24/solid";

// Nhận các props từ component cha
defineProps(["isPlaying", "currentTime", "duration"]);

// Định nghĩa sự kiện để phát lên component cha
defineEmits(["playPause", "update:currentTime"]);
</script>

<template>
  <div class="flex items-center gap-4 w-full bg-gray-100 p-4 rounded-lg shadow-md">
    <!-- Nút Play-Pause -->
    <button
      @click="$emit('playPause')"
      class="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 transition-colors duration-200"
    >
      <component :is="isPlaying ? PauseCircleIcon : PlayCircleIcon" class="w-8 h-8" />
    </button>

    <!-- Thanh tiến trình -->
    <div class="relative flex-grow h-2">
      <div class="absolute inset-0 bg-gray-300 rounded-full"></div>
      <div
        class="absolute inset-y-0 left-0 bg-sky-500 rounded-full"
        :style="{ width: `${(currentTime / duration) * 100}%` }"
      ></div>
      <div
        class="absolute w-4 h-4 bg-white border-2 border-blue-500 rounded-full shadow-md transform -translate-x-1/2 -translate-y-1/2 top-1/2"
        :style="{ left: `${(currentTime / duration) * 100}%` }"
      ></div>

      <!-- Thanh kéo -->
      <input
        type="range"
        min="0"
        :max="duration"
        :value="currentTime"
        @input="$emit('update:currentTime', $event.target.value)"
        class="absolute inset-0 w-full opacity-0 cursor-pointer"
      />
    </div>
  </div>
</template>
