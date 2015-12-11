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
import com.beautifulyears.domain.User;
import com.beautifulyears.domain.UserAddress;
import com.beautifulyears.domain.UserProfile;
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
@RequestMapping("/userProfile")
public class UserProfileController {
	private static Logger logger = Logger
			.getLogger(UserProfileController.class);

	private UserProfileRepository userProfileRepository;
	private ActivityLogHandler<UserProfile> logHandler;
	private MongoTemplate mongoTemplate;

	@Autowired
	public UserProfileController(UserProfileRepository userProfileRepository,
			MongoTemplate mongoTemplate) {
		this.userProfileRepository = userProfileRepository;
		this.mongoTemplate = mongoTemplate;
		logHandler = new UserProfileLogHandler(mongoTemplate);
	}

	@RequestMapping(method = { RequestMethod.GET }, value = { "/{userId}" }, produces = { "application/json" })
	@ResponseBody
	public Object getUserProfilebyID(
			@PathVariable(value = "userId") String userId,
			HttpServletRequest req, HttpServletResponse res) throws Exception {
		LoggerUtil.logEntry();
		//User sessionUser = Util.getSessionUser(req);
		User userInfo = UserController.getUser(userId);
		UserProfile userProfile = null;
	
		try {
			if (userId != null) {
				userProfile = userProfileRepository.findAllProfileByUserId(userId).get(0);
				if (userProfile == null) {
					logger.error("did not find any profile matching ID");
					userProfile = new UserProfile();
					if (userInfo != null){
						userProfile.getBasicProfileInfo().setPrimaryEmail(
								userInfo.getEmail());
						userProfile.getBasicProfileInfo().setPrimaryPhoneNo(
								userInfo.getPhoneNumber());
					}	
				} else {
					logger.debug(userProfile.toString());
				}
			} else {
				logger.error("invalid parameter");
				throw new BYException(BYErrorCodes.MISSING_PARAMETER);
			}

		} catch (Exception e) {
			Util.handleException(e);
		}
		return BYGenericResponseHandler.getResponse(UserProfileResponse
				.getUserProfileEntity(userProfile, userInfo));
	}

	/*
	 * this method allows to get a page of userProfiles based on page number and
	 * size
	 */
	@RequestMapping(method = { RequestMethod.GET }, value = { "/list" }, params = {
			"page", "size" }, produces = { "application/json" })
	@ResponseBody
	public Object getUserProfilebyPageParams(
			@RequestParam(value = "page", required = false, defaultValue = "0") int page,
			@RequestParam(value = "size", required = false, defaultValue = "10") int size,
			@RequestParam(value = "sort", required = false, defaultValue = "lastModifiedAt") String sort,
			@RequestParam(value = "dir", required = false, defaultValue = "0") int dir,
			HttpServletRequest req, HttpServletResponse res) throws Exception {

		LoggerUtil.logEntry();
		User user = Util.getSessionUser(req);
		UserProfileResponse.UserProfilePage profilePage = null;
		try {
			/* check the collection */
			/* validate input Param */
			logger.debug("page" + page + ",size");
			/* setting page and sort criteria */
			Direction sortDirection = Direction.DESC;
			if (dir != 0) {
				sortDirection = Direction.ASC;
			}

			Pageable pageable = new PageRequest(page, size, sortDirection, sort);

			/* check is at least one record exists. */
			profilePage = UserProfileResponse.getPage(
					userProfileRepository.findAllUserProfiles(pageable), user);
			if (profilePage.getContent().size() == 0) {
				logger.debug("There is nothing to retrieve");
				/* not sure whether I should be setting an error here */
			}

		} catch (Exception e) {
			Util.handleException(e);
		}
		return BYGenericResponseHandler.getResponse(profilePage);

	}

