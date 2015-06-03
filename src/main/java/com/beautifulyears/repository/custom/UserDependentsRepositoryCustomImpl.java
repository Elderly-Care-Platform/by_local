package com.beautifulyears.repository.custom;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import com.beautifulyears.domain.UserDependents;

public class UserDependentsRepositoryCustomImpl implements UserDependentsRepositoryCustom {
	@Autowired
	private MongoTemplate mongoTemplate;

	@Override
	public UserDependents getById(String id) throws Exception {
		System.out.println("Inside getById user impl");
		Criteria criteria = Criteria.where("id").is(id);// .andOperator(Criteria.where("availability").is(1));
		return mongoTemplate.findOne(Query.query(criteria), UserDependents.class);

	}
	
	@Override
	public List<UserDependents> getByUserId(String id) throws Exception {
		System.out.println("Inside getByUserId user impl");
		Criteria criteria = Criteria.where("userId").is(id);// .andOperator(Criteria.where("availability").is(1));
		return mongoTemplate.find(Query.query(criteria), UserDependents.class);

	}

	@Override
	public UserDependents getByUserIdAndDependentId(String userId,
			String dependentId) throws Exception {
		Criteria criteria = Criteria.where("userId").is(userId).andOperator(Criteria.where("id").is(dependentId));
		return mongoTemplate.findOne(Query.query(criteria), UserDependents.class);
	}
}