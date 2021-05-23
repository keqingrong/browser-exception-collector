<template>
  <van-list>
    <van-cell border title="Error" is-link @click="createError" />
    <van-cell
      border
      title="Error catched"
      is-link
      @click="createErrorCatched"
    />
    <van-cell
      border
      title="Promise.reject unhandledrejection"
      is-link
      @click="createUnhandledRejection"
    />
    <van-cell
      border
      title="Promise.reject rejectionhandled"
      is-link
      @click="createRejectionHandled"
    />
    <van-cell border title="load css" is-link @click="loadCSS" />
    <van-cell border title="load image" is-link @click="loadImage" />
    <van-cell border title="load script" is-link @click="loadScript" />
    <van-cell
      border
      title="load cross-origin script"
      is-link
      @click="loadCrossOriginScript"
    />
    <van-cell
      border
      title="load anonymous script"
      is-link
      @click="loadAnonymousScript"
    />
    <van-cell border title="create iframe" is-link @click="createIframe" />
    <van-cell border title="xhr fail" is-link @click="createXHR" />
    <van-cell border title="fetch fail" is-link @click="createFetch" />
    <van-cell border title="sendBeacon" is-link @click="sendBeacon" />
  </van-list>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
  methods: {
    createError() {
      const foo = (undefined as unknown) as string;
      console.log(foo.length);
    },
    createErrorCatched() {
      try {
        const foo = (undefined as unknown) as string;
        console.log(foo.length);
      } catch (err) {}
    },
    createUnhandledRejection() {
      const p = Promise.reject('failed');
      p.then(() => {
        console.log('resolve');
      });
    },
    createRejectionHandled() {
      const p = Promise.reject('failed');

      setTimeout(() => {
        p.catch(reason => {
          console.log('reject', reason);
        });
      });
    },
    loadCSS() {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'http://localhost:5000';
      link.onerror = event => {
        console.log('onerror', event);
      };
      document.head.appendChild(link);
    },
    loadImage() {
      const img = document.createElement('img');
      img.src = 'http://localhost:3000';
      img.onerror = event => {
        console.log('onerror', event);
      };
      document.body.appendChild(img);
    },
    loadScript() {
      const script = document.createElement('script');
      script.src = 'http://localhost:3000/throw-error.js';
      script.onerror = event => {
        console.log('onerror', event);
      };
      document.body.appendChild(script);
    },
    loadCrossOriginScript() {
      const script = document.createElement('script');
      script.src = 'http://localhost/throw-error.js';
      script.onerror = event => {
        console.log('onerror', event);
      };
      document.body.appendChild(script);
    },
    loadAnonymousScript() {
      const script = document.createElement('script');
      script.src = 'http://localhost/throw-error.js';
      script.crossOrigin = 'anonymous';
      script.onerror = event => {
        console.log('onerror', event);
      };
      document.body.appendChild(script);
    },
    createIframe() {
      const iframe = document.createElement('iframe');
      iframe.src = 'http://localhost:5000';
      /// https://bugzilla.mozilla.org/show_bug.cgi?id=444165
      iframe.onload = event => {
        console.log('onload', event);
      };
      iframe.onerror = event => {
        console.log('onerror', event);
      };
      document.body.appendChild(iframe);
    },
    createXHR() {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', 'http://localhost:5000');
      xhr.onload = event => {
        console.log('onload', event);
      };
      xhr.onerror = event => {
        console.log('onerror', event);
      };
      xhr.send();
    },
    createFetch() {
      fetch('http://localhost:5000');
    },
    sendBeacon() {
      navigator.sendBeacon('http://localhost:3000');
    }
  }
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #f2f2f2;
}
</style>
