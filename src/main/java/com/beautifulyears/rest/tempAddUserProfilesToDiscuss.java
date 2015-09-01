/**
 * 
 */
package com.beautifulyears.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.beautifulyears.domain.Discuss;
import com.beautifulyears.domain.DiscussReply;
import com.beautifulyears.domain.UserProfile;
import com.beautifulyears.rest.response.BYGenericResponseHandler;

/**
 * @author Nitin
 *
 */
@Controller
@RequestMapping(value = { "/addUserProfilesToDiscuss" })
public class tempAddUserProfilesToDiscuss {

	private MongoTemplate mongoTemplate;

	@Autowired
	public tempAddUserProfilesToDiscuss(MongoTemplate mongoTemplate) {
		this.mongoTemplate = mongoTemplate;
	}

	@RequestMapping(method = { RequestMethod.GET }, value = { "/" }, produces = { "application/json" })
	@ResponseBody
	public Object addProfile() throws Exception {
		List<Discuss> discussList = mongoTemplate.findAll(Discuss.class);
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
				.findAll(DiscussReply.class);
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

		return BYGenericResponseHandler.getResponse(null);
	}
}
