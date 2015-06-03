package com.beautifulyears.repository.custom;

import java.util.List;

import com.beautifulyears.domain.UserDependents;

public interface UserDependentsRepositoryCustom {

	public UserDependents getById(String id) throws Exception;

	public List<UserDependents> getByUserId(String userId) throws Exception;

	public UserDependents getByUserIdAndDependentId(String userId,
			String dependentId) throws Exception;
}
