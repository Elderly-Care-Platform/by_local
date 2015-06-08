package com.beautifulyears.rest;

import java.util.Iterator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.beautifulyears.domain.Topic;
import com.beautifulyears.repository.TopicRepository;
import com.beautifulyears.repository.custom.TopicRepositoryCustom;
import com.beautifulyears.rest.response.TopicResponse;

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

	@RequestMapping(method = { RequestMethod.GET }, value = "/list/all", produces = { "application/json" })
	@ResponseBody
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public List findAll() {
		TopicResponse res = new TopicResponse();
		Query q = new Query();
		List<Topic> list = this.mongoTemplate.find(q, (Class) Topic.class);
		res.addTopics(list);
		return res.getResponse();
	}

	@RequestMapping(method = { RequestMethod.POST }, value = "/list/insert", consumes = { "application/json" })
	@ResponseBody
	public ResponseEntity<Void> insert(@RequestBody Topic topic) {
		this.mongoTemplate.save(topic);

		ResponseEntity<Void> responseEntity = new ResponseEntity<Void>(
				HttpStatus.CREATED);
		return responseEntity;
	}

	@RequestMapping(method = { RequestMethod.POST }, value = "/list/insertAll", consumes = { "application/json" })
	@ResponseBody
	public ResponseEntity<Void> insert(@RequestBody List<Topic> topicArray) {
		for (Iterator<Topic> iterator = topicArray.iterator(); iterator
				.hasNext();) {
			Topic topic = (Topic) iterator.next();
			this.mongoTemplate.save(topic);
		}

		ResponseEntity<Void> responseEntity = new ResponseEntity<Void>(
				HttpStatus.CREATED);
		return responseEntity;
	}

	@RequestMapping(method = { RequestMethod.POST }, value = "/list/linkAll", consumes = { "application/json" })
	@ResponseBody
	public ResponseEntity<Void> link(@RequestBody List<String> linksArray) {
		for (Iterator<String> iterator = linksArray.iterator(); iterator
				.hasNext();) {
			String linkString = (String) iterator.next();
			String parent = linkString.split(":")[0];
			String child = linkString.split(":")[1];

			if (null != parent && null != child) {
				Query parentQuery = new Query();
				parentQuery.addCriteria(Criteria.where("topicName").is(
						(String) parent));
				Topic parentTopic = this.mongoTemplate.findOne(parentQuery,
						(Class) Topic.class);

				Query childQuery = new Query();
				childQuery.addCriteria(Criteria.where("topicName").is(
						(String) child));
				Topic childTopic = this.mongoTemplate.findOne(childQuery,
						(Class) Topic.class);
				if (null != parentTopic && null != childTopic) {
					parentTopic.getChildren().add(childTopic.getId());
					childTopic.setParentId(parentTopic.getId());

					mongoTemplate.save(parentTopic);
					mongoTemplate.save(childTopic);
				} else {
					System.out
							.println("No entry matched for the combination of "
									+ parent + "and " + child);
				}
			} else {
				System.out.println("No entry matched for the combination of "
						+ parent + "and " + child);
			}
		}

		ResponseEntity<Void> responseEntity = new ResponseEntity<Void>(
				HttpStatus.CREATED);
		return responseEntity;
	}

}
