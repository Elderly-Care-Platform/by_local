package com.beautifulyears.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.beautifulyears.domain.DiscussUserLikes;
import com.beautifulyears.domain.User;
import com.beautifulyears.repository.custom.DiscussUserLikesRepositoryCustom;
import com.beautifulyears.repository.custom.UserRepositoryCustom;

@Repository
public interface DiscussUserLikesRepository extends MongoRepository<DiscussUserLikes, String>, DiscussUserLikesRepositoryCustom {

	public List<DiscussUserLikes> findAll();
}
