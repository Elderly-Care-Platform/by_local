package com.beautifulyears.repository.custom;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;

public class TopicRepositoryCustomImpl implements TopicRepositoryCustom {
	@Autowired
	private MongoTemplate mongoTemplate;

}