package com.beautifulyears.repository.custom;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import com.beautifulyears.domain.DiscussUserLikes;

public class DiscussUserLikesRepositoryCustomImpl implements
		DiscussUserLikesRepositoryCustom {
	@Autowired
	private MongoTemplate mongoTemplate;

	@Override
	public DiscussUserLikes getByUserIdAndDiscussId(String userId,
			String discussId) {
		System.out
				.println("Inside getByUserIdAndDiscussId discuss user likes impl");
		Criteria criteria = Criteria.where("userId").is(userId)
				.and("discussId").is(discussId);
		return mongoTemplate.findOne(Query.query(criteria),
				DiscussUserLikes.class);

	}

}