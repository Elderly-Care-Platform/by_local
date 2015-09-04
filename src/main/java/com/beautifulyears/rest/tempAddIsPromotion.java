/**
 * 
 */
package com.beautifulyears.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.beautifulyears.domain.Discuss;
import com.beautifulyears.rest.response.BYGenericResponseHandler;

/**
 * @author Nitin
 *
 */
@Controller
@RequestMapping(value = { "/addIsPromotion" })
public class tempAddIsPromotion {

	private MongoTemplate mongoTemplate;

	@Autowired
	public tempAddIsPromotion(MongoTemplate mongoTemplate) {
		this.mongoTemplate = mongoTemplate;
	}

	@RequestMapping(method = { RequestMethod.GET }, value = { "/" }, produces = { "application/json" })
	@ResponseBody
	public Object addIsPromotion() throws Exception {
		List<Discuss> discussList = mongoTemplate.findAll(Discuss.class);
		for (Discuss discuss : discussList) {
			discuss.setPromotion(false);
			mongoTemplate.save(discuss);
		}
		return BYGenericResponseHandler.getResponse(null);
	}
}
