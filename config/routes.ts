export default [
	{
	  path: '/user',
	  layout: false,
	  routes: [
		{
		  path: '/user/login',
		  layout: false,
		  name: 'login',
		  component: './user/Login',
		},
		{
		  path: '/user',
		  redirect: '/user/login',
		},
	  ],
	},
  
	{
	  path: '/dashboard',
	  name: 'Dashboard',
	  icon: 'HomeOutlined',
	  component: './TrangChu',
	},
  
	{
	  path: '/manage',
	  name: 'Quản lý hệ thống',
	  icon: 'SettingOutlined',
	  routes: [
		{
		  path: '/manage/applications',
		  name: 'Đơn đăng ký',
		  icon: 'ProfileOutlined',
		  component: './UngVien/ApplicationManager',
		},
		{
		  path: '/manage/register',
		  name: 'Đăng ký ứng viên',
		  icon: 'FormOutlined',
		  component: './UngVien/RegisterForm',
		},
		{
		  path: '/manage/members',
		  name: 'Thành viên',
		  icon: 'TeamOutlined',
		  component: './ThanhVien/MemberManager',
		},
		{
		  path: '/manage/report',
		  name: 'Báo cáo thống kê',
		  icon: 'BarChartOutlined',
		  component: './ThongKe/ReportDashboard',
		},
	  ],
	},
  
	{
	  path: '/tools',
	  name: 'Tiện ích',
	  icon: 'AppstoreOutlined',
	  routes: [
		{
		  path: '/tools/random-user',
		  name: 'RandomUser',
		  icon: 'UserOutlined',
		  component: './RandomUser',
		},
		{
		  path: '/tools/todo-list',
		  name: 'TodoList',
		  icon: 'OrderedListOutlined',
		  component: './TodoList',
		},
	  ],
	},
  
	{
	  path: '/notification',
	  layout: false,
	  hideInMenu: true,
	  routes: [
		{
		  path: '/notification/subscribe',
		  exact: true,
		  component: './ThongBao/Subscribe',
		},
		{
		  path: '/notification/check',
		  exact: true,
		  component: './ThongBao/Check',
		},
		{
		  path: '/notification',
		  exact: true,
		  component: './ThongBao/NotifOneSignal',
		},
	  ],
	},
  
	{
	  path: '/403',
	  component: './exception/403/403Page',
	  layout: false,
	},
	{
	  path: '/hold-on',
	  component: './exception/DangCapNhat',
	  layout: false,
	},
	{
	  path: '/',
	  redirect: '/dashboard',
	},
	{
	  component: './exception/404',
	},
  ];
  