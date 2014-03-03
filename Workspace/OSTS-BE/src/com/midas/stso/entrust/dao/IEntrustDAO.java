/**
 * 
 */
package com.midas.stso.entrust.dao;

import com.midas.stso.entrust.po.Entrust;

/**
 * @author yhh
 *
 */
public interface IEntrustDAO {
	/**
	 * 委托购买股票
	 * @param entrust
	 * @return 是否成功委托
	 */
	public boolean  ebuyStock(Entrust entrust);
	/**
	 * 委托卖出股票
	 * @param entrust
	 * @return 是否成功委托
	 */
	public boolean  esellStock(Entrust entrust);
	/**
	 * 委托信息查询
	 * @param entrust
	 * @return 委托交易信息
	 */
	public boolean  esearchStock(Entrust entrust);
	/**
	 * 隔夜挂单买股
	 * @param entrust
	 * @return 是否挂单成功
	 */
	public boolean  edaybuyStock(Entrust entrust);
	/**
	 * 隔夜挂单卖股
	 * @param entrust
	 * @return 是否挂单成功
	 */
	public boolean  edaysellStock(Entrust entrust);
	

}
