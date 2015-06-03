package com.beautifulyears.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.beautifulyears.domain.UserProfile;
import com.beautifulyears.repository.custom.UserProfileRepositoryCustom;

@Repository
public interface UserProfileRepository extends
		MongoRepository<UserProfile, String>, UserProfileRepositoryCustom {

	public List<UserProfile> findAll();
}
