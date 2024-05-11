<script setup>
import { ref } from "vue";
import * as tus from 'tus-js-client';

import vueFilePond from "vue-filepond";

const FilePond = vueFilePond();
const pond = ref(null);

const server = {
    process: (fieldName, file, metadata, load, error, progress, abort) => {
      console.log('file uploading on chunk on filepond', file);
      // Initialize a new tus upload
      const upload = new tus.Upload(file, {
        endpoint: 'http://localhost:3000/files/', // Replace with your tus server endpoint
        resume: true,
        retryDelays: [0, 1000, 3000, 5000],
        chunkSize: 2048000,
        metadata: {
          filename: file.name,
          filetype: file.type
        },
        onError: error,
        // onProgress: progress,
        onProgress: (bytesUploaded, bytesTotal) => {
          progress(true, bytesUploaded, bytesTotal);
        },
        onSuccess: () => {
          // File uploaded successfully
          load(file.name);
        }
      });

      // Start the upload
      upload.start();
    }
  }
</script>

<template>
  <main class="d-flex justify-content-center align-items-center w-100 vh-100">
    <div>
      <h3>Chunk upload using filepond</h3>

      <div>
        <file-pond
          name="files"
          ref="pond"
          label-idle="Drop files here..."
          v-bind:allow-multiple="true"
          :server="server"
        />
      </div>
    </div>
  </main>
</template>