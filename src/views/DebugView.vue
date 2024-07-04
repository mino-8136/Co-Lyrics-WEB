<template>
  <h1>DebugView</h1>
  <div class="contextmenu" ref="contextmenu">
    <div>コピー</div>
    <hr />
    <div>戻る</div>
    <div>進む</div>
    <div>再読み込み</div>
  </div>
  <!-- 本文 -->
  <div class="wrapper" @contextmenu.prevent="showContextMenu($event)" @click="hideContextMenu">
    <h1>Hello World!</h1>
    <ul>
      <li>リスト1</li>
      <li>リスト2</li>
      <li>リスト3</li>
      <li>リスト4</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const contextmenu = ref(null);

const showContextMenu = (e) => {
  if (contextmenu.value) {
    contextmenu.value.style.left = e.pageX + 'px';
    contextmenu.value.style.top = e.pageY - window.scrollY + 'px';
    contextmenu.value.style.display = 'block';
  }
};

const hideContextMenu = () => {
  if (contextmenu.value) {
    contextmenu.value.style.display = 'none';
  }
};
</script>

<style scoped>
/* スタイルはそのままで問題ありません */
* {
  margin: 0;
  padding: 0;
}

.contextmenu {
  position: fixed;
  z-index: 99;
  background: #fff;
  color: #555;
  font-size: 11px;
  user-select: none;
  box-shadow: 2px 2px 2px 0 #8f9091;
  border: 1px solid #c6c6c6;
  padding: 0;
  padding-top: 4px;
  padding-bottom: 4px;
  margin: 0;
  outline: 0;
  display: none;
}

.contextmenu div {
  box-sizing: border-box;
  display: block;
  padding: 8px 8px 8px 28px;
  width: 250px;
  position: relative;
  cursor: default;
  font-size: 11px;
  font-family: sans-serif;
}

.contextmenu div:hover {
  background: #ebebeb;
}

.contextmenu hr {
  border: 1px solid #e9e9e9;
  border-bottom: 0;
  margin-top: 5px;
  margin-bottom: 5px;
}
</style>