	/* this method is to get list of service Provider user Profiles. */
	/*
	 * this method allows to get a page of userProfiles based on page number and
	 * size, also optional filter parameters like service types and city.
	 */
	@RequestMapping(method = { RequestMethod.GET }, value = { "/list/serviceProviders" }, produces = { "application/json" })
	@ResponseBody
	public Object getUserProfilebyCity(
			@RequestParam(value = "city", required = false) String city,
			@RequestParam(value = "tags", required = false) List<String> tags,
			@RequestParam(value = "page", required = false, defaultValue = "0") int page,
			@RequestParam(value = "size", required = false, defaultValue = "10") int size,
			@RequestParam(value = "isFeatured", required = false) Boolean isFeatured,
			@RequestParam(value = "sort", required = false, defaultValue = "lastModifiedAt") String sort,
			@RequestParam(value = "dir", required = false, defaultValue = "0") int dir,
			HttpServletRequest req, HttpServletResponse res) throws Exception {

		Integer[] userTypes = { UserTypes.INSTITUTION_HOUSING,
				UserTypes.INSTITUTION_SERVICES, UserTypes.INSTITUTION_PRODUCTS,
				UserTypes.INSTITUTION_NGO, UserTypes.INDIVIDUAL_PROFESSIONAL };
		LoggerUtil.logEntry();
		List<ObjectId> tagIds = new ArrayList<ObjectId>();
		User user = Util.getSessionUser(req);

		UserProfileResponse.UserProfilePage profilePage = null;
		try {
			logger.debug(" city " + city + " tags " + tags + " page " + page
					+ " size " + size);
			// if (null == services) {
			// services = new ArrayList<String>();
			// }

			if (null != tags) {
				for (String tagId : tags) {
					tagIds.add(new ObjectId(tagId));
				}
			}

			/* setting page and sort criteria */
			Direction sortDirection = Direction.DESC;
			if (dir != 0) {
				sortDirection = Direction.ASC;
			}

			Pageable pageable = new PageRequest(page, size, sortDirection, sort);
			List<String> fields = new ArrayList<String>();
			fields = UserProfilePrivacyHandler.getPublicFields(-1);
			profilePage = UserProfileResponse.getPage(userProfileRepository
					.getServiceProvidersByFilterCriteria(userTypes, city,
							tagIds, isFeatured, pageable, fields), user);
			if (profilePage.getContent().size() > 0) {
				logger.debug("found something");
			} else {
				logger.debug("did not find anything");
			}
		} catch (Exception e) {
			Util.handleException(e);
		}
		return BYGenericResponseHandler.getResponse(profilePage);
	}

	/*
	 * this method allows to get a page of userProfiles who are service
	 * providers based on page number and size. Service providers can be
	 * institution as well as individuals.
	 */
	@RequestMapping(method = { RequestMethod.GET }, value = { "/list/serviceProviders/all" }, params = {
			"page", "size" }, produces = { "application/json" })
	@ResponseBody
	public Object getServiceProviderUserProfiles(
			@RequestParam(value = "page", required = false, defaultValue = "0") int page,
			@RequestParam(value = "size", required = false, defaultValue = "10") int size,
			@RequestParam(value = "sort", required = false, defaultValue = "lastModifiedAt") String sort,
			@RequestParam(value = "dir", required = false, defaultValue = "0") int dir,
			HttpServletRequest req, HttpServletResponse res) throws Exception {
		UserProfilePage userProfilePage = null;
		Integer[] userTypes = { UserTypes.INSTITUTION_HOUSING,
				UserTypes.INSTITUTION_SERVICES, UserTypes.INSTITUTION_PRODUCTS,
				UserTypes.INSTITUTION_NGO, UserTypes.INDIVIDUAL_PROFESSIONAL };
		LoggerUtil.logEntry();
		logger.debug("trying to get all service provider profiles");

		try {
			logger.debug("page" + page + ",size" + size);
			/* setting page and sort criteria */
			Direction sortDirection = Direction.DESC;
			if (dir != 0) {
				sortDirection = Direction.ASC;
			}
			List<String> fields = new ArrayList<String>();
			fields.add("userId");

			Pageable pageable = new PageRequest(page, size, sortDirection, sort);
			userProfilePage = UserProfileResponse.getPage(userProfileRepository
					.getServiceProvidersByFilterCriteria(userTypes, null, null,
							null, pageable, fields), null);
			if (userProfilePage.getContent().size() > 0) {
				logger.debug("did not find any service providers");
			}

		} catch (Exception e) {
			Util.handleException(e);
		}
		return BYGenericResponseHandler.getResponse(userProfilePage);
	}

