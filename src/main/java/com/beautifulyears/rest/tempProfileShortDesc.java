package com.beautifulyears.rest;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.beautifulyears.domain.User;
import com.beautifulyears.domain.UserProfile;
import com.beautifulyears.util.Util;

@RequestMapping("/temp")
@Controller
public class tempProfileShortDesc {

	@Autowired
	private MongoTemplate mongoTemplate;
	
	@RequestMapping(method = { RequestMethod.GET }, value = { "/" }, produces = { "application/json" })
	@ResponseBody
	public Object getUserProfilebyID(
			HttpServletRequest req, HttpServletResponse res) throws Exception {
		List<UserProfile> profiles = mongoTemplate.findAll(UserProfile.class);
		for (UserProfile userProfile : profiles) {
			if(userProfile.getBasicProfileInfo() != null){
				if(userProfile.getBasicProfileInfo().getDescription() != null){
					userProfile.getBasicProfileInfo().setShortDescription(getShortDescription(userProfile));
				}else{
					userProfile.getBasicProfileInfo().setShortDescription(null);
				}
			}
			mongoTemplate.save(userProfile);
		}
		
		return null;
	}
	
	private String getShortDescription(UserProfile profile){
		String shortDescription = null;
		if(null != profile.getBasicProfileInfo() && null != profile.getBasicProfileInfo().getDescription()){
			Document doc = Jsoup.parse(profile
					.getBasicProfileInfo()
					.getDescription());
			String desc = Util.truncateText(doc.text());
			if(!desc.equals(shortDescription)){
				shortDescription = desc;
			}
		}
		System.out.println("++++++++++++++++++++++++++++++++++++++++");
		System.out.println(shortDescription);
		return shortDescription;
	}
}
