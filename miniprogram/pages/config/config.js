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
    manageMoney: 0,
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
    if (!wx.cloud) {return}

    // 获取用户信息
    wx.getSetting({success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({success: res => {
            this.setData({userInfo: res.userInfo})
          }})

        }
    }})

    //login
    wx.cloud.callFunction({name:"login",success: res=>{
      this.initUserInfoFromServer_openid(res.result);
    }})

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
      //login
      wx.cloud.callFunction({name:"login",success: res=>{
        this.initUserInfoFromServer_openid(res.result);
      }})
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
  },

  /**
   * 初始化个人信息
   */
  initUserInfoFromServer: function(res){
    this.setData({
      avatarUrl: res.userInfo.avatarUrl,
      userInfo: res.userInfo,
      userName: res.userInfo.nickName
    })
    //从数据库中查找
    const userdb=wx.cloud.database().collection('user');
    userdb.where({name: this.data.userName}).get({success:res=>{
      if(res.data.length!=1){console.log("error:res.data.lengh!=1");return;}
      this.setData({userType:res.data[0].type, userOpenID: res.data[0].openid});
      if(this.data.userType=="管理员"){
        this.setData({userManageOpenIDList:res.data[0].manageOpenIDList});
        //查找VIP对象
        var manageopenid=res.data[0].manageOpenID;
        userdb.where({openid:manageopenid}).get({success:res=>{
          if(res.data.length!=1){console.log("error:res.data.lengh!=1");return;}
          this.setData({
            targetUser:{
              name:res.data[0].name,
              type:res.data[0].type,
              avatarUrl:res.data[0].avatarUrl,
              openid:res.data[0].openid
            }
          })
          //查找对应账户
          const paymoneydb=wx.cloud.database().collection('paymoney');
          paymoneydb.where({vipUserName: this.data.targetUser.name}).get({success:res=>{
              this.setData({manageMoney: res.data.pop().money})
          }})
        }})
      } else if(this.data.userType=="VIP") {
        //查找mg信息
        var manageopenid=res.data[0].manageOpenID;
        userdb.where({openid:manageopenid}).get({success:res=>{
          if(res.data.length!=1){console.log("error:res.data.lengh!=1");return;}
          this.setData({
            targetUser:{
              name:res.data[0].name,
              type:res.data[0].type,
              avatarUrl:res.data[0].avatarUrl,
              openid:res.data[0].openid
            }
          })
        }})
        //查找自己账户
        const paymoneydb=wx.cloud.database().collection('paymoney');
        paymoneydb.where({vipUserName: this.data.userName}).get({success:res=>{
            this.setData({manageMoney: res.data.pop().money})
        }})
      }
        
        
    }})
  },

  initUserInfoFromServer_openid:function(res){
    //从数据库中查找当前用户
    const userdb=wx.cloud.database().collection('user');
    userdb.where({openid: res.openid}).get({success:res=>{
      if(res.data.length!=1){console.log("error:res.data.lengh!=1");return;}
      this.setData({
        userType:res.data[0].type, 
        userOpenID: res.data[0].openid, 
        avatarUrl: res.data[0].avatarUrl,  //????
        userName: res.data[0].name
      });
      if(this.data.userType=="管理员"){
        this.setData({userManageOpenIDList:res.data[0].manageOpenIDList});
        //查找VIP对象
        var manageopenid=res.data[0].manageOpenID;
        userdb.where({openid:manageopenid}).get({success:res=>{
          if(res.data.length!=1){console.log("error:res.data.lengh!=1");return;}
          this.setData({
            targetUser:{
              name:res.data[0].name,
              type:res.data[0].type,
              avatarUrl:res.data[0].avatarUrl,
              openid:res.data[0].openid
            }
          })
          //查找对应账户
          const paymoneydb=wx.cloud.database().collection('paymoney');
          paymoneydb.where({vipUserName: this.data.targetUser.name}).get({success:res=>{
              this.setData({manageMoney: res.data.pop().money})
          }})
        }})
      } else if(this.data.userType=="VIP") {
        //查找mg信息
        var manageopenid=res.data[0].manageOpenID;
        userdb.where({openid:manageopenid}).get({success:res=>{
          if(res.data.length!=1){console.log("error:res.data.lengh!=1");return;}
          this.setData({
            targetUser:{
              name:res.data[0].name,
              type:res.data[0].type,
              avatarUrl:res.data[0].avatarUrl,
              openid:res.data[0].openid
            }
          })
        }})
        //查找自己账户
        const paymoneydb=wx.cloud.database().collection('paymoney');
        paymoneydb.where({vipUserName: this.data.userName}).get({success:res=>{
            this.setData({manageMoney: res.data.pop().money})
        }})
      }
    }})
  }
})