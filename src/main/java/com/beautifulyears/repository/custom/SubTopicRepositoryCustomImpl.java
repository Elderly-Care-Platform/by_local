package com.beautifulyears.repository.custom;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;

public class SubTopicRepositoryCustomImpl implements SubTopicRepositoryCustom {
	@Autowired
	private MongoTemplate mongoTemplate;

}