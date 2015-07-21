package com.beautifulyears.rest;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.beautifulyears.constants.UserTypes;
import com.beautifulyears.domain.BasicProfileInfo;
import com.beautifulyears.domain.ServiceProviderInfo;
import com.beautifulyears.domain.User;
import com.beautifulyears.domain.UserAddress;
import com.beautifulyears.domain.UserProfile;
import com.beautifulyears.exceptions.BYErrorCodes;
import com.beautifulyears.exceptions.BYException;
import com.beautifulyears.repository.UserProfileRepository;
import com.beautifulyears.rest.response.BYGenericResponseHandler;
import com.beautifulyears.util.LoggerUtil;
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
	private Logger logger = Logger.getLogger(UserProfileController.class);

	private UserProfile userProfile;
	private Page<UserProfile> userProfilePage;
	private UserProfileRepository userProfileRepository;

	@Autowired
	public UserProfileController(UserProfileRepository userProfileRepository) {
		this.userProfileRepository = userProfileRepository;

	}

	/*
	 * this method allows to get a page of userProfiles
	 * 
	 */

	/* this is a test method which allows to get first page of userProfiles */
	@RequestMapping(method = { RequestMethod.GET }, value = { "/list" }, produces = { "application/json" })
	@ResponseBody
	public ResponseEntity<List<UserProfile>> getUserProfilebyPage(
			HttpServletRequest req, HttpServletResponse res) throws IOException {
		HttpStatus httpStatus = HttpStatus.OK;
		LoggerUtil.logEntry();
		logger.debug("trying to test adding a user profile");
		/*
		 * Need to check, how to get page parameters and return corresponding
		 * page
		 */
		/* check the collection */
		/* validate input Param */

		createUserProfile();
		getUserProfilePage(0, 20);

		return new ResponseEntity<List<UserProfile>>(
				this.userProfilePage.getContent(), null, httpStatus);
	}

	/* @PathVariable(value = "userId") String userId */
	@RequestMapping(method = { RequestMethod.GET }, value = { "/{userId}" }, produces = { "application/json" })
	@ResponseBody
	public Object getUserProfilebyID(
			@PathVariable(value = "userId") String userId,
			HttpServletRequest req, HttpServletResponse res) throws Exception {

		this.userProfile = null;
		
		LoggerUtil.logEntry();
		logger.debug("trying to get a user profile by user ID");
		try{
		if (userId != null) {

			this.userProfile = this.userProfileRepository.findByUserId(userId);
			if (this.userProfile == null) {
				logger.error("did not find any profile matching ID");
				this.userProfile = new UserProfile();
			} else {
				logger.debug(this.userProfile.toString());
			}
		} else {
			logger.error("invalid parameter");
			throw new BYException(BYErrorCodes.MISSING_PARAMETER);
			
		}
		} catch (Exception e) {
			Util.handleException(e);
		}
		
		return BYGenericResponseHandler.getResponse(this.userProfile);
	}

	/*
	 * this method allows to get a page of userProfiles based on page number and
	 * size
	 */
	@RequestMapping(method = { RequestMethod.GET }, value = { "/list" }, params = {
			"page", "size" }, produces = { "application/json" })
	@ResponseBody
	public Object getUserProfilebyPageParams(
			@RequestParam(value = "page", required = false, defaultValue = "0") int page, @RequestParam(value = "size", required = false, defaultValue = "10") int size,
			HttpServletRequest req, HttpServletResponse res) throws Exception {

		LoggerUtil.logEntry();
		logger.debug("trying to get all user profiles by page");
		try {
			/* check the collection */
			/* validate input Param */
			logger.debug("page" + page + ",size");

			/* check is at least one record exists. */
			getUserProfilePage(page, size);
			if (this.userProfilePage.hasContent() == false) {
				logger.debug("There is nothing to retrieve");
				/* not sure whether I should be setting an error here */
			}


		} catch (Exception e){
			Util.handleException(e);
		}
		return BYGenericResponseHandler.getResponse(this.userProfilePage);
		
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
			@RequestParam(value = "services", required = false) List<String> services,
			@RequestParam(value = "page", required = false, defaultValue = "0") int page, @RequestParam(value = "size", required = false, defaultValue = "10") int size,
			HttpServletRequest req, HttpServletResponse res) throws Exception {
		
	
		Integer[] userTypes = { UserTypes.INSTITUTION_HOUSING,
				UserTypes.INSTITUTION_SERVICES, UserTypes.INSTITUTION_PRODUCTS,
				UserTypes.INSTITUTION_NGO, UserTypes.INDIVIDUAL_PROFESSIONAL };
		LoggerUtil.logEntry();

		logger.debug("trying to get a user profile by city and service types");

		try {
			
			logger.debug("city" + city + "services" + services + "page" + page
						+ "size" + size);
				/*
				 * userProfileList = userProfileRepository.findByCustomQuery(city,
				 * services);
				 */
			if(null == services){
				services = new ArrayList<String>();
			}
			this.userProfilePage = null;
			this.userProfilePage = userProfileRepository
					.getServiceProvidersByFilterCriteria(userTypes, city,
							services, new PageRequest(page, size));
			if (this.userProfilePage != null) {
				logger.debug("found something");
			} else {
				logger.debug("did not find anything");
			}
			 
		} catch (Exception e) {
			Util.handleException(e);
		}
		return BYGenericResponseHandler.getResponse(this.userProfilePage);
	}

	/*
	 * this method allows to get a page of userProfiles who are service providers based on page number and
	 * size. Service providers can be institution as well as individuals.
	 */
	@RequestMapping(method = { RequestMethod.GET }, value = { "/list/serviceProviders/all" }, params = {
			"page", "size" }, produces = { "application/json" })
	@ResponseBody
	public Object getServiceProviderUserProfiles(
			@RequestParam(value = "page", required = false, defaultValue = "0") int page, @RequestParam(value = "size", required = false, defaultValue = "10") int size,
			HttpServletRequest req, HttpServletResponse res) throws Exception {
		Page<UserProfile> userProfilePage = null;
		Integer[] userTypes = { UserTypes.INSTITUTION_HOUSING,
				UserTypes.INSTITUTION_SERVICES, UserTypes.INSTITUTION_PRODUCTS,
				UserTypes.INSTITUTION_NGO, UserTypes.INDIVIDUAL_PROFESSIONAL };
		LoggerUtil.logEntry();
		logger.debug("trying to get all service provider profiles");

		try {
				logger.debug("page" + page + ",size" + size);
				userProfilePage = this.userProfileRepository
						.getServiceProvidersByCriteria(userTypes, new PageRequest(
								page, size));
				if (userProfilePage.hasContent() == false) {
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
	public Object submitUserProfile(
			@RequestBody UserProfile userProfile, HttpServletRequest req,
			HttpServletResponse res) throws Exception {
		
		LoggerUtil.logEntry();
		logger.debug("in submit User Profile");
		
		try {
			if ((userProfile != null)) {
				/* check if a valid user exists, whom the profile belongs to */
				User currentUser = Util.getSessionUser(req);
				if (null != currentUser) {
					logger.debug("current user details" + currentUser.toString());
					/* save the user profile */
					this.userProfile = userProfile;
					if (this.userProfile.getUserId().equals(currentUser.getId())) {

						/*
						 * check - if a userProfile by this userID already exists,
						 * do not allow
						 */
						if (this.userProfileRepository
								.findByUserId(this.userProfile.getUserId()) == null) {
							userProfileRepository.save(this.userProfile);
							logger.info("New User Profile created with details: "
									+ this.userProfile.toString());
						} else {
							logger.debug("resource already exists");
							this.userProfile = null;
							throw new BYException(BYErrorCodes.USER_ALREADY_EXIST);
						}
					} else {
						logger.error("Wrong user ID" + this.userProfile.getUserId());
						this.userProfile = null;
						throw new BYException(BYErrorCodes.INVALID_REQUEST);
					}
				} else {
					this.userProfile = null;
					logger.error("No valid user session");
					throw new BYException(BYErrorCodes.USER_NOT_AUTHORIZED);
					
				
				}
			} else {
				this.userProfile = null;
				logger.debug("In trouble Jharana");
				throw new BYException(BYErrorCodes.MISSING_PARAMETER);

			}
		} catch (Exception e) {
			Util.handleException(e);
		}
		return BYGenericResponseHandler.getResponse(this.userProfile);
	}

	/* @PathVariable(value = "userId") String userId */
	@RequestMapping(method = { RequestMethod.PUT }, value = { "/{userId}" }, consumes = { "application/json" })
	@ResponseBody
	public Object updateUserProfile(
			@RequestBody UserProfile userProfile,
			@PathVariable(value = "userId") String userId,
			HttpServletRequest req, HttpServletResponse res) throws Exception {

		this.userProfile = null;
		LoggerUtil.logEntry();
		logger.debug("trying to update a user Profile");

		try {
			if ((userProfile != null) && (userId != null)) {

				/* first check if we have valid user session */
				User currentUser = Util.getSessionUser(req);
				if (null != currentUser) {
					logger.debug("current user details" + currentUser.getId());
					logger.debug("userPRofile ID" + userProfile.getId());

					if (userProfile.getUserId().equals(currentUser.getId())) {
						
							this.userProfile = null;
							this.userProfile = userProfileRepository
									.findByUserId(userId);

							if (this.userProfile != null) {
								logger.debug("userPRofile from repo"
										+ this.userProfile.toString());
								/* set required fields */
								this.userProfile.setBasicProfileInfo(userProfile
										.getBasicProfileInfo());
								this.userProfile.setFeatured(userProfile
										.isFeatured());
								this.userProfile.setIndividualInfo(userProfile
										.getIndividualInfo());
								this.userProfile.setServiceProviderInfo(userProfile
										.getServiceProviderInfo());
								this.userProfile.setStatus(userProfile.getStatus());
								this.userProfile.setUserTypes(userProfile
										.getUserTypes());

								userProfileRepository.save(this.userProfile);
								logger.info("User Profile update with details: "
										+ this.userProfile.toString());
							}
						

					} else {
						logger.error("Wrong user ID" + this.userProfile.getUserId());
						throw new BYException(BYErrorCodes.USER_NOT_AUTHORIZED);
					}
				} else {
					this.userProfile = null;
					logger.error("No valid user session");
					throw new BYException(BYErrorCodes.USER_NOT_AUTHORIZED);
				}
			}

			else {
				/* Bad request */
				logger.debug("looks like an invalid request");
				throw new BYException(BYErrorCodes.MISSING_PARAMETER);
			}
		} catch (Exception e) {
			Util.handleException(e);
		}

		return BYGenericResponseHandler.getResponse(this.userProfile);
	}

	private void createUserProfile() {
		BasicProfileInfo basicProfileInfo = new BasicProfileInfo();
		ServiceProviderInfo serviceProviderInfo = new ServiceProviderInfo();
		UserAddress userAddress = new UserAddress();
		this.userProfile = new UserProfile();

		LoggerUtil.logEntry();
		logger.debug("in testUserProfile.java");
		List<Integer> userTypeList = new ArrayList<Integer>();
		List<String> imageURLs = new ArrayList<String>();

		userTypeList.add(UserTypes.INSTITUTION_SERVICES);
		userProfile.setUserTypes(userTypeList);

		/* Set basic Profile Information */
		basicProfileInfo.setFirstName("Nighhtingales");

		basicProfileInfo.setDescription("Beautiful home health care services");
		basicProfileInfo.setPrimaryEmail("abc@nighitngales.com");
		basicProfileInfo.setPrimaryPhoneNo("99723008321");

		imageURLs.add("image1.jpg");
		imageURLs.add("image2.jpg");

		/* set address */
		userAddress.setCountry("India");
		userAddress.setCity("Bangalore");
		userAddress.setLocality("J P Nagar");
		userAddress.setStreetAddress("BG campus");
		userAddress.setZip("560078");
		basicProfileInfo.setUserAddress(userAddress);

		serviceProviderInfo.setHomeVisits(true);
		serviceProviderInfo.setWebsite("www.google.com");
		serviceProviderInfo.setYearsExperience(5);
		serviceProviderInfo.setIncorporationDate(new Date());
		this.userProfile.setBasicProfileInfo(basicProfileInfo);
		this.userProfile.setServiceProviderInfo(serviceProviderInfo);

		userProfileRepository.save(userProfile);

	}

	private void getUserProfilePage(int page, int size) {
		LoggerUtil.logEntry();
		logger.debug("in getUserProfile()");
		/*
		 * Iterable<UserProfile> userProfiles; userProfiles =
		 * userProfileRepository.findAll(); java.util.Iterator<UserProfile>
		 * upIterator = userProfiles.iterator(); this.userProfile =
		 * upIterator.next(); logger.debug(this.userProfile.toString());
		 */
		this.userProfilePage = null;
		this.userProfilePage = userProfileRepository.findAll(new PageRequest(
				page, size));

	}

}
