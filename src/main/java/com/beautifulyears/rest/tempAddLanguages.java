/**
 * 
 */
package com.beautifulyears.rest;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.beautifulyears.domain.Language;
import com.beautifulyears.rest.response.BYGenericResponseHandler;

/**
 * @author Nitin
 *
 */
@Controller
@RequestMapping(value = { "/addLanguages" })
public class tempAddLanguages {

	private MongoTemplate mongoTemplate;

	@Autowired
	public tempAddLanguages(MongoTemplate mongoTemplate) {
		this.mongoTemplate = mongoTemplate;
	}

	@RequestMapping(method = { RequestMethod.GET }, value = { "/" }, produces = { "application/json" })
	@ResponseBody
	public Object addIsPromotion() throws Exception {
		if (mongoTemplate.findAll(Language.class).size() <= 0) {
			List<String> lang = new ArrayList<String>();
			lang.add("Assamese (Asamiya)");
			lang.add("Bengali");
			lang.add("Bodo");
			lang.add("Dogri");
			lang.add("Gujarati");
			lang.add("Hindi");
			lang.add("Kannada");
			lang.add("Kashmiri");
			lang.add("Konkani");
			lang.add("Maithili");
			lang.add("Malayalam");
			lang.add("Manipuri");
			lang.add("Marathi");
			lang.add("Nepali");
			lang.add("Odia");
			lang.add("Punjabi");
			lang.add("Sanskrit");
			lang.add("Santali");
			lang.add("Sindhi");
			lang.add("Tamil");
			lang.add("Telugu");
			lang.add("Urdu");
			for (String l : lang) {
				Language language = new Language();
				language.setName(l);
				mongoTemplate.save(language);
			}
		}

		return BYGenericResponseHandler.getResponse(null);
	}
}
