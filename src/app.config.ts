export default defineAppConfig({
  pages: [
    'pages/discover/index',
    'pages/match/index',
    'pages/publish/index',
    'pages/message/index',
    'pages/mine/index',
    'pages/project-detail/index',
    'pages/profile/index',
    'pages/collaboration/index',
    'pages/edit-profile/index',
    'pages/filter/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#ff7d00',
    navigationBarTitleText: '副业合伙人',
    navigationBarTextStyle: 'white',
    backgroundColor: '#fff7f0'
  },
  tabBar: {
    color: '#86909c',
    selectedColor: '#ff7d00',
    backgroundColor: '#ffffff',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/discover/index',
        text: '发现'
      },
      {
        pagePath: 'pages/match/index',
        text: '匹配'
      },
      {
        pagePath: 'pages/publish/index',
        text: '发布'
      },
      {
        pagePath: 'pages/message/index',
        text: '消息'
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的'
      }
    ]
  }
})
