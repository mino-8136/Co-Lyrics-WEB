<template>
  <v-container>
    <v-card class="ma-4">
      <v-card-title>ソフトウェア概要 {{ packagejon.version }}</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <p>
          本アプリケーション「Co-Lyrics-WEB」は、図形・テキストに機能を特化した動画制作アプリケーションです。
        </p>
        <p>
          <a
            href="https://lecture-cc.notion.site/Co-Lyrics-WEB-34b19df882c34498ba847044d2709c30?pvs=4"
            target="_blank"
            >Co-Lyrics-WEB Wiki </a
          >から操作方法や開発情報を確認することができます。
        </p>
      </v-card-text>
      <v-card-text>
        <div class="text-center">
          <v-btn
            color="secondary"
            class="mr-4"
            elevation="4"
            size="x-large"
            href="https://lecture-cc.notion.site/Co-Lyrics-WEB-34b19df882c34498ba847044d2709c30?pvs=4"
            target="_blank"
            >説明サイトを開く</v-btn
          >
          <v-btn color="primary" elevation="4" size="x-large" @click="() => $router.push('/edit')"
            >Edit画面へ移動する</v-btn
          >
        </div>
      </v-card-text>
    </v-card>

    <v-card class="ma-4 pa-4">
      <v-card-title>用語説明</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <p><b>キーフレーム</b>：アニメーションの開始・終了時点を指します。</p>
        <p><b>イージング</b>
          ：アニメーションの動きを滑らかにするためのテクニックです。
        </p>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import packagejon from '../../package.json'
</script>
