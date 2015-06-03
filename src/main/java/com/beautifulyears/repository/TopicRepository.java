package com.beautifulyears.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.beautifulyears.domain.Topic;
import com.beautifulyears.repository.custom.TopicRepositoryCustom;

@Repository
public interface TopicRepository extends MongoRepository<Topic, String>,
		TopicRepositoryCustom {

	public List<Topic> findAll();

}
