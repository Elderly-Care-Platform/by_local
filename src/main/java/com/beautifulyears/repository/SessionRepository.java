package com.beautifulyears.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.beautifulyears.domain.Session;

@Repository
public interface SessionRepository extends MongoRepository<Session, String> {

	public List<Session> findAll();

}
