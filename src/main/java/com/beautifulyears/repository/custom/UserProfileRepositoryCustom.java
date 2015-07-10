package com.beautifulyears.repository.custom;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.beautifulyears.domain.UserProfile;

public interface UserProfileRepositoryCustom {
	
	List<UserProfile> findByCustomQuery(String city, String services, int page, int size);
	List<UserProfile> findServiceProviders(int page, int size);
}