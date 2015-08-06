package com.beautifulyears.repository.custom;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import com.beautifulyears.constants.DiscussConstants;
import com.beautifulyears.domain.Discuss;
import com.beautifulyears.rest.response.PageImpl;

public class DiscussRepositoryImpl implements DiscussRepositoryCustom {
	@Autowired
	private MongoTemplate mongoTemplate;
//	private final Set<String> filterKeys = new HashSet<String>(
//			Arrays.asList(new String[] { "discussType", "topicId", "subTopicId" }));

//	@Override
//	public Long getSize(String discussType, String topicId, String subTopicId) {
//		// TODO Auto-generated method stub
//		Query q = new Query();
//		q.addCriteria(Criteria.where("status").in(
//				new Object[] { DiscussConstants.DISCUSS_STATUS_ACTIVE, null }));
//		// q = getQuery(q, discussType, topicId, subTopicId);
//		return this.mongoTemplate.count(q, Discuss.class);
//	}

	// @Override
	// public List<Discuss> find(String discussType, String topicId,
	// String subTopicId) {
	// Query q = new Query();
	// q = getQuery(q, discussType, topicId, subTopicId);
	// return new ArrayList<Discuss>();// this.mongoTemplate.find(q,
	// // Discuss.class);
	// }

	// private Query getQuery(Query q, String discussType, String topicId,
	// String subTopicId) {
	//
	// if (null != discussType && !discussType.equalsIgnoreCase("All")
	// && !discussType.equalsIgnoreCase("list")) {
	// q.addCriteria(Criteria.where("discussType")
	// .is((Object) discussType));
	// } else {
	// q.addCriteria(Criteria.where((String) "discussType").in(
	// new Object[] { "A", "Q", "P" }));
	// }
	// if (null != subTopicId && !subTopicId.equalsIgnoreCase("All")
	// && !subTopicId.equalsIgnoreCase("list")) {
	// q.addCriteria(Criteria.where("topicId").in(
	// new Object[] { subTopicId }));
	// } else if (null != topicId && !topicId.equalsIgnoreCase("All")
	// && !topicId.equalsIgnoreCase("list")) {
	// q.addCriteria(Criteria.where("topicId")
	// .in(new Object[] { topicId }));
	// }
	//
	// return q;
	// }

	// @Override
	// public List<Discuss> findPublished(Map<String, Object> filters,
	// List<String> sortArray, int count) {
	// Query q = new Query();
	//
	// if (null != filters) {
	// q = getQuery(q, (String) filters.get("discussType"),
	// (String) filters.get("topicId"),
	// (String) filters.get("subTopicId"));
	// filters.keySet().removeAll(filterKeys);
	// for (Map.Entry<String, Object> filter : filters.entrySet()) {
	// if (null != filter.getValue()
	// && filter.getKey() != "discussType"
	// && filter.getKey() != "topicId"
	// && filter.getKey() != "subTopicId") {
	// q.addCriteria(Criteria.where(filter.getKey()).is(
	// filter.getValue()));
	// }
	// }
	// }
	//
	// if (null != sortArray) {
	// for (String sort : sortArray) {
	// q.with(new Sort(Sort.Direction.DESC, new String[] { sort }));
	// }
	// }
	// q.addCriteria(Criteria.where("status").in(
	// new Object[] { DiscussConstants.DISCUSS_STATUS_ACTIVE, null }));
	// if (0 != count) {
	// q.limit(count);
	// }
	// // List<Discuss> list = new ArrayList<Discuss>();
	// List<Discuss> list = this.mongoTemplate.find(q, Discuss.class);
	// return list;
	// }

	@Override
	public PageImpl<Discuss> getPage(List<String> discussTypeArray,
			List<ObjectId> tagIds, String userId, Boolean isFeatured,
			Pageable pageable) {
		List<Discuss> stories = null;

		Query query = new Query();
		query = getQuery(query, discussTypeArray, tagIds, userId, isFeatured);
		query.with(pageable);
		query.addCriteria(Criteria.where("status").is(DiscussConstants.DISCUSS_STATUS_ACTIVE));

		stories = this.mongoTemplate.find(query, Discuss.class);

		long total = this.mongoTemplate.count(query, Discuss.class);
		PageImpl<Discuss> storyPage = new PageImpl<Discuss>(stories, pageable,
				total);

		return storyPage;
	}

	private Query getQuery(Query q, List<String> discussTypeArray,
			List<ObjectId> tagIds, String userId, Boolean isFeatured) {

		if (discussTypeArray != null && discussTypeArray.size() > 0) {
			q.addCriteria(Criteria.where((String) "discussType").in(
					discussTypeArray));
		}
		if (null != tagIds && tagIds.size() > 0) {
			q.addCriteria(Criteria.where("systemTags.$id").in(tagIds));
		}
		if (null != isFeatured) {
			q.addCriteria(Criteria.where("isFeatured").is(isFeatured));
		}
		if (null != userId) {
			q.addCriteria(Criteria.where("userId").is(userId));
		}

		return q;
	}

	@Override
	public long getCount(List<String> discussTypeArray, List<ObjectId> tagIds,
			String userId, Boolean isFeatured) {
		long count = 0;
		Query query = new Query();
		query = getQuery(query, discussTypeArray, tagIds, userId, isFeatured);
		query.addCriteria(Criteria.where("status").is(DiscussConstants.DISCUSS_STATUS_ACTIVE));
		count = this.mongoTemplate.count(query, Discuss.class);
		
		return count;
	}

}