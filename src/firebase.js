import { initializeApp } from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'


const firebaseConfig = {
  apiKey: 'AIzaSyAUYR_QHy1KXsXCEIrdskKkEY2Z8-fASMQ',
  authDomain: 'fir-chat-app-40988.firebaseapp.com',
  databaseURL: 'https://fir-chat-app-40988-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'fir-chat-app-40988',
  storageBucket: 'fir-chat-app-40988.appspot.com',
  messagingSenderId: '1096781445050',
  appId: '1:1096781445050:web:5c8932ff931e1f18950f83',
  measurementId: 'G-E0WP3F5EX3'
}

const app = initializeApp(firebaseConfig)

export default app