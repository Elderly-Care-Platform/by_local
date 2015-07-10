package com.beautifulyears.repository;


import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import com.beautifulyears.DiscussConstants;
import com.beautifulyears.domain.Discuss;
import com.beautifulyears.domain.UserProfile;
import com.beautifulyears.repository.custom.UserProfileRepositoryCustom;
import com.beautifulyears.domain.UserTypes;


@Repository
public interface UserProfileRepository extends PagingAndSortingRepository<UserProfile, String>,UserProfileRepositoryCustom{

	Page<UserProfile> findByBasicProfileInfoUserAddressCity(String city, Pageable pageable);
	UserProfile findByUserId(String UserId);
	
	 @Query("{'userTypes':{$in:?0}}" )
	 public Page<UserProfile> getServiceProvidersByCriteria(Object[] userTypes, Pageable page);
	 
	 @Query("{"
	 		+ "'$and':["
			 +"{'userTypes':{$in:?0},"
			 + "{'$or':"
				+ "[ {$where: '?1 == null'}, "
				+ "{'BasicProfileInfo.UserAddress.city':?1} "
				+ "]"
		+ "},"
		+ "{'$or':"
		+ "[ {$where: '?2 == null'}, "
		+ "{'ServiceProviderInfo.services': {$in:?2}} "
		+ "] "
+ "}"
			 +"]"
					+ "}")
	 public Page<UserProfile> getServiceProvidersByFilterCriteria(Object[] userTypes, String city, List<String> services, Pageable page);
	 
	 
	    
	
	
	
}