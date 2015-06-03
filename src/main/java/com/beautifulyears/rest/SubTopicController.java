package com.beautifulyears.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.beautifulyears.domain.SubTopic;
import com.beautifulyears.repository.SubTopicRepository;
import com.beautifulyears.repository.custom.SubTopicRepositoryCustom;

/**
 * The REST based service for managing "subTopic"
 * 
 * @author jumpstart
 *
 */
@Controller
@RequestMapping({ "/subTopic" })
public class SubTopicController {

	private SubTopicRepository subTopicRepository;

	private MongoTemplate mongoTemplate;

	@Autowired
	public SubTopicController(SubTopicRepository subTopicRepository,
			SubTopicRepositoryCustom subTopicRepositoryCustom,
			MongoTemplate mongoTemplate) {
		this.subTopicRepository = subTopicRepository;
		this.mongoTemplate = mongoTemplate;
	}

	@RequestMapping(method = { RequestMethod.POST, RequestMethod.PUT }, consumes = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public SubTopic submitTopic(@RequestBody SubTopic subTopic) {

		if (subTopic != null && subTopic.getSubTopicId() != null) {
			subTopicRepository.save(subTopic);
		} else {

		}
		return subTopic;
	}

	@RequestMapping(method = { RequestMethod.GET }, params = { "id", "topicId" }, produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public List<SubTopic> allSubTopic(@RequestParam("id") String id,
			@RequestParam("topicId") String topicId) {
		Query q = new Query();
		if (id != null && id.length() > 0) {
			q.addCriteria(Criteria.where("_id").is(id));
		}
		if (topicId != null) {
			q.addCriteria(Criteria.where("topicId").is(topicId));
		}
		q.with(new Sort(Sort.Direction.ASC, "subTopicPosition"));
		List<SubTopic> list = mongoTemplate.find(q, SubTopic.class);
		return list;
	}

	@RequestMapping(method = { RequestMethod.DELETE }, params = { "id" })
	@ResponseBody
	public SubTopic deleteTopic(@RequestParam("id") String id) {
		SubTopic subTopic = null;
		if (id != null) {
			Query q = new Query();
			q.with(new Sort(Sort.Direction.DESC, "subTopicPosition"));
			q.addCriteria(Criteria.where("_id").is(id));
			List<SubTopic> list = mongoTemplate.find(q, SubTopic.class);
			if (list.size() == 1) {
				subTopic = list.get(0);
				subTopicRepository.delete(subTopic);
			}
		}
		return subTopic;
	}

	@RequestMapping(method = RequestMethod.GET, params = { "id" }, produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public SubTopic topic(@RequestParam("id") String id) {
		SubTopic subTopic = null;
		Query q = new Query();
		q.with(new Sort(Sort.Direction.DESC, "subTopicPosition"));
		q.addCriteria(Criteria.where("_id").is(id));
		List<SubTopic> list = mongoTemplate.find(q, SubTopic.class);
		if (list.size() == 1) {
			subTopic = list.get(0);
		}
		return subTopic;
	}

}