	/* This method allows the creation of a user profile */
	@RequestMapping(method = { RequestMethod.POST }, value = { "" }, consumes = { "application/json" })
	@ResponseBody
	public Object submitUserProfile(@RequestBody UserProfile userProfile,
			HttpServletRequest req, HttpServletResponse res) throws Exception {

		LoggerUtil.logEntry();
		UserProfile profile = null;
		User currentUser = null;
		try {
			if ((userProfile != null)) {
				currentUser = Util.getSessionUser(req);
				if (null != currentUser) {
					logger.debug("current user details"
							+ currentUser.toString());
					if (userProfile.getUserId() != null
							&& userProfile.getUserId().equals(
									currentUser.getId())) {
						if (this.userProfileRepository.findByUserId(userProfile
								.getUserId()) == null) {
							profile = new UserProfile();
							profile.setUserId(currentUser.getId());
							profile.setUserTypes(userProfile.getUserTypes());
							if (currentUser.getRegType() == BYConstants.REGISTRATION_TYPE_EMAIL) {
								profile.getBasicProfileInfo().setPrimaryEmail(
										currentUser.getEmail());
							} else if (currentUser.getRegType() == BYConstants.REGISTRATION_TYPE_PHONE) {
								profile.getBasicProfileInfo()
										.setPrimaryPhoneNo(
												currentUser.getPhoneNumber());
							}
							userProfileRepository.save(profile);
							UpdateUserProfileHandler userProfileHandler = new UpdateUserProfileHandler(
									mongoTemplate);
							userProfileHandler.setProfile(profile);
							new Thread(userProfileHandler).start();
							logHandler.addLog(profile,
									ActivityLogConstants.CRUD_TYPE_CREATE, req);
						} else {
							throw new BYException(
									BYErrorCodes.USER_ALREADY_EXIST);
						}
					} else {
						throw new BYException(BYErrorCodes.USER_NOT_AUTHORIZED);
					}
				} else {
					throw new BYException(BYErrorCodes.USER_LOGIN_REQUIRED);
				}
			} else {
				throw new BYException(BYErrorCodes.MISSING_PARAMETER);

			}
		} catch (Exception e) {
			Util.handleException(e);
		}
		return BYGenericResponseHandler.getResponse(UserProfileResponse
				.getUserProfileEntity(profile, currentUser));
	}

