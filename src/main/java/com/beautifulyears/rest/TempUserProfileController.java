package com.beautifulyears.rest;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.springframework.data.mongodb.core.aggregation.Aggregation.*;
import static org.springframework.data.mongodb.core.query.Criteria.*;

import javax.mail.internet.ContentType;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.bson.types.ObjectId;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.beautifulyears.constants.ActivityLogConstants;
import com.beautifulyears.constants.BYConstants;
import com.beautifulyears.constants.DiscussConstants;
import com.beautifulyears.constants.UserTypes;
import com.beautifulyears.domain.DiscussReply;
import com.beautifulyears.domain.User;
import com.beautifulyears.domain.UserAddress;
import com.beautifulyears.domain.UserProfile;
import com.beautifulyears.domain.UserRating;
import com.beautifulyears.exceptions.BYErrorCodes;
import com.beautifulyears.exceptions.BYException;
import com.beautifulyears.repository.UserProfileRepository;
import com.beautifulyears.rest.response.BYGenericResponseHandler;
import com.beautifulyears.rest.response.UserProfileResponse;
import com.beautifulyears.rest.response.UserProfileResponse.UserProfilePage;
import com.beautifulyears.util.LoggerUtil;
import com.beautifulyears.util.UpdateUserProfileHandler;
import com.beautifulyears.util.UserProfilePrivacyHandler;
import com.beautifulyears.util.Util;
import com.beautifulyears.util.activityLogHandler.ActivityLogHandler;
import com.beautifulyears.util.activityLogHandler.UserProfileLogHandler;

/**
 * The REST based service for managing "user_profile"
 * 
 * @author jharana
 *
 */
@Controller
@RequestMapping("/updateUserProfile")
public class TempUserProfileController {
	private static Logger logger = Logger
			.getLogger(TempUserProfileController.class);

	private UserProfileRepository userProfileRepository;
	private ActivityLogHandler<UserProfile> logHandler;
	private MongoTemplate mongoTemplate;

	@Autowired
	public TempUserProfileController(UserProfileRepository userProfileRepository,
			MongoTemplate mongoTemplate) {
		this.userProfileRepository = userProfileRepository;
		this.mongoTemplate = mongoTemplate;
		logHandler = new UserProfileLogHandler(mongoTemplate);
	}

	@RequestMapping(method = { RequestMethod.GET }, value = { "/" }, produces = { "application/json" })
	@ResponseBody
	public Object updateUserProfiles(
			HttpServletRequest req, HttpServletResponse res) throws Exception {
		String result = "";
		Query q = new Query();
		List<Integer> userTypes = new ArrayList<Integer>();
		userTypes.add(UserTypes.INSTITUTION_SERVICES);
		q.addCriteria(Criteria.where((String) "userTypes").in(
				userTypes));
		List<UserProfile> services = mongoTemplate.find(q, UserProfile.class);
		
		for(UserProfile service : services){
			if(service.getServiceBranches().size() <= 0){
				System.out.println(service.getUserTypes());
				UserProfile branch = new UserProfile();
				branch.setAggrRatingPercentage(service.getAggrRatingPercentage());
				branch.setBasicProfileInfo(service.getBasicProfileInfo());
				branch.setFeatured(service.isFeatured());
				branch.setIndividualInfo(service.getIndividualInfo());
				branch.setLastModifiedAt(service.getLastModifiedAt());
				branch.setRatedBy(service.getRatedBy());
				branch.setRatedByUser(service.isRatedByUser());
				branch.setReviewedBy(service.getReviewedBy());
				branch.setReviewedByUser(service.isReviewedByUser());
				branch.setServiceProviderInfo(service.getServiceProviderInfo());
				branch.setStatus(service.getStatus());
				branch.setSystemTags(service.getSystemTags());
				branch.setTags(service.getTags());
				branch.setUserId(service.getUserId());
				branch.setUserTags(service.getUserTags());
				ArrayList<Integer> list = new ArrayList<Integer>();
				list.add(UserTypes.INSTITUTION_BRANCH);
				branch.setUserTypes(list);
				branch.setVerified(service.isVerified());
				mongoTemplate.save(branch);
				System.out.println("saving branch");
				service.getServiceBranches().add(branch);
				mongoTemplate.save(service);
				
				
				
				Query query = new Query();
				query.addCriteria(Criteria.where("associatedContentType")
						.is(DiscussConstants.CONTENT_TYPE_INSTITUTION_SERVICES).and("associatedId").is(service.getId()));
				List<UserRating> ratings =  this.mongoTemplate.find(query, UserRating.class);
				for(UserRating rating : ratings){
					rating.setAssociatedId(branch.getId());
					mongoTemplate.save(rating);
					System.out.println("changing rating");
				}
				
				
				
				query = new Query();
				query.addCriteria(Criteria.where("contentType")
						.is(DiscussConstants.CONTENT_TYPE_INSTITUTION_SERVICES).and("discussId").is(service.getId()));
				List<DiscussReply> reviews =  this.mongoTemplate.find(query, DiscussReply.class);
				for(DiscussReply review : reviews){
					review.setDiscussId(branch.getId());
					mongoTemplate.save(review);
					System.out.println("changing reviews");
				}
				
				result += service.getId()+", ";
				
			}else{
				System.out.println("skipping sa already contains branch");
			}
		}
		
		return result;
	}


}
