package com.beautifulyears.repository.custom;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import com.beautifulyears.DiscussConstants;
import com.beautifulyears.domain.Discuss;

public class DiscussRepositoryImpl implements DiscussRepositoryCustom {
	@Autowired
	private MongoTemplate mongoTemplate;
	private final Set<String> filterKeys = new HashSet<String>(
			Arrays.asList(new String[] { "discussType", "topicId", "subTopicId" }));

	@Override
	public List<Discuss> findByDiscussType(String discussType) {
		Criteria criteria = Criteria.where("discussType").is(discussType);// .andOperator(Criteria.where("availability").is(1));
		return null;// mongoTemplate.find(Query.query(criteria), Discuss.class);

	}

	@Override
	public Long getSize(String discussType, String topicId, String subTopicId) {
		// TODO Auto-generated method stub
		Query q = new Query();
		q.addCriteria(Criteria.where("status").in(
				new Object[] { DiscussConstants.DISCUSS_STATUS_ACTIVE, null }));
		q = getQuery(q, discussType, topicId, subTopicId);
		return this.mongoTemplate.count(q, Discuss.class);
	}

	@Override
	public List<Discuss> find(String discussType, String topicId,
			String subTopicId) {
		Query q = new Query();
		q = getQuery(q, discussType, topicId, subTopicId);
		return new ArrayList<Discuss>();// this.mongoTemplate.find(q,
										// Discuss.class);
	}

	private Query getQuery(Query q, String discussType, String topicId,
			String subTopicId) {

		if (null != discussType && !discussType.equalsIgnoreCase("All")
				&& !discussType.equalsIgnoreCase("list")) {
			q.addCriteria(Criteria.where("discussType")
					.is((Object) discussType));
		} else {
			q.addCriteria(Criteria.where((String) "discussType").in(
					new Object[] { "A", "Q", "P" }));
		}
		if (null != subTopicId && !subTopicId.equalsIgnoreCase("All")
				&& !subTopicId.equalsIgnoreCase("list")) {
			q.addCriteria(Criteria.where("topicId").in(
					new Object[] { subTopicId }));
		} else if (null != topicId && !topicId.equalsIgnoreCase("All")
				&& !topicId.equalsIgnoreCase("list")) {
			q.addCriteria(Criteria.where("topicId")
					.in(new Object[] { topicId }));
		}

		return q;
	}

	@Override
	public List<Discuss> findPublished(Map<String, Object> filters,
			List<String> sortArray, int count) {
		Query q = new Query();

		if (null != filters) {
			q = getQuery(q, (String) filters.get("discussType"),
					(String) filters.get("topicId"),
					(String) filters.get("subTopicId"));
			filters.keySet().removeAll(filterKeys);
			for (Map.Entry<String, Object> filter : filters.entrySet()) {
				if (null != filter.getValue()
						&& filter.getKey() != "discussType"
						&& filter.getKey() != "topicId"
						&& filter.getKey() != "subTopicId") {
					q.addCriteria(Criteria.where(filter.getKey()).is(
							filter.getValue()));
				}
			}
		}

		if (null != sortArray) {
			for (String sort : sortArray) {
				q.with(new Sort(Sort.Direction.DESC, new String[] { sort }));
			}
		}
		q.addCriteria(Criteria.where("status").in(
				new Object[] { DiscussConstants.DISCUSS_STATUS_ACTIVE, null }));
		if (0 != count) {
			q.limit(count);
		}
		// List<Discuss> list = new ArrayList<Discuss>();
		List<Discuss> list = this.mongoTemplate.find(q, Discuss.class);
		return list;
	}

}