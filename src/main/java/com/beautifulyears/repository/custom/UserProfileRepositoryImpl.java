package com.beautifulyears.repository.custom;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import com.beautifulyears.constants.UserTypes;
import com.beautifulyears.domain.UserProfile;
import com.beautifulyears.util.LoggerUtil;

public class UserProfileRepositoryImpl implements UserProfileRepositoryCustom {
	@Autowired
	private MongoTemplate mongoTemplate;
	private Logger logger = Logger
			.getLogger(UserProfileRepositoryImpl.class);

	@Override
	public List<UserProfile> findByCustomQuery(String city, String services, int page, int size){
		List<UserProfile> userProfilePage = null;
		LoggerUtil.logEntry();
		Query q = new Query();
		q.with(new PageRequest(page,size));
		q.addCriteria(Criteria.where("BasicProfileInfo.UserAddress.city").is(city).and((String) "ServiceProviderInfo.services").in(new Object[] {services}));
		userProfilePage = mongoTemplate.find(q,UserProfile.class);
		for (UserProfile userProfile: userProfilePage)
		{
			logger.debug(userProfile.toString());
			
		}
		
		
		return userProfilePage;
		
	}
	
	@Override
	public List<UserProfile> findServiceProviders(int page, int size) {
		
		List<UserProfile> userProfilePage = null;
	
		LoggerUtil.logEntry();
		Query q = new Query();
		q.with(new PageRequest(page,size));
		q.addCriteria(Criteria.where("userTypes").in(new Object[]{UserTypes.INDIVIDUAL_PROFESSIONAL, UserTypes.INSTITUTION_HOUSING, UserTypes.INSTITUTION_SERVICES}));//where("userTypes").in(userType));
		logger.debug("added is");
		userProfilePage = mongoTemplate.find(q,UserProfile.class);
		for (UserProfile userProfile: userProfilePage)
		{
			logger.debug(userProfile.toString());
			
		}
		
		
		
		return userProfilePage;
	}

}