package com.beautifulyears.rest;

import java.util.List;

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

import com.beautifulyears.domain.UserDependents;

///import com.beautifulyears.repository.UserDependentsRepository;

/**
 * /** The REST based service for managing "users"
 * 
 * @author jumpstart
 *
 */

@Controller
@RequestMapping("/dependent")
public class UserDependentsProfileController {

	// private UserDependentsRepository userDependentsRepository;
	private MongoTemplate mongoTemplate;

	@Autowired
	public UserDependentsProfileController(
	// UserDependentsRepository userDependentsRepository,
	// UserDependentsRepositoryCustom userDependentsRepositoryCustom,
			MongoTemplate mongoTemplate) {
		// this.userDependentsRepository = userDependentsRepository;
		// this.userDependentsRepository = userDependentsRepository;
		this.mongoTemplate = mongoTemplate;
	}

	// create user - registration - part 3
	@RequestMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public ResponseEntity<String> manageUserProfile3(
			@RequestBody UserDependents userDependents) throws Exception {

		System.out.println("Inside submit user profile step 3");

		UserDependents editedUserDependents = null;

		// If this is an existing dependent being edited
		if (userDependents.getId() != null) {
			editedUserDependents = getUserDependent(userDependents.getUserId(),
					userDependents.getId());

		}
		// New dependent
		else {
			editedUserDependents = new UserDependents();
		}

		// setters all
		editedUserDependents.setAddress(userDependents.getAddress());
		editedUserDependents.setBlurb(userDependents.getBlurb());
		editedUserDependents.setCity(userDependents.getCity());
		editedUserDependents.setCountry(userDependents.getCountry());
		editedUserDependents.setEmailId1(userDependents.getEmailId1());
		editedUserDependents.setEmailId2(userDependents.getEmailId2());
		editedUserDependents.setEmailId3(userDependents.getEmailId3());
		editedUserDependents.setEmailId4(userDependents.getEmailId4());
		editedUserDependents.setEmailId5(userDependents.getEmailId5());
		editedUserDependents.setId(userDependents.getId());
		editedUserDependents.setImageUrl1(userDependents.getImageUrl1());
		editedUserDependents.setImageUrl2(userDependents.getImageUrl2());
		editedUserDependents.setImageUrl3(userDependents.getImageUrl3());
		editedUserDependents.setImpDate1(userDependents.getImpDate1());
		editedUserDependents.setImpDate2(userDependents.getImpDate2());
		editedUserDependents.setImpDate3(userDependents.getImpDate3());
		editedUserDependents.setImpDate4(userDependents.getImpDate4());
		editedUserDependents.setImpDate5(userDependents.getImpDate5());

		editedUserDependents.setImpEvent1(userDependents.getImpEvent1());
		editedUserDependents.setImpEvent2(userDependents.getImpEvent2());
		editedUserDependents.setImpEvent3(userDependents.getImpEvent3());
		editedUserDependents.setImpEvent4(userDependents.getImpEvent4());
		editedUserDependents.setImpEvent5(userDependents.getImpEvent5());

		editedUserDependents.setInterestedIn(userDependents.getInterestedIn());
		editedUserDependents.setLikesDoing(userDependents.getLikesDoing());
		editedUserDependents.setLivesWith(userDependents.getLivesWith());
		editedUserDependents.setLivesIn(userDependents.getLivesIn());
		editedUserDependents.setLocality(userDependents.getLocality());
		editedUserDependents
				.setMaritalStatus(userDependents.getMaritalStatus());
		editedUserDependents.setName(userDependents.getName());
		editedUserDependents.setPhone1(userDependents.getPhone1());
		editedUserDependents.setPhone2(userDependents.getPhone2());
		editedUserDependents.setPhone3(userDependents.getPhone3());
		editedUserDependents.setPhone4(userDependents.getPhone4());
		editedUserDependents.setPhone5(userDependents.getPhone5());

		// yes/no
		editedUserDependents.setShareSufferingFrom(userDependents
				.getShareSufferingFrom());
		System.out.println("userDependents.getSpeaksLang() = " + userDependents.getSpeaksLang());
		editedUserDependents.setSpeaksLang(userDependents.getSpeaksLang());
		editedUserDependents
				.setSufferingFrom(userDependents.getSufferingFrom());
		editedUserDependents.setTakingCareOf(userDependents.getTakingCareOf());
		editedUserDependents.setUserId(userDependents.getUserId());

		mongoTemplate.save(editedUserDependents);
		ResponseEntity<String> responseEntity = new ResponseEntity<>(
				HttpStatus.CREATED);
		System.out.println("responseEntity = " + responseEntity);
		return responseEntity;

	}

	@RequestMapping(method = { RequestMethod.GET }, value = "/{userId}/{dependentId}", produces = MediaType.APPLICATION_JSON_VALUE)
	public @ResponseBody UserDependents getUserDependent(
			@PathVariable("userId") String userId,
			@PathVariable("dependentId") String dependentId) throws Exception {
		System.out
				.println("Inside getUserDependent UserDependentProfileController used id = "
						+ userId + " :: dependent id = " + dependentId);
		UserDependents userDependent = null;
		Query q = new Query();
		q.addCriteria(Criteria.where("userId").is(userId).and("id")
				.is(dependentId));

		userDependent = mongoTemplate.findOne(q, UserDependents.class);
		System.out.println("speaks lang  = "
				+ userDependent.getSpeaksLang());

		return userDependent;// == null ? new UserDependents(userId)
		// : userDependent;
	}

	@RequestMapping(method = { RequestMethod.GET }, value = "/list/{userId}", produces = { "application/json" })
	public @ResponseBody List<UserDependents> getUserDependents(
			@PathVariable("userId") String userId) throws Exception {
		System.out
				.println("Inside getUserDependent UserDependentProfileController used id = "
						+ userId);
		Query q = new Query();
		q.addCriteria(Criteria.where("userId").is(userId));

		List<UserDependents> userDependents = (List<UserDependents>)mongoTemplate.find(q, UserDependents.class);
		
		System.out.println("userDependents = " + userDependents);
		if(userDependents != null && userDependents.size() > 0)
		for(int i=0; i<userDependents.size();i++)
		{
			System.out.println("taking care of = "
					+ ((UserDependents)userDependents.get(i)).getId());
		}
		return userDependents;

	}
}