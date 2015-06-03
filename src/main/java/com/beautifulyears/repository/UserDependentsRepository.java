package com.beautifulyears.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.beautifulyears.domain.UserDependents;
import com.beautifulyears.repository.custom.UserDependentsRepositoryCustom;

@Repository
public interface UserDependentsRepository extends
		MongoRepository<UserDependents, String>, UserDependentsRepositoryCustom {

	public List<UserDependents> findAll();
}
