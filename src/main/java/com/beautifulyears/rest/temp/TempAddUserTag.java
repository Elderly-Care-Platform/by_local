package com.beautifulyears.rest.temp;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.beautifulyears.constants.UserTypes;
import com.beautifulyears.domain.User;
import com.beautifulyears.domain.UserProfile;

//import com.beautifulyears.domain.UserProfile;

@Controller
@RequestMapping("/addUserTags")
public class TempAddUserTag {

	private final String INDIVIDUAL_TAG_ID = "56c19617e4b07a2da70292cf";
	private final String SP_TAG_ID = "56c189c6e4b07a2da70292ce";
	private MongoTemplate mongoTemplate;

	@Autowired
	public TempAddUserTag(MongoTemplate mongoTemplate) {
		this.mongoTemplate = mongoTemplate;
	}

	@RequestMapping(method = RequestMethod.GET, value = "", produces = MediaType.APPLICATION_JSON_VALUE)
	public @ResponseBody Object changePassword(HttpServletRequest req,
			HttpServletResponse res) throws Exception {
		List<User> users = mongoTemplate.findAll(User.class);
		for (Iterator iterator = users.iterator(); iterator.hasNext();) {
			User user = (User) iterator.next();
			Query q = new Query();
			q.addCriteria(Criteria.where("userId").is(user.getId()));
			UserProfile profile = mongoTemplate.findOne(q, UserProfile.class);
			if (null != profile && null != profile.getUserTypes()) {
				if (profile.getUserTypes().contains(
						UserTypes.INDIVIDUAL_PROFESSIONAL)
						|| profile.getUserTypes().contains(
								UserTypes.INSTITUTION_BRANCH)
						|| profile.getUserTypes().contains(
								UserTypes.INSTITUTION_HOUSING)
						|| profile.getUserTypes().contains(
								UserTypes.INSTITUTION_NGO)
						|| profile.getUserTypes().contains(
								UserTypes.INSTITUTION_PRODUCTS)
						|| profile.getUserTypes().contains(
								UserTypes.INSTITUTION_SERVICES)) {
					if (!user.getUserTags().contains(SP_TAG_ID)) {
						user.getUserTags().remove(INDIVIDUAL_TAG_ID);
						user.getUserTags().add(SP_TAG_ID);
						System.out.println("pprofessional");
						mongoTemplate.save(user);
					}
				} else if (profile.getUserTypes().contains(
						UserTypes.INDIVIDUAL_CAREGIVER)
						|| profile.getUserTypes().contains(
								UserTypes.INDIVIDUAL_ELDER)
						|| profile.getUserTypes().contains(
								UserTypes.INDIVIDUAL_VOLUNTEER)) {
					if (!user.getUserTags().contains(INDIVIDUAL_TAG_ID)) {
						user.getUserTags().remove(SP_TAG_ID);
						user.getUserTags().add(INDIVIDUAL_TAG_ID);
						System.out.println("user");
						mongoTemplate.save(user);
					}
				}else {
					user.setUserTags(new ArrayList<String>());
					mongoTemplate.save(user);
				}
			}
		}

		return null;
	}

}