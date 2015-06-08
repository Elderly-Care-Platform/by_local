package com.beautifulyears.repository.custom;

import com.beautifulyears.domain.DiscussUserLikes;

public interface DiscussUserLikesRepositoryCustom {

	public DiscussUserLikes getByUserIdAndDiscussId(String userId,
			String discussId);
}
