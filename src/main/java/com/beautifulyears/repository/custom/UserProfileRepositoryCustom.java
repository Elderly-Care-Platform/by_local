package com.beautifulyears.repository.custom;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.domain.Pageable;

import com.beautifulyears.domain.UserProfile;
import com.beautifulyears.rest.response.PageImpl;

public interface UserProfileRepositoryCustom {
	
	public PageImpl<UserProfile> getServiceProvidersByFilterCriteria(Object[] userTypes, String city, List<ObjectId> tagIds,Boolean isFeatured, Pageable page,List<String> fields);
	public PageImpl<UserProfile> findAllUserProfiles(Pageable pageable);
	public UserProfile findByUserId(String userId);
}