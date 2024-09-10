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
          <div className="label">佩蒂智创宠物科技有限公司申请获得您的公开信息（昵称、头像等）用于以下作用：</div>
          <div className="text">
            <div>• 领取优惠券</div>
            <div>• 添加企业微信</div>
            <div>• 私域活动通知</div>
          </div>
          <Button
            className="button"
            block
            type="primary"
            shape="square"
            onClick={handleAuthBtnClicked}
          >
            立即授权
          </Button>
        </div>
      </div>
      <Image src={footer} mode="widthFix" width="100%" />
    </ConfigProvider>
  )
}
