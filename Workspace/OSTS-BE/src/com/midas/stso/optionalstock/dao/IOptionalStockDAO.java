/**
 * 
 */
package com.midas.stso.optionalstock.dao;

import com.midas.stso.optionalstock.po.OptionalStock;

/**
 * @author yhh
 *
 */
public interface IOptionalStockDAO {
	/**
	 * 新增自选股
	 * @param optionalStock
	 * @return 是否添加成功
	 */
	public boolean insertOpS(OptionalStock optionalStock);
	/**
	 * 删除自选股
	 * @param optionalStock
	 * @return 是否删除成功
	 */
	public boolean deleteOps(OptionalStock optionalStock);
	/**
	 * 查询自选股
	 * @param optionalStock
	 * @return 返回自选股信息
	 */
	public OptionalStock searchOps(OptionalStock optionalStock);

}
