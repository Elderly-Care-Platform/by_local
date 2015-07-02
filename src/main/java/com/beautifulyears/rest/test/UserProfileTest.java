package com.beautifulyears.rest.test;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

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
	
	/* this method allows to get first page of userProfiles*/
	@RequestMapping(method = {RequestMethod.GET}, value = { "/list" }, produces = { "application/json" })
	@ResponseBody
	public List<UserProfile> getUserProfilebyPage(
			HttpServletRequest req, HttpServletResponse res) throws IOException {
		LoggerUtil.logEntry();
		logger.debug("trying to test adding a user profile");
		/* Need to check, how to get page parameters and return corresponding page */
		/* check the collection */
		/* validate input Param*/
		
		createUserProfile();
		getUserProfilePage(0, 20);
		
		return this.userProfilePage.getContent();
	}
	
	/*@PathVariable(value = "discussType") String discussType*/
	@RequestMapping(method = {RequestMethod.GET}, value = { "/{userProfileID}" }, produces = { "application/json" })
	@ResponseBody
	public UserProfile getUserProfilebyID(@PathVariable(value = "userProfileID") String userProfileID,
			HttpServletRequest req, HttpServletResponse res) throws IOException {
		LoggerUtil.logEntry();
		this.userProfile = null;
		logger.debug("trying to get a user profile by ID");
		if (userProfileID != null) {
			
			this.userProfile = this.userProfileRepository.findOne(userProfileID);
			if (this.userProfile == null) {
				logger.error("did not find any profile mathcing ID");
				res.sendError(HttpServletResponse.SC_NOT_FOUND);
			}
		}
		else {
			logger.error("invalid parameter");
			res.sendError(HttpServletResponse.SC_BAD_REQUEST);
		}
		
		
		return this.userProfile;
	}
	
	/* this method allows to get a page of userProfiles based on page number and size */
	@RequestMapping(method = {RequestMethod.GET}, value = { "/list" }, params = { "page", "size" }, produces = { "application/json" })
	@ResponseBody
	public List<UserProfile> getUserProfilebyPageParams(@RequestParam( "page" ) int page, @RequestParam( "size" ) int size,
		 HttpServletRequest req, HttpServletResponse res) throws IOException {
		LoggerUtil.logEntry();
		logger.debug("trying to test adding a user profile");
	
		/* check the collection */
		/* validate input Param*/
		if (( page >= 0) && (size > 0))
		{
			/* check is at least one record exists.*/
			getUserProfilePage(page, size);
			if (this.userProfilePage.hasContent() == false) {
				logger.debug("There is nothing to retrieve");
			}
			
		}
		else
		{
			logger.error("getUserProfilebyPageParams - invalid arguments");
		}
		return this.userProfilePage.getContent();
	}

	/* This method allows the creation of a user profile */
	@RequestMapping(method = { RequestMethod.POST }, value = { "" }, consumes = { "application/json" })
	@ResponseBody
	public UserProfile submitUserProfile(@RequestBody UserProfile userProfile,
			HttpServletRequest req, HttpServletResponse res) throws IOException {
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
					userProfileRepository.save(this.userProfile);
					logger.info("New User Profile created with details: "
							+ this.userProfile.toString());
				} else {
					logger.error("Wrong user ID" + this.userProfile.getUserId());
					res.sendError(HttpServletResponse.SC_UNAUTHORIZED);
				}
			} else {
				this.userProfile = null;
				logger.error("No valid user session");
				res.sendError(HttpServletResponse.SC_UNAUTHORIZED);
			}
		} else {
			this.userProfile = null;
			logger.debug("In trouble Jharana");
			res.sendError(HttpServletResponse.SC_BAD_REQUEST);

		}
		return this.userProfile;
	}
	

	
	


	private boolean prepareAndValidateUserProfile(UserProfile userProfile) {
	// TODO Auto-generated method stub
	boolean isValid = true;
	
	if ((userProfile.getFirstName() == null) || (userProfile.getPrimaryEmail() == null) 
			|| (userProfile.getServices() == null) || (userProfile.getUserTypes() == null))
	{
		isValid = false;
		
	}
	
	return isValid;
	
	
}
	private void createUserProfile(){
		UserAddress userAddress = new UserAddress();
		
		LoggerUtil.logEntry();
		logger.debug("in testUserProfile.java");
		List<Integer> userTypeList = new ArrayList<Integer>();
		List<String> imageURLs = new ArrayList<String>();
		
		userTypeList.add(UserTypes.INSTITUTION_SERVICES);
		
		imageURLs.add("image1.jpg");
		imageURLs.add("image2.jpg");
		userProfile = new UserProfile();
		userProfile.setFirstName("Nighhtingales");
		userProfile.setProfileImage("xyz.url");
		userProfile.setHomeVisits(true);
		userProfile.setUserTypes(userTypeList);
		userProfile.setDescription("Beautiful home health care services");
		userProfile.setPrimaryEmail("abc@nighitngales.com");
		userProfile.setPrimaryPhoneNo("99723008321");
		userProfile.setWebsite("www.google.com");
		userProfile.setPhotoGalleryURLs(imageURLs);
		
		/* set address */
		userAddress.setCountry("India");
		userAddress.setCity("Bangalore");
		userAddress.setLocality("J P Nagar");
		userAddress.setStreetAddress("BG campus");
		userAddress.setZip("560078");
		userProfile.setUserAddress(userAddress);
		
		
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
		this.userProfilePage = userProfileRepository.findAll(new PageRequest(page, size));	
		
	}

}
