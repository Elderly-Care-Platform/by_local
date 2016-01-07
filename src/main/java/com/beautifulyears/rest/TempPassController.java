package com.beautifulyears.rest;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.beautifulyears.domain.User;
import com.beautifulyears.util.Util;
//import com.beautifulyears.domain.UserProfile;

@Controller
@RequestMapping("/changePWD")
public class TempPassController {

	private MongoTemplate mongoTemplate;

	@Autowired
	public TempPassController(
			MongoTemplate mongoTemplate) {
		this.mongoTemplate = mongoTemplate;
	}

	@RequestMapping(method = RequestMethod.GET, value = "", produces = MediaType.APPLICATION_JSON_VALUE)
	public @ResponseBody Object changePassword(HttpServletRequest req,
			HttpServletResponse res) throws Exception {
		List<User> users = new ArrayList<User>();
		users = mongoTemplate.findAll(User.class);
		for(User user : users){
			if(!Util.isEmpty(user.getPassword())){
				user.setPassword(Util.getEncodedPwd(user.getPassword()));
				System.out.println(user.getId()+"-"+user.getPassword());
				mongoTemplate.save(user);
			}
		}
		return null;
	}
}