package com.beautifulyears.repository.custom;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.domain.Pageable;

import com.beautifulyears.domain.UserProfile;
import com.beautifulyears.rest.response.PageImpl;

public interface UserProfileRepositoryCustom {
	
<<<<<<< HEAD
	public PageImpl<UserProfile> getServiceProvidersByFilterCriteria(Object[] userTypes, String city, List<ObjectId> tagIds, Pageable page);
=======
	public PageImpl<UserProfile> getServiceProvidersByFilterCriteria(Object[] userTypes, String city, List<ObjectId> tagIds,Boolean isFeatured, Pageable page);
>>>>>>> remotes/origin/profileChanges
	public PageImpl<UserProfile> findAllUserProfiles(Pageable pageable);
}