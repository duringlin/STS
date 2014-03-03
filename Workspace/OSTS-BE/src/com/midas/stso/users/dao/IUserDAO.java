/**
 * 
 */
package com.midas.stso.users.dao;

import com.midas.stso.users.po.Users;

/**
 * @author yhh
 *
 */
public interface IUserDAO {
	/**
	 * 用户登录
	 * @param users
	 * @return 登录用户信息
	 */
	public Users checkLogin(Users users);
	/**
	 * 用户注册
	 * @param users
	 * @return 是否注册成功
	 */
	public boolean Regist(Users users);
	/**
	 * 用户账户查询
	 * @param users
	 * @return 用户信息
	 */
	public Users searchUser(Users users);
	/**
	 * 用户密码修改
	 * @param users
	 * @return 是否修改成功
	 */
	public boolean updatePwd(Users users);
	/**
	 * 用户信息修改		
	 * @param users
	 * @return 是否修改成功
	 */
	public boolean updateUser(Users users);
}
