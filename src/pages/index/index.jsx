import React from 'react';
import Taro, { useLoad } from '@tarojs/taro'
import { Button, ConfigProvider, Image } from '@nutui/nutui-react-taro';
import './index.scss'
import header from "../../header.jpg";
import footer from "../../footer.jpg";

export default function Index () {

  useLoad(() => {
    console.log('Page loaded.');
  });

  const getPhoneNumber = async e => {
    const { code } = e.detail;
    if (!code) {
      console.log('用户拒绝授权手机号！！！');
      return;
    }
    const params = {
      url: process.env.TARO_APP_API + '/wechat/wechatMobile?code=' + code,
    };
    const { data: res } = await Taro.request(params);
    const { success, data } = res;
    if (success) {
      setWeChatPhoneNumber(data);
      setPhoneNumber(data);
      setDisableSendSmsCode(false);
    }
  };

  const handleAuthBtnClicked = () => {
    const url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${process.env.TARO_APP_ID}&redirect_uri=${process.env.TARO_APP_REDIRECT_URI}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;
    window.open(url);
  };

  const theme = {
    nutuiColorPrimary: '#3880d3',
    nutuiColorPrimaryStop1: '#3880d3',
    nutuiColorPrimaryStop2: '#3880d3',
  }

  return (
    <ConfigProvider theme={theme}>
      <Image src={header} mode="widthFix" width="100%" />
      <div className="bg">
        <div className="container">
          <div className="form">
            <Button
              className="button"
              block
              type="primary"
              shape="square"
              onClick={handleAuthBtnClicked}
            >
              授权手机号
            </Button>
          </div>
        </div>
      </div>
      <Image src={footer} mode="widthFix" width="100%" />
    </ConfigProvider>
  )
}
