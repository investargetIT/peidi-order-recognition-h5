import React, { useState, useEffect } from 'react';
import { View } from '@tarojs/components'
import { AtButton, AtInput } from 'taro-ui';
import Taro, { useLoad } from '@tarojs/taro'
import './index.scss'

export default function Index () {
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isCounting, setIsCounting] = useState(false);
  const [count, setCount] = useState(60);
  const [smsCode, setSmsCode] = useState('');

  useLoad(() => {
    console.log('Page loaded.')
  })

  useEffect(() => {
    let timer
    if (isCounting && count > 0) {
      timer = setTimeout(() => {
        setCount(count - 1)
      }, 1000)
    } else if (count <= 0) {
      setIsCounting(false)
      setCount(60)
    }
    return () => clearTimeout(timer)
  }, [isCounting, count])

  const getPhoneNumber = async e => {
    const { code } = e.detail;
    if (!code) {
      console.log('用户拒绝授权手机号！！！');
      return;
    }
    console.log(code);
  };

  const handleSendCode = () => {
    if (!phoneNumber.match(/^1[3456789]\d{9}$/)) {
      Taro.showToast({
        title: '手机号格式不正确',
        icon: 'none'
      })
      return
    }
    // 这里应该调用发送验证码的API
    Taro.showToast({
      title: '验证码已发送',
      icon: 'success'
    })
    setIsCounting(true)
  }

  const handleSumbit = () => {}

  return (
    <View className='index'>
      <AtButton type="primary" openType='getPhoneNumber' onGetPhoneNumber={getPhoneNumber}>点击授权手机号</AtButton>
      <AtInput
        type='number'
        title="手机号码"
        name='phoneNumber'
        placeholder='请输入手机号'
        value={phoneNumber}
        onChange={value => setPhoneNumber(value)}
      >
        <AtButton
          onClick={handleSendCode}
          disabled={isCounting}
          className='send-button'
        >
          {isCounting ? `${count}s后重新发送` : '发送验证码'}
        </AtButton>
      </AtInput>
      <AtInput
        name="smsCode"
        title='验证码'
        type='number'
        placeholder='验证码'
        value={smsCode}
        onChange={value => setSmsCode(value)}
      />
      <AtButton type='primary' onClick={handleSumbit}>提交</AtButton>
    </View>
  )
}
