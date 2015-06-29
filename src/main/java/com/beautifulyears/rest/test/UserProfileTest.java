package com.beautifulyears.rest.test;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.beautifulyears.domain.User;
import com.beautifulyears.domain.UserProfile;
import com.beautifulyears.domain.UserTypes;
import com.beautifulyears.repository.UserProfileRepository;
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
	private Logger logger = LoggerFactory
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
		logger.debug("trying to test adding a user profile");
		/* Need to check, how to get page parameters and return corresponding page */
		/* check the collection */
		/* validate input Param*/
		
		createUserProfile();
		getUserProfilePage(0, 10);
		
		return this.userProfilePage.getContent();
	}
	
	/* this method allows to get a page of userProfiles*/
	@RequestMapping(method = {RequestMethod.GET}, value = { "/list" }, params = { "page", "size" }, produces = { "application/json" })
	@ResponseBody
	public List<UserProfile> getUserProfilebyPageParams(@RequestParam( "page" ) int page, @RequestParam( "size" ) int size,
		 HttpServletRequest req, HttpServletResponse res) throws IOException {
		logger.debug("trying to test adding a user profile");
	
		/* check the collection */
		/* validate input Param*/
		if (( page >= 0) && (size > 0))
		{
			/* check is at least one record exists.*/
			getUserProfilePage(page, size);
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
		
		logger.debug("in submit User Profile");
		if ((userProfile != null))
		{
			/* check if a valid user exists, whom the profile belongs to */
			User currentUser = Util.getSessionUser(req);
			if (null != currentUser) {
				/* set default values */
				/* save the user profile */
				this.userProfile = userProfile;
				this.userProfile.setUserId(currentUser.getId());
				userProfileRepository.save(this.userProfile);
				logger.info("New User Profile created with details: "+ this.userProfile.toString());
				
			}
			else
			{
				
				this.userProfile = null;
				logger.debug("In trouble Jharana");
				res.sendError(HttpServletResponse.SC_UNAUTHORIZED);
			}
		}	
		else 
		{
			this.userProfile = null;
			logger.debug("In trouble Jharana");
			res.sendError(HttpServletResponse.SC_BAD_REQUEST);
		}
		return this.userProfile;
		
	}
	
	

	
	


	public void createUserProfile(){
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
		
		
		userProfileRepository.save(userProfile);
		
		
		
	}
	
	public void getUserProfilePage(int page, int size){
		logger.debug("in getUserProfile()");
		/*Iterable<UserProfile> userProfiles;
		userProfiles = userProfileRepository.findAll();
		java.util.Iterator<UserProfile> upIterator = userProfiles.iterator();
		this.userProfile = upIterator.next();
		logger.debug(this.userProfile.toString());*/
		this.userProfilePage = userProfileRepository.findAll(new PageRequest(page, size));	
		
	}

}
