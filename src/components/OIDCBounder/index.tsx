import { useAuthActions } from '@/hooks/useAuthActions';
import { getPermission, getUserInfo } from '@/services/base/api';
import { type Login } from '@/services/base/typing';
import axios from '@/utils/axios';
import { currentRole } from '@/utils/ip';
import { oidcConfig } from '@/utils/oidcConfig';
import { notification } from 'antd';
import queryString from 'query-string';
import { useEffect, type FC } from 'react';
import { AuthProvider, hasAuthParams, useAuth } from 'react-oidc-context';
import { history, useModel } from 'umi';
import LoadingPage from '../Loading';
import { unAuthPaths, unCheckPermissionPaths } from './constant';

let OIDCBounderHandlers: ReturnType<typeof useAuthActions> | null = null;

const OIDCBounder_: FC = ({ children }) => {
	const { setInitialState, initialState } = useModel('@@initialState');
	const auth = useAuth();
	const actions = useAuthActions();

	const handleAxios = (access_token: string) => {
		axios.defaults.headers.common.Authorization = `Bearer ${access_token}`;
	};

	const redirectLocation = () => {
		// Loại bỏ các Auth params
		const { code, iss, session_state, state, ...other } = queryString.parse(window.location.search);
		let newSearch = Object.keys(other)
			.map((key) => `${key}=${other[key]}`)
			.join('&');
		if (newSearch) newSearch = '?' + newSearch;
		// Reload trang để cập nhật access token mới
		const pathname =
			window.location.pathname === '/' || window.location.pathname === '/user/login'
				? '/dashboard'
				: window.location.pathname;
		window.location.replace(`${pathname}${newSearch}${window.location.hash}`);
		// window.history.replaceState({}, document.title, `${pathname}${newSearch}${window.location.hash}`);
		// window.location.reload();
	};

	const handleLogin = async () => {
		if (auth.user) {
			handleAxios(auth.user.access_token);
			try {
				const [getPermissionsResponse, getUserInfoResponse] = await Promise.all([getPermission(), getUserInfo()]);
				const userInfo: Login.IUser = getUserInfoResponse?.data;
				const permissions: Login.IPermission[] = getPermissionsResponse.data;
				const isUncheckPath = unCheckPermissionPaths.some((path) => window.location.pathname.includes(path));
				const hasRole = permissions.some((item) => item.rsname === currentRole);

				if (!isUncheckPath && currentRole && permissions.length && !hasRole) {
					history.replace('/403');
				} else {
					setInitialState({
						...initialState,
						currentUser: { ...userInfo, ssoId: userInfo.sub },
						authorizedPermissions: permissions,
						permissionLoading: false,
					});

					if (window.location.pathname === '/' || window.location.pathname === '/user/login') redirectLocation();
				}
			} catch {
				if (auth.isAuthenticated) auth.removeUser();
				else {
					notification.warn({
						message: 'Xác thực người dùng',
						description: 'Vui lòng đợi trong giây lát. Đang chuyển hướng...',
					});
					history.replace('/user/login');
				}
			}
		} else history.replace('/user/login');
	};

	useEffect(() => {
		// Nếu đang cập nhật thì bật cái này lên
		// history.replace('/hold-on');
		// return;

		if (unAuthPaths.includes(window.location.pathname) || auth.isLoading) return;

		// Chưa login + chưa có auth params ==> Cần redirect keycloak để lấy auth params + cookie
		if (!hasAuthParams() && !auth.isAuthenticated) {
			auth.signinRedirect();
			return;
		}

		// Đã login => Xoá toàn bộ auth params được sử dụng để login trước đó
		if (auth.isAuthenticated) {
			if (hasAuthParams()) redirectLocation();
			else handleLogin();
		}
	}, [auth.isAuthenticated, auth.isLoading]);

	useEffect(() => {
		if (auth.user?.access_token) handleAxios(auth.user.access_token);
	}, [auth.user?.access_token]);

	useEffect(() => {
		OIDCBounderHandlers = actions;
	}, [actions]);

	return <>{auth.isLoading ? <LoadingPage /> : children}</>;
};

export const OIDCBounder: FC & { getActions: () => typeof OIDCBounderHandlers } = (props) => {
	return (
		<AuthProvider
			{...oidcConfig}
			redirect_uri={window.location.pathname.includes('/user') ? window.location.origin : window.location.href}
		>
			<OIDCBounder_ {...props} />
		</AuthProvider>
	);
};

OIDCBounder.getActions = () => OIDCBounderHandlers;
