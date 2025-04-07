<template>
  <div class="camera-container">
    <div class="video-wrapper">
      <video ref="videoElement" autoplay playsinline></video>
      <div class="recognition-result" v-if="recognitionText">
        {{ recognitionText }}
      </div>
    </div>
    <canvas ref="canvasElement" style="display: none;"></canvas>
    <div class="controls">
      <button @click="startCamera">开启摄像头</button>
      <button @click="stopCamera">关闭摄像头</button>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client'
import axios from 'axios'

export default {
  name: 'MobileCamera',
  data() {
    return {
      stream: null,
      socket: null,
      scanning: false,
      recognitionText: '',
      recognitionInterval: null,
      videoConstraints: {
        facingMode: { exact: "environment" }, // 使用后置摄像头
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      streamingInterval: null
    }
  },
  methods: {
    async startCamera() {
      try {
        // 先测试 API 连接
        console.log('=== Testing API connection ===');
        const serverUrl = window.location.hostname === 'localhost' ? 
          'http://localhost:3000' : `http://${window.location.hostname}:3000`;
        
        try {
          console.log('Testing endpoint:', `${serverUrl}/api/test`);
          const testResponse = await axios.get(`${serverUrl}/api/test`);
          console.log('API test response:', testResponse.data);
          
          if (!testResponse.data.env.apiKey || !testResponse.data.env.apiUrl) {
            throw new Error('API configuration is incomplete');
          }
        } catch (error) {
          console.error('API test failed:', error);
          alert('API 连接测试失败: ' + (error.response?.data?.message || error.message));
          return;
        }

        // 继续原有的摄像头启动逻辑
        console.log('Starting camera...');
        this.stream = await navigator.mediaDevices.getUserMedia({
          video: this.videoConstraints
        });
        this.$refs.videoElement.srcObject = this.stream;
        
        console.log('Starting streaming service...');
        this.startStreaming();
        
        console.log('Starting recognition service...');
        this.startRecognition();
      } catch (error) {
        console.error('Camera startup error:', error);
        alert('无法访问摄像头: ' + error.message);
      }
    },
    stopCamera() {
      if (this.stream) {
        this.stream.getTracks().forEach(track => track.stop());
        this.$refs.videoElement.srcObject = null;
        this.stream = null;
      }
      if (this.socket) {
        this.socket.disconnect();
        this.socket = null;
      }
      if (this.streamingInterval) {
        clearInterval(this.streamingInterval);
        this.streamingInterval = null;
      }
      if (this.recognitionInterval) {
        clearInterval(this.recognitionInterval);
        this.recognitionInterval = null;
      }
      this.recognitionText = '';
    },
    startStreaming() {
      const serverUrl = window.location.hostname === 'localhost' 
        ? 'http://localhost:3000' 
        : `https://${window.location.hostname}`;
      
      this.socket = io(serverUrl, {
        transports: ['websocket', 'polling'],
        path: '/socket.io'
      });

      this.socket.on('connect', () => {
        console.log('Connected to streaming server');
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from streaming server');
      });

      // 每隔一定时间发送视频帧
      this.streamingInterval = setInterval(() => {
        if (this.stream && this.socket && this.socket.connected) {
          const canvas = this.$refs.canvasElement;
          const video = this.$refs.videoElement;
          const context = canvas.getContext('2d');
          
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          const imageData = canvas.toDataURL('image/jpeg', 0.5);
          this.socket.emit('videoFrame', {
            image: imageData,
            recognitionText: this.recognitionText
          });
        }
      }, 100);
    },
    startRecognition() {
      console.log('=== Starting recognition service ===');
      // 先发送一个测试图片
      setTimeout(async () => {
        try {
          const testImageData = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=';
          
          console.log('=== Sending test image ===');
          const serverUrl = window.location.hostname === 'localhost' ? 
            'http://localhost:3000' : `http://${window.location.hostname}:3000`;
          
          const response = await axios.post(`${serverUrl}/api/recognize`, {
            image: testImageData
          }, {
            headers: {
              'Content-Type': 'application/json'
            },
            timeout: 30000
          });
          
          console.log('Test image response:', response.data);
        } catch (error) {
          console.error('Test image recognition failed:', error);
        }
      }, 1000);

      // 原有的识别逻辑
      this.recognitionInterval = setInterval(async () => {
        if (this.stream) {
          try {
            console.log('=== Capturing frame ===');
            const canvas = this.$refs.canvasElement;
            const video = this.$refs.videoElement;
            const context = canvas.getContext('2d');
            
            // 设置较小的尺寸以减少数据量
            canvas.width = 320;
            canvas.height = 240;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            // 获取base64图片数据
            const imageData = canvas.toDataURL('image/jpeg', 0.5);
            console.log('Image captured:', {
              size: imageData.length,
              prefix: imageData.substring(0, 50) + '...'
            });
            
            console.log('=== Sending request to server ===');
            try {
              const serverUrl = window.location.hostname === 'localhost' ? 
                'http://localhost:3000' : `http://${window.location.hostname}:3000`;
              
              console.log('Server URL:', serverUrl + '/api/recognize');
              const response = await axios.post(serverUrl + '/api/recognize', {
                image: imageData
              }, {
                headers: {
                  'Content-Type': 'application/json'
                },
                timeout: 30000
              });
              
              console.log('=== Server response ===');
              console.log('Status:', response.status);
              console.log('Headers:', response.headers);
              console.log('Data:', response.data);
              
              if (response.data && response.data.description) {
                console.log('=== Updating recognition text ===');
                this.recognitionText = response.data.description;
                
                if (this.socket && this.socket.connected) {
                  console.log('=== Broadcasting result ===');
                  this.socket.emit('videoFrame', {
                    image: imageData,
                    recognitionText: this.recognitionText
                  });
                }
              }
            } catch (error) {
              console.error('=== API Call Error ===');
              console.error('Error type:', error.constructor.name);
              console.error('Error message:', error.message);
              if (error.response) {
                console.error('Response status:', error.response.status);
                console.error('Response data:', error.response.data);
              } else if (error.request) {
                console.error('No response received - possible network error');
              }
            }
          } catch (error) {
            console.error('=== Image Processing Error ===');
            console.error('Error type:', error.constructor.name);
            console.error('Error message:', error.message);
          }
        } else {
          console.log('Stream not available');
        }
      }, 8000);
    },
    // 添加图片上传到图床的函数
    async uploadToImageHost(imageData) {
      // 这里需要实现实际的图片上传逻辑
      // 可以使用第三方图床API，如七牛云、阿里云OSS等
      // 返回上传后的图片URL
      try {
        const formData = new FormData();
        // 将base64转换为文件
        const blob = await fetch(imageData).then(r => r.blob());
        formData.append('image', blob);
        
        // 这里替换为实际的图床上传API
        const response = await axios.post('YOUR_IMAGE_HOST_API', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        return response.data.url; // 返回上传后的图片URL
      } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
      }
    }
  },
  beforeDestroy() {
    this.stopCamera();
  }
}
</script>

<style scoped>
.camera-container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.video-wrapper {
  position: relative;
  width: 100%;
  max-width: 640px;
  margin: 0 auto;
}

video {
  width: 100%;
  display: block;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.recognition-result {
  position: absolute;
  bottom: 20px;
  left: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 10px;
  border-radius: 4px;
  font-size: 14px;
  line-height: 1.4;
}

.controls {
  margin-top: 20px;
  text-align: center;
}

button {
  margin: 0 10px;
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}
</style> 