	/* @PathVariable(value = "userId") String userId */
	@RequestMapping(method = { RequestMethod.PUT }, value = { "/{userId}" }, consumes = { "application/json" })
	@ResponseBody
	public Object updateUserProfile(@RequestBody UserProfile userProfile,
			@PathVariable(value = "userId") String userId,
			HttpServletRequest req, HttpServletResponse res) throws Exception {

		LoggerUtil.logEntry();
		UserProfile profile = null;
		User currentUser = Util.getSessionUser(req);
		try {
			if ((userProfile != null) && (userId != null)) {
				if (null != currentUser) {
					if (userProfile.getUserId().equals(currentUser.getId())) {
						profile = userProfileRepository.findByUserId(userId);

						if (profile != null) {
							userProfile.getBasicProfileInfo()
									.setShortDescription(
											getShortDescription(userProfile));
							profile.setLastModifiedAt(new Date());
							profile.setSystemTags(userProfile.getSystemTags());

							profile.setBasicProfileInfo(userProfile
									.getBasicProfileInfo());
							if (!Collections.disjoint(
									profile.getUserTypes(),
									new ArrayList<>(Arrays.asList(
											UserTypes.INDIVIDUAL_CAREGIVER,
											UserTypes.INDIVIDUAL_ELDER,
											UserTypes.INDIVIDUAL_PROFESSIONAL,
											UserTypes.INDIVIDUAL_VOLUNTEER)))) {
								profile.setIndividualInfo(userProfile
										.getIndividualInfo());
							}
							else if(profile.getUserTypes().contains(UserTypes.INSTITUTION_SERVICES) || profile.getUserTypes().contains(UserTypes.INSTITUTION_BRANCH)){
								profile.setServiceProviderInfo(userProfile
										.getServiceProviderInfo());
								List<UserProfile> branchInfo = userProfile.getServiceBranches();
								saveBranches(branchInfo, userId);
								profile.setServiceBranches(userProfile
										.getServiceBranches());
								
							}
							else if (profile.getUserTypes().contains(UserTypes.INDIVIDUAL_PROFESSIONAL)){
								profile.setServiceProviderInfo(userProfile
										.getServiceProviderInfo());
							}
							else if (profile.getUserTypes().contains(UserTypes.INSTITUTION_HOUSING)){
								profile.setFacilities(HousingController
										.addFacilities(
												userProfile.getFacilities(),
												currentUser));
							}

							userProfileRepository.save(profile);
							logHandler.addLog(profile,
									ActivityLogConstants.CRUD_TYPE_UPDATE, req);
							logger.info("User Profile update with details: "
									+ profile.toString());
						} else {
							throw new BYException(
									BYErrorCodes.USER_PROFILE_DOES_NOT_EXIST);
						}

					} else {
						throw new BYException(BYErrorCodes.USER_NOT_AUTHORIZED);
					}
				} else {
					throw new BYException(BYErrorCodes.USER_LOGIN_REQUIRED);
				}
			}

			else {
				throw new BYException(BYErrorCodes.MISSING_PARAMETER);
			}
		} catch (Exception e) {
			Util.handleException(e);
		}

		return BYGenericResponseHandler.getResponse(UserProfileResponse
				.getUserProfileEntity(profile, currentUser));
	}

	@RequestMapping(method = { RequestMethod.GET }, value = { "/address/{userId}" }, params = { "addressIndex" }, produces = { "application/json" })
	@ResponseBody
	public Object getAddress(
			@PathVariable(value = "userId") String userId,
			@RequestParam(value = "addressIndex", defaultValue = "0") int addressIndex,
			HttpServletRequest req, HttpServletResponse res) throws Exception {
		LoggerUtil.logEntry();
		UserProfile userProfile = null;
		UserAddress userAddress = null;
		try {
			if (userId != null) {
				userProfile = this.userProfileRepository.findByUserId(userId);
				if (userProfile == null) {
					logger.error("did not find any profile matching ID");
				} else {
					if (addressIndex == 0
							&& null != userProfile.getBasicProfileInfo()) {
						userAddress = userProfile.getBasicProfileInfo()
								.getPrimaryUserAddress();
					} else {
						List<UserAddress> addressArray = userProfile
								.getBasicProfileInfo().getOtherAddresses();
						if (addressArray.size() > addressIndex - 1) {
							userAddress = userProfile.getBasicProfileInfo()
									.getOtherAddresses().get(addressIndex - 1);
						} else {
							throw new BYException(BYErrorCodes.NO_CONTENT_FOUND);
						}
					}
				}
			} else {
				logger.error("invalid parameter");
				throw new BYException(BYErrorCodes.MISSING_PARAMETER);
			}

		} catch (Exception e) {
			Util.handleException(e);
		}
		return BYGenericResponseHandler.getResponse(userAddress);
	}

	@RequestMapping(method = { RequestMethod.PUT }, value = { "/address/{userId}" }, consumes = { "application/json" })
	@ResponseBody
	public Object updateAddress(
			@RequestBody UserAddress userAddress,
			@PathVariable(value = "userId") String userId,
			@RequestParam(value = "addressIndex", required = true) int addressIndex,
			HttpServletRequest req, HttpServletResponse res) throws Exception {

		LoggerUtil.logEntry();
		UserProfile userProfile = null;
		try {
			if (userId != null) {
				userProfile = this.userProfileRepository.findByUserId(userId);
				if (userProfile == null) {
					logger.error("did not find any profile matching ID");
				} else {
					if (addressIndex == 0
							&& null != userProfile.getBasicProfileInfo()) {
						userProfile.getBasicProfileInfo()
								.setPrimaryUserAddress(userAddress);
						mongoTemplate.save(userProfile);
					} else {
						List<UserAddress> addressArray = userProfile
								.getBasicProfileInfo().getOtherAddresses();
						if (addressArray.size() > addressIndex - 1) {
							userProfile.getBasicProfileInfo()
									.getOtherAddresses()
									.set(addressIndex - 1, userAddress);
							mongoTemplate.save(userProfile);
						} else {
							throw new BYException(BYErrorCodes.NO_CONTENT_FOUND);
						}
					}
				}
			} else {
				logger.error("invalid parameter");
				throw new BYException(BYErrorCodes.MISSING_PARAMETER);
			}

		} catch (Exception e) {
			Util.handleException(e);
		}
		return BYGenericResponseHandler.getResponse(userAddress);
	}

