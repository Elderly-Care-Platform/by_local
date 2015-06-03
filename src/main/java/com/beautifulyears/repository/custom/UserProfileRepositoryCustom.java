package com.beautifulyears.repository.custom;

import com.beautifulyears.domain.UserProfile;

public interface UserProfileRepositoryCustom {

	public UserProfile getById(String id) throws Exception;

	public UserProfile getByUserId(String userId) throws Exception;
}
