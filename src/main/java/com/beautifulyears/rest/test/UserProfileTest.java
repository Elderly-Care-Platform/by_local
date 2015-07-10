package com.beautifulyears.rest.test;

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
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.beautifulyears.domain.BasicProfileInfo;
import com.beautifulyears.domain.Discuss;
import com.beautifulyears.domain.ServiceProviderInfo;
import com.beautifulyears.domain.User;
import com.beautifulyears.domain.UserAddress;
import com.beautifulyears.domain.UserProfile;
import com.beautifulyears.domain.UserTypes;
import com.beautifulyears.repository.UserProfileRepository;
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
public class UserProfileTest {
	private Logger logger = Logger
			.getLogger(UserProfileTest.class);

	private UserProfile userProfile;
	private Page<UserProfile> userProfilePage;
	private UserProfileRepository userProfileRepository;

	@Autowired
	public UserProfileTest(UserProfileRepository userProfileRepository) {
		this.userProfileRepository = userProfileRepository;
		
	}
	/* this method allows to get a page of userProfiles
	@RequestMapping(method = {RequestMethod.GET}, value = { "/list" }, produces = { "application/json" })
	@ResponseBody
	public Page<UserProfile> checkUserProfile(
			HttpServletRequest req, HttpServletResponse res) throws IOException {
		logger.debug("trying to test adding a user profile");
		
		createUserProfile();
		getUserProfile();
		
		return this.userProfilePage;
	}*/
	
	/* this is a test method which allows to get first page of userProfiles*/
	@RequestMapping(method = {RequestMethod.GET}, value = { "/list" }, produces = { "application/json" })
	@ResponseBody
	public ResponseEntity<List<UserProfile>> getUserProfilebyPage(
			HttpServletRequest req, HttpServletResponse res) throws IOException {
		HttpStatus httpStatus = HttpStatus.OK;
		LoggerUtil.logEntry();
		logger.debug("trying to test adding a user profile");
		/* Need to check, how to get page parameters and return corresponding page */
		/* check the collection */
		/* validate input Param*/
		
		createUserProfile();
		getUserProfilePage(0, 20);
		
		return new ResponseEntity<List<UserProfile>>(this.userProfilePage.getContent(),null, httpStatus);
	}
	
	/*@PathVariable(value = "userId") String userId */
	@RequestMapping(method = {RequestMethod.GET}, value = { "/{userId}" }, produces = { "application/json" })
	@ResponseBody
	public ResponseEntity<UserProfile> getUserProfilebyID(@PathVariable(value = "userId") String userId,
			HttpServletRequest req, HttpServletResponse res) throws IOException {
		
		this.userProfile = null;
		HttpStatus httpStatus = HttpStatus.OK;
		LoggerUtil.logEntry();
		logger.debug("trying to get a user profile by user ID");
		if (userId != null) {
			
			this.userProfile = this.userProfileRepository.findByUserId(userId);
			if (this.userProfile == null) {
				logger.error("did not find any profile matching ID");
				this.userProfile = new UserProfile();
			}
			else
			{
				logger.debug(this.userProfile.toString());
			}
		}
		else {
			logger.error("invalid parameter");
			httpStatus = HttpStatus.BAD_REQUEST;
		}
		
		
		return new ResponseEntity<UserProfile>(this.userProfile, null, httpStatus);
	}
	
	/* this method allows to get a page of userProfiles based on page number and size */
	@RequestMapping(method = {RequestMethod.GET}, value = { "/list" }, params = { "page", "size" }, produces = { "application/json" })
	@ResponseBody
	public ResponseEntity<List<UserProfile>> getUserProfilebyPageParams(@RequestParam( "page" ) int page, @RequestParam( "size" ) int size,
		 HttpServletRequest req, HttpServletResponse res) throws IOException {
		
		LoggerUtil.logEntry();
		HttpStatus httpStatus = HttpStatus.OK;
		logger.debug("trying to test adding a user profile");
	
		/* check the collection */
		/* validate input Param*/
		logger.debug("page" + page + ",size");
		if (( page >= 0) && (size > 0))
		{
			/* check is at least one record exists.*/
			getUserProfilePage(page, size);
			if (this.userProfilePage.hasContent() == false) {
				logger.debug("There is nothing to retrieve");
				/* not sure whether I should be setting an error here */
			}
			
		}
		else
		{
			logger.error("getUserProfilebyPageParams - invalid arguments");
			httpStatus = HttpStatus.BAD_REQUEST;
		}
		return new ResponseEntity<List<UserProfile>>(this.userProfilePage.getContent(),null, httpStatus);
	}

