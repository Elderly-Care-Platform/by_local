package com.beautifulyears.repository.custom;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import com.beautifulyears.domain.UserProfile;

public class UserProfileRepositoryCustomImpl implements UserProfileRepositoryCustom {
	@Autowired
	private MongoTemplate mongoTemplate;

	@Override
	public UserProfile getById(String id) throws Exception {
		System.out.println("Inside getById user impl");
		Criteria criteria = Criteria.where("id").is(id);// .andOperator(Criteria.where("availability").is(1));
		return mongoTemplate.findOne(Query.query(criteria), UserProfile.class);

	}
	
	@Override
	public UserProfile getByUserId(String id) throws Exception {
		System.out.println("Inside getByUserId user impl");
		Criteria criteria = Criteria.where("userId").is(id);// .andOperator(Criteria.where("availability").is(1));
		return mongoTemplate.findOne(Query.query(criteria), UserProfile.class);

	}
}