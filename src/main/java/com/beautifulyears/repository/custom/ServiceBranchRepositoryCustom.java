/**
 * 
 */
package com.beautifulyears.repository.custom;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.domain.Pageable;

import com.beautifulyears.domain.ServiceBranch;
import com.beautifulyears.rest.response.PageImpl;

/**
 * @author Nitin
 *
 */
public interface ServiceBranchRepositoryCustom {
	public PageImpl<ServiceBranch> getPage(String city, List<ObjectId> tagIds, String userId,
			Boolean isFeatured, Boolean isPromotion, Pageable pageable);
	
	public Long getCount();
}
