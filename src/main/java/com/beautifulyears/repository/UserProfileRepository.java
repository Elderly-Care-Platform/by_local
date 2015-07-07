package com.beautifulyears.repository;


import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import com.beautifulyears.domain.UserProfile;
import com.beautifulyears.repository.custom.UserProfileRepositoryCustom;

@Repository
public interface UserProfileRepository extends PagingAndSortingRepository<UserProfile, String>,UserProfileRepositoryCustom{

	Page<UserProfile> findByBasicProfileInfoUserAddressCity(String city, Pageable pageable);
	UserProfile findByUserId(String UserId);
	
	
	
}