	@RequestMapping(method = { RequestMethod.POST }, value = { "/address/{userId}" }, consumes = { "application/json" })
	@ResponseBody
	public Object addAddress(@RequestBody UserAddress userAddress,
			@PathVariable(value = "userId") String userId,
			HttpServletRequest req, HttpServletResponse res) throws Exception {

		LoggerUtil.logEntry();
		UserProfile userProfile = null;
		try {
			if (userId != null) {
				userProfile = this.userProfileRepository.findByUserId(userId);
				if (userProfile == null) {
					logger.error("did not find any profile matching ID");
				} else {
					userProfile.getBasicProfileInfo().getOtherAddresses()
							.add(userAddress);
					mongoTemplate.save(userProfile);
				}
			} else {
				logger.error("invalid parameter");
				throw new BYException(BYErrorCodes.MISSING_PARAMETER);
			}

		} catch (Exception e) {
			Util.handleException(e);
		}
		return BYGenericResponseHandler.getResponse(userAddress);
	}
	
	private void saveBranches(List<UserProfile> branchInfo,String userId) {
		for(UserProfile branch: branchInfo){
			if(!branch.getUserTypes().contains(UserTypes.INSTITUTION_BRANCH)){
				throw new BYException(BYErrorCodes.MISSING_PARAMETER);
			}
		}
		for(UserProfile branch: branchInfo){
			mongoTemplate.save(branch);
		}
		
	}

	private String getShortDescription(UserProfile profile) {
		String shortDescription = null;
		if (null != profile.getBasicProfileInfo()
				&& null != profile.getBasicProfileInfo().getDescription()) {
			Document doc = Jsoup.parse(profile.getBasicProfileInfo()
					.getDescription());
			String longDesc = doc.text();
			String desc = Util.truncateText(doc.text());
			if (longDesc != null && !desc.equals(longDesc)) {
				shortDescription = desc;
			}
		}
		return shortDescription;
	}

	@RequestMapping(method = { RequestMethod.GET }, value = { "/getCount" }, produces = { "application/json" })
	@ResponseBody
	private Object getProfileCount() {

		Aggregation aggregation = newAggregation(
				match(where("status")
						.is(DiscussConstants.DISCUSS_STATUS_ACTIVE)),
				unwind("userTypes"), group("userTypes").count().as("total"),
				project("total").and("_id").as("userTypes"));

		AggregationResults<UserProfileController.ProfileCount> groupResults = mongoTemplate
				.aggregate(aggregation, UserProfile.class,
						UserProfileController.ProfileCount.class);
		Map<String, Integer> countMap = new HashMap<String, Integer>();
		for (UserProfileController.ProfileCount profileCount : groupResults
				.getMappedResults()) {
			countMap.put(profileCount.getUserTypes(), profileCount.getTotal());
		}
		Long housing = HousingController.getHousingCount();
		countMap.put("" + UserTypes.INSTITUTION_HOUSING,
				(Integer) housing.intValue());
		return BYGenericResponseHandler.getResponse(countMap);
	}

	class ProfileCount {
		private String userTypes;
		private Integer total;

		public String getUserTypes() {
			return userTypes;
		}

		public void setUserTypes(String userTypes) {
			this.userTypes = userTypes;
		}

		public Integer getTotal() {
			return total;
		}

		public void setTotal(Integer total) {
			this.total = total;
		}

	}

}
