package com.beautifulyears.rest;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.jsoup.Jsoup;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.beautifulyears.constants.DiscussConstants;
import com.beautifulyears.domain.Discuss;
import com.beautifulyears.util.Util;
//import com.beautifulyears.domain.UserProfile;

@Controller
@RequestMapping("/addShortDesc")
public class TempShortDescriptionController {

	private MongoTemplate mongoTemplate;

	@Autowired
	public TempShortDescriptionController(
			MongoTemplate mongoTemplate) {
		this.mongoTemplate = mongoTemplate;
	}

	@RequestMapping(method = RequestMethod.GET, value = "", produces = MediaType.APPLICATION_JSON_VALUE)
	public @ResponseBody Object changePassword(HttpServletRequest req,
			HttpServletResponse res) throws Exception {
		List<Discuss> discussList = mongoTemplate.findAll(Discuss.class);
		for (Discuss discuss : discussList) {
			org.jsoup.nodes.Document doc = Jsoup.parse(discuss.getText());
			String domText = doc.text();
			if (domText.length() > DiscussConstants.DISCUSS_TRUNCATION_LENGTH) {
				discuss.setShortSynopsis(Util.truncateText(domText));
			}else{
				discuss.setShortSynopsis(domText);
			}
			mongoTemplate.save(discuss);
		}
		
		return null;
	}
}