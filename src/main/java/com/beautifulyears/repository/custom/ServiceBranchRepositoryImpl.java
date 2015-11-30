/**
 * 
 */
package com.beautifulyears.repository.custom;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import com.beautifulyears.constants.DiscussConstants;
import com.beautifulyears.domain.ServiceBranch;
import com.beautifulyears.rest.response.PageImpl;

/**
 * @author Nitin
 *
 */
public class ServiceBranchRepositoryImpl implements ServiceBranchRepositoryCustom {
	@Autowired
	private MongoTemplate mongoTemplate;

	@Override
	public PageImpl<ServiceBranch> getPage(String city,
			List<ObjectId> tagIds, String userId, Boolean isFeatured,
			Boolean isPromotion, Pageable pageable) {
		List<ServiceBranch> services = null;

		Query query = new Query();
		query = getQuery(query, tagIds, userId, isFeatured, isPromotion);
		if(pageable == null){
			
		}else{
			query.with(pageable);
		}
		
		query.addCriteria(Criteria.where("status").is(
				DiscussConstants.DISCUSS_STATUS_ACTIVE));
		
		if (city != null) {
			Criteria criteria = new Criteria();
			criteria.orOperator(
					Criteria.where("basicBranchInfo.primaryUserAddress.city")
							.regex(city, "i"),
					Criteria.where("basicBranchInfo.otherAddresses")
							.elemMatch(Criteria.where("city").regex(city, "i")));

			query.addCriteria(criteria);
		}

		services = this.mongoTemplate.find(query, ServiceBranch.class);

		long total = this.mongoTemplate.count(query, ServiceBranch.class);
		PageImpl<ServiceBranch> servicePage = new PageImpl<ServiceBranch>(
				services, pageable, total);

		return servicePage;
	}

	private Query getQuery(Query q, List<ObjectId> tagIds, String userId,
			Boolean isFeatured, Boolean isPromotion) {

		if (null != tagIds && tagIds.size() > 0) {
			q.addCriteria(Criteria.where("systemTags.$id").in(tagIds));
		}
		if (null != isFeatured) {
			q.addCriteria(Criteria.where("isFeatured").is(isFeatured));
		}
		if (null != isPromotion) {
			q.addCriteria(Criteria.where("isPromotion").is(isPromotion));
		}
		if (null != userId) {
			q.addCriteria(Criteria.where("userId").is(userId));
		}

		return q;
	}

	@Override
	public Long getCount() {
		Query query = new Query();
		query.addCriteria(Criteria.where("status").is(
				DiscussConstants.DISCUSS_STATUS_ACTIVE));
		long total = this.mongoTemplate.count(query, ServiceBranch.class);
		return total;
	}

}
