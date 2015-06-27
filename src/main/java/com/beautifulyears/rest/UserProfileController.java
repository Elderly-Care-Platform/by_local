package com.beautifulyears.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.beautifulyears.domain.UserProfile;
import com.beautifulyears.repository.UserProfileRepository;
import com.beautifulyears.repository.custom.UserProfileRepositoryCustom;

/**
 * /** The REST based service for managing "users"
 * 
 * @author jumpstart
 *
 */

@Controller
@RequestMapping("/userprofile")
public class UserProfileController {

	private UserProfileRepository userProfileRepository;
	private MongoTemplate mongoTemplate;

	@Autowired
	public UserProfileController(UserProfileRepository userProfileRepository,
			UserProfileRepositoryCustom userProfileRepositoryCustom,
			MongoTemplate mongoTemplate) {
		this.userProfileRepository = userProfileRepository;
		this.mongoTemplate = mongoTemplate;
	}

	// create user - registration - part 2
	@RequestMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public ResponseEntity<String> submitUserProfile(
			@RequestBody UserProfile userProfile) throws Exception {

		System.out.println("Inside submit user profile");
		if (userProfile == null || userProfile.getId() == null
				|| userProfile.getId().equals("")) {
			System.out.println("NEW USER PROFILE");
			try {
				UserProfile userWithExtractedInformation = decorateWithProfileInformation(userProfile);
				mongoTemplate.save(userWithExtractedInformation);
				ResponseEntity<String> responseEntity = new ResponseEntity<String>(
						"User profile created successully", HttpStatus.CREATED);
				System.out.println("responseEntity = " + responseEntity);
				return responseEntity;
			} catch (Exception e) {
				e.printStackTrace();
				ResponseEntity<String> responseEntity = new ResponseEntity<String>(
						"Error while registering user!", HttpStatus.CREATED);
				System.out.println("responseEntity = " + responseEntity);
				// return responseEntity;
				throw e;
			}

		} else {
			System.out.println("EDIT USER PROFILE");
			UserProfile editedUserProfile = getUserProfile(userProfile.getId());
			editedUserProfile
					.setTakeFamilyCare(userProfile.getTakeFamilyCare());
			editedUserProfile
					.setProElderlyCare(userProfile.getProElderlyCare());
			editedUserProfile.setVolunteer(userProfile.getVolunteer());
			editedUserProfile.setBusiness(userProfile.getBusiness());
			editedUserProfile.setDoNothing(userProfile.getDoNothing());

			mongoTemplate.save(editedUserProfile);
			ResponseEntity<String> responseEntity = new ResponseEntity<>(
					HttpStatus.CREATED);
			System.out.println("responseEntity = " + responseEntity);
			return responseEntity;
		}

	}

	@RequestMapping(method = RequestMethod.GET, value = "/{userId}", produces = MediaType.APPLICATION_JSON_VALUE)
	public @ResponseBody UserProfile getUserProfile(
			@PathVariable("userId") String userId) {
		Query q = new Query();
		q.addCriteria(Criteria.where("userId").is(userId));
		UserProfile userProfile = mongoTemplate.findOne(q, UserProfile.class);
		return userProfile;
	}

	private UserProfile decorateWithProfileInformation(UserProfile userProfile) {

		return new UserProfile(userProfile.getUserId(),
				userProfile.getTakeFamilyCare(),
				userProfile.getProElderlyCare(), userProfile.getVolunteer(),
				userProfile.getBusiness(), userProfile.getDoNothing());
	}

}