//const { fail } = require("assert");
//const { userInfo } = require("os");

// pages/config/config.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: './user-unlogin.png',
    userName: "未登录",
    userType:"",
    userOpenID:"",
    //目标用户的余额
    manageMoney: 100,
    //目标用户
    targetUser:{
      name:"未匹配",
      type:"",
      avatarUrl:'./user-unlogin.png',
      openid:''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!wx.cloud) {

      return
    }

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log(res.userInfo)
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo,
                userName: res.userInfo.nickName
              })
            }
          })
        }
      }
    })
    //初始化 --检查当前用户的类型,查找管理对象
    const db=wx.cloud.database();
    wx.cloud.callFunction({
      name:'login',
      success:res=>{
        this.setData({userOpenID: res.result.openid,})
        const userdb=db.collection('user');
        userdb.where({openid: this.data.userOpenID,}).get({
          success:res=>{
            if(res.data.length!=1){console.log("error:res.data.lengh!=1");return;}
            this.setData({userType:res.data[0].type,});
            //查找管理对象
            var manageopenid=res.data[0].manageOpenID;
            userdb.where({openid:manageopenid}).get({
              success:res=>{
                if(res.data.length!=1){console.log("error:res.data.lengh!=1");return;}
                this.setData({
                  targetUser:{
                    name:res.data[0].name,
                    type:res.data[0].type,
                    avatarUrl:res.data[0].avatarUrl,
                    openid:res.data[0].openid
                  }
                })
              }
            })
            
          }
        })
      },
      fail:console.error
    })
    
  },

  /**
   * getuserinfo按钮，返回函数
   */
  onGetUserInfo: function(e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo,
        userName: e.detail.userInfo.nickName
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})