
import { useLaunch } from '@tarojs/taro'
import 'taro-ui/dist/style/index.scss';
import './app.scss'

function App({ children }) {
  useLaunch(() => {
    console.log('App launched.')
  })

  // children 是将要会渲染的页面
  return children
}
  


export default App
