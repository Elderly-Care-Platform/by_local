package com.beautifulyears.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.beautifulyears.domain.Topic;
import com.beautifulyears.repository.TopicRepository;
import com.beautifulyears.repository.custom.TopicRepositoryCustom;

/**
 * The REST based service for managing "discuss"
 * 
 * @author jumpstart
 *
 */
@Controller
@RequestMapping({ "/topic" })
public class TopicController {

	private TopicRepository topicRepository;

	private MongoTemplate mongoTemplate;

	@Autowired
	public TopicController(TopicRepository topicRepository,
			TopicRepositoryCustom topicRepositoryCustom,
			MongoTemplate mongoTemplate) {
		this.topicRepository = topicRepository;
		this.mongoTemplate = mongoTemplate;
	}

	@RequestMapping(method = { RequestMethod.POST, RequestMethod.PUT }, consumes = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Topic submitTopic(@RequestBody Topic topic) {

		if (topic != null && topic.getTopicId() != null) {
			topicRepository.save(topic);
		} else {

		}
		return topic;
	}

	@RequestMapping(method = { RequestMethod.GET }, produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public List<Topic> allTopic() {
		Query q = new Query();
		q.with(new Sort(Sort.Direction.ASC, "topicPosition"));
		List<Topic> list = mongoTemplate.find(q, Topic.class);
		return list;
	}

	@RequestMapping(method = { RequestMethod.DELETE }, params = { "id" })
	@ResponseBody
	public Topic deleteTopic(@RequestParam("id") String id) {
		Topic topic = null;
		if (id != null) {
			Query q = new Query();
			q.with(new Sort(Sort.Direction.DESC, "topicTitle"));
			q.addCriteria(Criteria.where("_id").is(id));
			List<Topic> list = mongoTemplate.find(q, Topic.class);
			if (list.size() == 1) {
				topic = list.get(0);
				topicRepository.delete(topic);
			}
		}
		return topic;
	}

	@RequestMapping(method = RequestMethod.GET, params = { "id" }, produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Topic topic(@RequestParam("id") String id) {
		Topic topic = null;
		Query q = new Query();
		q.with(new Sort(Sort.Direction.DESC, "topicTitle"));
		q.addCriteria(Criteria.where("_id").is(id));
		List<Topic> list = mongoTemplate.find(q, Topic.class);
		if (list.size() == 1) {
			topic = list.get(0);
		}
		return topic;
	}

}