	/* this method is to get list of user profiles by city */
	/* this method allows to get a page of userProfiles based on page number and size */
	@RequestMapping(method = {RequestMethod.GET}, value = { "/list/serviceProviders" }, params = { "city", "services", "page", "size" }, produces = { "application/json" })
	@ResponseBody
	public ResponseEntity<List<UserProfile>> getUserProfilebyCity(@RequestParam("city") String city, 
			@RequestParam("services") String services, @RequestParam( "page" ) int page, @RequestParam( "size" ) int size,
		 HttpServletRequest req, HttpServletResponse res) throws IOException {
		List<UserProfile> userProfileList = null;
		LoggerUtil.logEntry();
		HttpStatus httpStatus = HttpStatus.OK;
		logger.debug("trying to get a user profile by city and service types");
		
	
		/* check the collection */
		/* validate input Param*/
		logger.debug("page" + page + ",size");
		if ((size > 0))
		{ 
			
			//logger.debug("city" + city + "services" + services + "page" + page + "size" + size);
			/*userProfileList = userProfileRepository.findByCustomQuery(city, services);*/
			this.userProfilePage = null;
			userProfileList = userProfileRepository.findByCustomQuery(city,services, page, size);
			//this.userProfilePage = userProfileRepository.findByBasicProfileInfoUserAddressCity(city, new PageRequest(page, size));
			//logger.debug(userProfilePage.toString());
		}
		else
		{
			logger.error("getUserProfilebyPageParams - invalid arguments");
			httpStatus = HttpStatus.BAD_REQUEST;
		}
		return new ResponseEntity<List<UserProfile>>(userProfileList,null, httpStatus);
	}
	
	/* this method allows to get a page of userProfiles based on page number and size */
	@RequestMapping(method = {RequestMethod.GET}, value = { "/list/serviceProviders/all" }, params = { "page", "size" }, produces = { "application/json" })
	@ResponseBody
	public ResponseEntity<List<UserProfile>> getServiceProviderUserProfiles(@RequestParam( "page" ) int page, @RequestParam( "size" ) int size,
		 HttpServletRequest req, HttpServletResponse res) throws IOException {
		List<UserProfile> userProfileList = null;
		LoggerUtil.logEntry();
		HttpStatus httpStatus = HttpStatus.OK;
		logger.debug("trying to get all service provider profiles");
	
		/* check the collection */
		/* validate input Param*/
		logger.debug("page" + page + ",size");
		if (( page >= 0) && (size > 0))
		{
			userProfileList = this.userProfileRepository.findServiceProviders(page, size);
			if (userProfileList.isEmpty())
			{
				logger.debug("did not find any service providers");
			}
			
		}
		else
		{
			logger.error("getUserProfilebyPageParams - invalid arguments");
			httpStatus = HttpStatus.BAD_REQUEST;
		}
		return new ResponseEntity<List<UserProfile>>(userProfileList,null, httpStatus);
	}

	
	/* This method allows the creation of a user profile */
	@RequestMapping(method = { RequestMethod.POST }, value = { "" }, consumes = { "application/json" })
	@ResponseBody
	public ResponseEntity<UserProfile> submitUserProfile(@RequestBody UserProfile userProfile,
			HttpServletRequest req, HttpServletResponse res) throws IOException {
		HttpStatus httpStatus = HttpStatus.OK;
		LoggerUtil.logEntry();
		logger.debug("in submit User Profile");
		if ((userProfile != null)) {
			/* check if a valid user exists, whom the profile belongs to */
			User currentUser = Util.getSessionUser(req);
			if (null != currentUser) {
				logger.debug("current user details" + currentUser.toString());
				/* save the user profile */
				this.userProfile = userProfile;
				if (this.userProfile.getUserId().equals(currentUser.getId())) {
					
					/* check - if a userProfile by this userID already exists, do not allow */
					if (this.userProfileRepository.findByUserId(this.userProfile.getUserId()) == null) {
					userProfileRepository.save(this.userProfile);
					logger.info("New User Profile created with details: "
							+ this.userProfile.toString());
					}
					else
					{
						httpStatus = HttpStatus.CONFLICT;
						logger.debug("resource already exists");
						this.userProfile = null;
					}
				} else {
					logger.error("Wrong user ID" + this.userProfile.getUserId());
					httpStatus = HttpStatus.UNAUTHORIZED;
					this.userProfile = null;
				}
			} else {
				this.userProfile = null;
				logger.error("No valid user session");
				httpStatus = HttpStatus.UNAUTHORIZED;;
			}
		} else {
			this.userProfile = null;
			logger.debug("In trouble Jharana");
			httpStatus = HttpStatus.BAD_REQUEST;

		}
		return new ResponseEntity<UserProfile>(this.userProfile, null, httpStatus);
	}
	

	

