import React, { useState, useEffect } from 'react';
import Taro, { useLoad } from '@tarojs/taro'
import { Button, Input, Row, Col, ConfigProvider, Image } from '@nutui/nutui-react-taro';
import './index.scss'
import header from "../../header.jpg";
import footer from "../../footer.jpg";
import coupon from "../../coupon.png";

export default function Index () {
  
  const [orderNo, setOrderNo] = useState('');
  const [weChatPhoneNumber, setWeChatPhoneNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isCounting, setIsCounting] = useState(false);
  const [count, setCount] = useState(60);
  const [smsCode, setSmsCode] = useState('');
  const [displayCoupon, setDisplayCoupon] = useState(false);
  const [disableSendSmsCode, setDisableSendSmsCode] = useState(true);
  const [user, setUser] = useState(null);

  useLoad(() => {
    console.log('Page loaded.')
    Taro.getStorage({
      key: 'user',
      success: function (res) {
        console.log(res.data);
        setUser(JSON.parse(res.data));
      },
      fail: function (res) {
        console.log(res);
      },
    });
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

  const handleSendCode = async () => {
    // if (!phoneNumber.match(/^1[3456789]\d{9}$/)) {
    //   Taro.showToast({
    //     title: '手机号格式不正确',
    //     icon: 'none'
    //   })
    //   return
    // }
    const params = {
      url: process.env.TARO_APP_USER_API + '/user/validate-code',
      data: {
        codeType: 'sms_oms_order_trade',
        destination: phoneNumber,
      },
      header: {
        'PLATFORM': 'oms',
      },
      method: 'POST',
    };
    const { data: res } = await Taro.request(params);
    const { success } = res;
    if (success) {
      Taro.showToast({
        title: '验证码已发送',
        icon: 'success'
      });
      setIsCounting(true);
    }

    // Taro.showToast({
    //   title: '验证码已发送',
    //   icon: 'success'
    // });
    // setIsCounting(true);
  }

  const checkOrderStatus = async () => {
    const params = {
      url: process.env.TARO_APP_API + '/wechat/checkExistTid?tid=' + orderNo,
    };
    const { data: res } = await Taro.request(params);
    const { data } = res;
    return data;
  }

  const handleSumbit = async () => {
    let title = '';
    if (!orderNo) {
      title = '请输入订单号';
    } else if (!phoneNumber.match(/^1[3456789]\d{9}$/)) {
      title = '请输入正确的手机号';
    } else if (!smsCode) {
      title = '请输入验证码';
    }
    if (!orderNo || !phoneNumber || !smsCode) {
      Taro.showToast({
        title: title,
        icon: 'none',
      });
      return;
    }

    // const orderBinded = await checkOrderStatus();
    // if (orderBinded) {
    //   Taro.showToast({
    //     title: '该订单已绑定',
    //     icon: 'none',
    //   });
    //   return;
    // }
    // 保存订单用户关联信息
    const params = {
      url: process.env.TARO_APP_API + '/wechat/saveOrderTrade',
      data: {
        code: smsCode,
        inputMobile: phoneNumber,
        tid: orderNo,
        wechatMobile: phoneNumber,
      },
      method: 'POST',
    };
    const { data: res } = await Taro.request(params);
    const { success, msg } = res;
    if (!success) {
      Taro.showToast({
        title: msg,
        icon: 'none',
      });
      return;
    }
    setDisplayCoupon(true);
  }

  const handleCouponClicked = () => {
    // Taro.setClipboardData({ data: process.env.TARO_APP_COUPON });
    window.open(process.env.TARO_APP_COUPON);
  }

  const handlePhoneNumberChange = value => {
    setPhoneNumber(value);
    setDisableSendSmsCode(!value.match(/^1[3456789]\d{9}$/));
  }

  const theme = {
    nutuiColorPrimary: '#3880d3',
    nutuiColorPrimaryStop1: '#3880d3',
    nutuiColorPrimaryStop2: '#3880d3',
    nutuiInputPadding: '10px',
    nutuiInputFontSize: '13px',
  }

  return (
    <ConfigProvider theme={theme}>
      <Image src={header} mode="widthFix" width="100%" />
      <div className="bg">
        <div className="container">

          {user && <>
            <Row type="flex" justify="center">
              <Image mode="aspectFit" width="50" height="50" radius="50%" src={user.headimgurl} />
            </Row>
            <div className="text text__center">欢迎你，{user.nickname}</div>
          </>}

          {!displayCoupon ? (
            <div className="form">
              <div style={{ width: '100%', height: '1rpx' }} />
              <Input
                className="input input-tid"
                placeholder='输入官旗店近半年的订单号'
                value={orderNo}
                onChange={value => setOrderNo(value)}
              />
              <div className="text">*仅支持同一用户的订单号</div>
              {/* <Button
                className="button"
                block
                type="primary"
                shape="square"
                openType='getPhoneNumber'
                onGetPhoneNumber={getPhoneNumber}
              >
                授权手机号
              </Button> */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: '#fff',
                }}
              >
                <Input
                  className="input"
                  type="number"
                  maxLength="11"
                  placeholder="请输入订单对应收货手机号"
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                />
                <div
                  className="right"
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  <Button
                    className="button"
                    type="primary"
                    shape="square"
                    onClick={handleSendCode}
                    disabled={disableSendSmsCode || isCounting}
                    style={(disableSendSmsCode || isCounting) && { backgroundColor: '#3880d3', opacity: '.8', border: 'none' }}
                  >
                    {isCounting ? `${count}s后重新发送` : '获取验证码'}
                  </Button>
                </div>
              </div>
              <div className="label">请输入验证码</div>
              <Row type="flex" justify="center">
                <Col span="12">
                  <Input
                    className="input input__code"
                    type="number"
                    maxLength="6"
                    placeholder={null}
                    value={smsCode}
                    onChange={value => setSmsCode(value)}
                  />
                </Col>
              </Row>
              <Button
                className="button"
                block
                type="primary"
                shape="square"
                onClick={handleSumbit}
              >
                一键识别
              </Button>
            </div>
          ) : (
            <div>
              <div className="label">恭喜您，识别成功</div>
              <div className="text text__center">请点击优惠券复制链接并在浏览器中打开</div>
              <Row type="flex" justify="center">
                <Image src={coupon} mode="widthFix" width="200" onClick={handleCouponClicked} />
              </Row>
            </div>
          )}
        </div>
      </div>
      <Image src={footer} mode="widthFix" width="100%" />
    </ConfigProvider>
  )
}
