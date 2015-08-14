package com.beautifulyears.repository.custom;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

<<<<<<< HEAD
=======
import com.beautifulyears.constants.DiscussConstants;
>>>>>>> remotes/origin/profileChanges
import com.beautifulyears.domain.UserProfile;
import com.beautifulyears.rest.response.PageImpl;

public class UserProfileRepositoryImpl implements UserProfileRepositoryCustom {
	@Autowired
	private MongoTemplate mongoTemplate;

	@Override
	public PageImpl<UserProfile> getServiceProvidersByFilterCriteria(
			Object[] userTypes, String city, List<ObjectId> tagIds,
<<<<<<< HEAD
			Pageable page) {
		List<UserProfile> userProfileList = null;
		Query q = new Query();
=======
			Boolean isFeatured, Pageable page) {
		List<UserProfile> userProfileList = null;
		Query q = new Query();
		q.addCriteria(Criteria.where("status").in(
				new Object[] { DiscussConstants.DISCUSS_STATUS_ACTIVE, null }));
		if (null != isFeatured) {
			q.addCriteria(Criteria.where("isFeatured").is(isFeatured));
		}

>>>>>>> remotes/origin/profileChanges
		if (null != tagIds && tagIds.size() > 0) {
			q.addCriteria(Criteria.where("systemTags.$id").in(tagIds));
		}
		if (city != null) {
			Criteria criteria = new Criteria();
<<<<<<< HEAD
	        criteria.orOperator(Criteria
					.where("basicProfileInfo.primaryUserAddress.city")
					.regex(city ,"i"),Criteria.where("basicProfileInfo.otherAddresses")
					.elemMatch(Criteria.where("city").regex(city ,"i")));
			
=======
			criteria.orOperator(
					Criteria.where("basicProfileInfo.primaryUserAddress.city")
							.regex(city, "i"),
					Criteria.where("basicProfileInfo.otherAddresses")
							.elemMatch(Criteria.where("city").regex(city, "i")));

>>>>>>> remotes/origin/profileChanges
			q.addCriteria(criteria);
		}
		q.with(page);
		userProfileList = mongoTemplate.find(q, UserProfile.class);
<<<<<<< HEAD
		
		long total = this.mongoTemplate.count(q, UserProfile.class);
		PageImpl<UserProfile> userProfilePage = new PageImpl<UserProfile>(userProfileList, page,
				total);
=======

		long total = this.mongoTemplate.count(q, UserProfile.class);
		PageImpl<UserProfile> userProfilePage = new PageImpl<UserProfile>(
				userProfileList, page, total);
>>>>>>> remotes/origin/profileChanges

		return userProfilePage;
	}

	@Override
	public PageImpl<UserProfile> findAllUserProfiles(Pageable pageable) {
<<<<<<< HEAD
		 List<UserProfile> userProfileList = mongoTemplate.findAll(UserProfile.class);
		 long total = userProfileList.size();
		 PageImpl<UserProfile> userProfilePage = new PageImpl<UserProfile>(userProfileList, pageable,
					total);
=======
		Query q = new Query();
		q.addCriteria(Criteria.where("status").in(
				new Object[] { DiscussConstants.DISCUSS_STATUS_ACTIVE, null }));
		List<UserProfile> userProfileList = mongoTemplate.find(q,
				UserProfile.class);
		long total = userProfileList.size();
		PageImpl<UserProfile> userProfilePage = new PageImpl<UserProfile>(
				userProfileList, pageable, total);
>>>>>>> remotes/origin/profileChanges
		return userProfilePage;
	}

}