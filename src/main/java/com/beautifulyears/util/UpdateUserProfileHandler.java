/**
 * 
 */
package com.beautifulyears.util;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import com.beautifulyears.domain.Discuss;
import com.beautifulyears.domain.DiscussReply;
import com.beautifulyears.domain.UserProfile;

/**
 * @author Nitin
 *
 */
public class UpdateUserProfileHandler implements Runnable {
	private MongoTemplate mongoTemplate;
	private UserProfile profile;
	private static final Logger logger = Logger
			.getLogger(UpdateUserProfileHandler.class);

	public UpdateUserProfileHandler(MongoTemplate mongoTemplate) {
		this.mongoTemplate = mongoTemplate;
	}
	
	public void setProfile(UserProfile profile){
		this.profile = profile;
	}

	@Override
	public void run() {
		String userId = profile.getUserId();
		Query q = new Query();
		q.addCriteria(Criteria.where("userId").is(userId));
		List<Discuss> discussList = mongoTemplate.find(q,Discuss.class);
		for (Discuss discuss : discussList) {
			Query query = new Query();
			query.addCriteria(Criteria.where("userId").is(discuss.getUserId()));
			UserProfile profile = mongoTemplate.findOne(query,
					UserProfile.class);
			
			if (null != profile) {
				discuss.setUserProfile(profile);
			}
			mongoTemplate.save(discuss);
		}

		List<DiscussReply> replyList = mongoTemplate
				.find(q,DiscussReply.class);
		for (DiscussReply reply : replyList) {
			Query query = new Query();
			query.addCriteria(Criteria.where("userId").is(reply.getUserId()));
			UserProfile profile = mongoTemplate.findOne(query,
					UserProfile.class);
			if (null != profile) {
				reply.setUserProfile(profile);
			}
			mongoTemplate.save(reply);
		}
		
		logger.debug("updated all the replies and discuss for userId = "+userId);
	}

}