/**
 * 
 */
package com.beautifulyears.repository;

import java.io.Serializable;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.beautifulyears.domain.UserRating;

/**
 * @author Nitin
 *
 */
@Repository
public interface UserRatingRepository extends MongoRepository<UserRating, Serializable>{
	
}
