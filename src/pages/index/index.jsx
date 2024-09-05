import { View } from '@tarojs/components'
import { AtButton } from 'taro-ui';
import { useLoad } from '@tarojs/taro'
import './index.scss'

export default function Index () {
  
  useLoad(() => {
    console.log('Page loaded.')
  })

  const getPhoneNumber = async e => {
    const { code } = e.detail;
    if (!code) {
      console.log('用户拒绝授权手机号！！！');
      return;
    }
    console.log(code);
  };

  return (
    <View className='index'>
      <AtButton type="primary" openType='getPhoneNumber' onGetPhoneNumber={getPhoneNumber}>点击授权手机号</AtButton>
    </View>
  )
}
