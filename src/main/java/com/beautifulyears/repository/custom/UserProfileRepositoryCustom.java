package com.beautifulyears.repository.custom;

import java.util.List;

import com.beautifulyears.domain.UserProfile;

public interface UserProfileRepositoryCustom {
	
	List<UserProfile> findByCustomQuery(String city, String services, int page, int size);
	List<UserProfile> findServiceProviders(int page, int size);
}