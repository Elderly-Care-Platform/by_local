package com.beautifulyears.rest;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

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
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.beautifulyears.constants.UserTypes;
import com.beautifulyears.domain.User;
import com.beautifulyears.domain.UserProfile;
import com.beautifulyears.exceptions.BYErrorCodes;
import com.beautifulyears.exceptions.BYException;
import com.beautifulyears.repository.UserProfileRepository;
import com.beautifulyears.rest.response.BYGenericResponseHandler;
import com.beautifulyears.rest.response.UserProfileResponse;
import com.beautifulyears.rest.response.UserProfileResponse.UserProfilePage;
import com.beautifulyears.util.LoggerUtil;
import com.beautifulyears.util.UserProfilePrivacyHandler;
import com.beautifulyears.util.Util;

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

	@Autowired
	public UserProfileController(UserProfileRepository userProfileRepository) {
		this.userProfileRepository = userProfileRepository;
	}

	@RequestMapping(method = { RequestMethod.GET }, value = { "/{userId}" }, produces = { "application/json" })
	@ResponseBody
	public Object getUserProfilebyID(
			@PathVariable(value = "userId") String userId,
			HttpServletRequest req, HttpServletResponse res) throws Exception {
		LoggerUtil.logEntry();
		User user = Util.getSessionUser(req);
		UserProfile userProfile = null;
		try {
			if (userId != null) {
				userProfile = this.userProfileRepository.findByUserId(userId);
				if (userProfile == null) {
					logger.error("did not find any profile matching ID");
					userProfile = new UserProfile();
					if(user != null && user.getEmail() != null && user.getId().equals(userId)){
						userProfile.getBasicProfileInfo().setPrimaryEmail(
								user.getEmail());
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
				.getUserProfileEntity(userProfile, user));
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
							tagIds,isFeatured, pageable,fields), user);
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
					.getServiceProvidersByFilterCriteria(userTypes, null,
							null,null, pageable,fields), null);
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
		logger.debug("in submit User Profile");
		try {
			if ((userProfile != null)) {
				/* check if a valid user exists, whom the profile belongs to */
				User currentUser = Util.getSessionUser(req);
				if (null != currentUser) {
					logger.debug("current user details"
							+ currentUser.toString());
					/* save the user profile */
					if (userProfile.getUserId() != null && userProfile.getUserId().equals(currentUser.getId())) {

						/*
						 * check - if a userProfile by this userID already
						 * exists, do not allow
						 */
						if (this.userProfileRepository.findByUserId(userProfile
								.getUserId()) == null) {
							userProfile.getBasicProfileInfo()
									.setShortDescription(getShortDescription(userProfile));
							userProfileRepository.save(userProfile);
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
		return BYGenericResponseHandler.getResponse(userProfile);
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
							/* set required fields */
							userProfile.getBasicProfileInfo()
									.setShortDescription(getShortDescription(userProfile));
							profile.setBasicProfileInfo(userProfile
									.getBasicProfileInfo());
							profile.setFeatured(userProfile.isFeatured());
							profile.setIndividualInfo(userProfile
									.getIndividualInfo());
							profile.setServiceProviderInfo(userProfile
									.getServiceProviderInfo());
							profile.setStatus(userProfile.getStatus());
							profile.setUserTypes(userProfile.getUserTypes());
							profile.setLastModifiedAt(new Date());
							profile.setSystemTags(userProfile.getSystemTags());

							userProfileRepository.save(profile);
							logger.info("User Profile update with details: "
									+ profile.toString());
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
	
	private String getShortDescription(UserProfile profile){
		 String shortDescription = null;
         if(null != profile.getBasicProfileInfo() && null != profile.getBasicProfileInfo().getDescription()){
                 Document doc = Jsoup.parse(profile
                                 .getBasicProfileInfo()
                                 .getDescription());
                 String longDesc = doc.text();
                 String desc = Util.truncateText(doc.text());
                 if(longDesc != null && !desc.equals(longDesc)){
                         shortDescription = desc;
                 }
         }
		return shortDescription;
	}

}
