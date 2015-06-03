package com.beautifulyears.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.beautifulyears.domain.SubTopic;
import com.beautifulyears.repository.custom.SubTopicRepositoryCustom;

@Repository
public interface SubTopicRepository extends MongoRepository<SubTopic, String>,
		SubTopicRepositoryCustom {

	public List<SubTopic> findAll();

}
