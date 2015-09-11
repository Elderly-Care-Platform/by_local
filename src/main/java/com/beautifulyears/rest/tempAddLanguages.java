/**
 * 
 */
package com.beautifulyears.rest;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
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
		mongoTemplate.remove(new Query(), Language.class);
		List<String> lang = new ArrayList<String>();
		lang.add("Assamese (Asamiya)");
		lang.add("Bengali");
		lang.add("Bodo");
		lang.add("Dogri");
		lang.add("English");
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
		lang.add("Mandarin");
		lang.add("Spanish");
		lang.add("Arabic");
		lang.add("Portuguese");
		lang.add("Russian");
		lang.add("Japanese");
		lang.add("German");
		lang.add("Javanese");
		lang.add("Wu");
		lang.add("Malay/Indonesian");
		lang.add("Vietnamese");
		lang.add("Korean");
		lang.add("French");
		lang.add("Turkish");
		lang.add("Italian");
		lang.add("Yue");
		lang.add("Thai");
		lang.add("Jin");
		lang.add("Southern Min");
		lang.add("Persian");
		lang.add("Polish");
		lang.add("Pashto");
		lang.add("Xiang");
		lang.add("Sundanese");
		lang.add("Hausa");
		lang.add("Burmese");
		lang.add("Hakka");
		lang.add("Ukrainian");
		lang.add("Bhojpuri");
		lang.add("Tagalog");
		lang.add("Yoruba");
		lang.add("Uzbek");
		lang.add("Amharic");
		lang.add("Fula");
		lang.add("Romanian");
		lang.add("Oromo");
		lang.add("Igbo");
		lang.add("Azerbaijani");
		lang.add("Awadhi");
		lang.add("Gan Chinese");
		lang.add("Cebuano");
		lang.add("Dutch");
		lang.add("Kurdish");
		lang.add("Serbo-Croatian");
		lang.add("Malagasy");
		lang.add("Saraiki");
		lang.add("Sinhalese");
		lang.add("Chittagonian");
		lang.add("Zhuang");
		lang.add("Khmer");
		lang.add("Turkmen");
		lang.add("Madurese");
		lang.add("Somali");
		lang.add("Marwari");
		lang.add("Magahi");
		lang.add("Haryanvi");
		lang.add("Hungarian");
		lang.add("Chhattisgarhi");
		lang.add("Greek");
		lang.add("Chewa");
		lang.add("Deccan");
		lang.add("Akan");
		lang.add("Kazakh");
		lang.add("Northern Min");
		lang.add("Sylheti");
		lang.add("Zulu");
		lang.add("Czech");
		lang.add("Kinyarwanda");
		lang.add("Dhundhari");
		lang.add("Haitian Creole");
		lang.add("Eastern Min");
		lang.add("Ilocano");
		lang.add("Quechua");
		lang.add("Kirundi");
		lang.add("Swedish");
		lang.add("Hmong");
		lang.add("Shona");
		lang.add("Uyghur");
		lang.add("Hiligaynon");
		lang.add("Mossi");
		lang.add("Xhosa");
		lang.add("Belarusian");
		lang.add("Balochi");
		lang.add("Hebrew");
		for (String l : lang) {
			Language language = new Language();
			language.setName(l);
			Query q = new Query();
			q.addCriteria(Criteria.where("name").regex(l, "i"));
			Language existing = mongoTemplate.findOne(q, Language.class);
			if(null == existing){
				mongoTemplate.save(language);
			}
			
		}

		return BYGenericResponseHandler.getResponse(null);
	}
}
