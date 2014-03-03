/**
 * 
 */
package com.midas.stso.trade.dao;

import com.midas.stso.trade.po.Trade;

/**
 * @author yhh
 *
 */
public interface ITradeDAO {
	/**
	 * 买股票
	 * @param trade
	 * @return 是否购买成功
	 */
	public boolean buyStock(Trade trade);
	/**
	 *卖股票 
	 * @param trade
	 * @return 是否出售成功
	 */
	public boolean sellStock(Trade trade);
	/**
	 * 查询交易信息
	 * @param trade
	 * @return
	 */
	public Trade searchStock(Trade trade);

}
