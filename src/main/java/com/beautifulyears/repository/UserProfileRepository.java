package com.beautifulyears.repository;


import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import com.beautifulyears.domain.UserProfile;

@Repository
public interface UserProfileRepository extends PagingAndSortingRepository<UserProfile, String>{

	
}