	/*@PathVariable(value = "userId") String userId */
	@RequestMapping(method = {RequestMethod.PUT}, value = { "/{userId}" }, consumes = { "application/json" })
	@ResponseBody
	public ResponseEntity<UserProfile> updateUserProfile(@RequestBody UserProfile userProfile,
			@PathVariable(value = "userId") String userId, HttpServletRequest req, HttpServletResponse res) throws IOException {
		
		this.userProfile = null;
		HttpStatus httpStatus = HttpStatus.OK;
		LoggerUtil.logEntry();
		logger.debug("trying to update a user Profile");
		
		if ((userProfile != null) && (userId != null)) {
			
			/* first check if we have valid user session*/
			User currentUser = Util.getSessionUser(req);
			if (null != currentUser) {
				logger.debug("current user details" + currentUser.getId());
				logger.debug("userPRofile ID" + userProfile.getId());
				
				
				if ( userProfile.getUserId().equals(currentUser.getId()) )
				{
					try {
					this.userProfile = null;
					this.userProfile = userProfileRepository.findByUserId(userId);
					
					if (this.userProfile != null)  {
					logger.debug("userPRofile from repo" + this.userProfile.toString());	
					/* set required fields */
					this.userProfile.setBasicProfileInfo(userProfile.getBasicProfileInfo());	
					this.userProfile.setFeatured(userProfile.isFeatured());
					this.userProfile.setIndividualInfo(userProfile.getIndividualInfo());
					this.userProfile.setServiceProviderInfo(userProfile.getServiceProviderInfo());
					this.userProfile.setStatus(userProfile.getStatus());
					this.userProfile.setUserTypes(userProfile.getUserTypes());
			
					
					userProfileRepository.save(this.userProfile);
					logger.info("User Profile update with details: "
							+ this.userProfile.toString());
						}
					} catch (Exception e)
					 {
						httpStatus = HttpStatus.NOT_FOUND;
						logger.error("userID not found in repositry");
						
					}
					
				} else {
					logger.error("Wrong user ID" + this.userProfile.getUserId());
					httpStatus = HttpStatus.UNAUTHORIZED;
				}
			} else {
				this.userProfile = null;
				logger.error("No valid user session");
				httpStatus = HttpStatus.UNAUTHORIZED;;
			}
		}
			
		else {
			/* Bad request */
			httpStatus = HttpStatus.BAD_REQUEST;
		}
		
		
		return new ResponseEntity<UserProfile>(this.userProfile, null, httpStatus);
	}	
	
	private void createUserProfile(){
		BasicProfileInfo basicProfileInfo = new BasicProfileInfo();
		ServiceProviderInfo	serviceProviderInfo = new ServiceProviderInfo();
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
	
	private void getUserProfilePage(int page, int size){
		LoggerUtil.logEntry();
		logger.debug("in getUserProfile()");
		/*Iterable<UserProfile> userProfiles;
		userProfiles = userProfileRepository.findAll();
		java.util.Iterator<UserProfile> upIterator = userProfiles.iterator();
		this.userProfile = upIterator.next();
		logger.debug(this.userProfile.toString());*/
		this.userProfilePage = null;
		this.userProfilePage = userProfileRepository.findAll(new PageRequest(page, size));	
		
	}
	
	
}
